import { Post } from "../models/post.model.js";
import { tryCatch } from "../utils/tryCatch.js";
import { getDataUrl } from "../utils/urlGenerator.js";
import cloudinary from "cloudinary"


export const newPost = tryCatch(async (req, res) => {
    const { caption } = req.body;

    const ownerId = req.user._id;

    const file = req.file;

    if (!file) {
        res.status(400).json({
            message: "Please post something",
        })
    }

    const fileUrl = getDataUrl(file);

    let option;

    const type = req.query.type;

    if (type === "reel") {
        option = {
            resource_type: "video"
        }
    } else {
        option = {}
    }

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);


    const posts = await Post.create({
        caption,
        post: {
            id: myCloud.public_id,
            url: myCloud.secure_url
        },
        type,
        owner: ownerId
    })

    const post = await Post.findById(posts._id)
        .populate("owner", "-password")



    res.status(200).json({
        message: "Post created",
        post
    })

})




export const deletePost = tryCatch(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404).json({
            message: "Post Not Found with this id",
        })
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        res.status(403).json({
            message: "You are not owner of this post",
        })
    }

    await cloudinary.v2.uploader.destroy(post.post.id);

    await post.deleteOne();

    res.status(200).json({
        message: "Post deleted"
    })

})






export const getAllPosts = tryCatch(async (req, res) => {
    const posts = await Post.find({ type: "post" })
        .sort({ createdAt: -1 })
        .populate("owner", "-password")
        .populate("comments.user",
            "-password"
        )

    const reels = await Post.find({ type: "reel" })
        .sort({ createdAt: -1 })
        .populate("owner", "-password")
        .populate("comments.user",
            "-password"
        )

    //sort comments on the basis of createAt
    posts.forEach((item) => {
        item.comments.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
    })

    res.status(200).json({
        posts, reels
    })

})




export const likeUnlikePost = tryCatch(async (req, res) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404).json({
            message: "Post Not Found with this id",
        })
    }

    const loggedUser = req.user._id;

    if (post.likes.includes(loggedUser)) {
        const index = post.likes.indexOf(loggedUser);
        post.likes.splice(index, 1);

        await post.save();

        res.json({
            message: "Post Unliked",
            likes: post.likes
        })

    } else {
        post.likes.push(loggedUser);

        await post.save();

        res.json({
            message: "Post Liked",
            likes: post.likes

        })
    }
})



export const commentPost = tryCatch(async (req, res) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404).json({
            message: "Post Not Found with this id",
        })
    }

    post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
    })

    await post.save();

    const posts = await Post.findById(req.params.id)
        .populate("owner")
        .populate("comments.user",
            "-password"
        );


    posts.comments.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    res.json({
        message: "Comment Added",
        posts
    })
})




export const deleteComment = tryCatch(async (req, res) => {


    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404).json({
            message: "Post Not Found with this id",
        })
    }

    if (!req.query.commentId) {
        res.status(404).json({
            message: "Please give comment id",
        })
    }

    const commentIndex = post.comments.findIndex((item) =>
        item._id.toString() === req.query.commentId.toString()
    );

    if (commentIndex === -1) {
        res.status(404).json({
            message: "Comment not found",
        })
    }

    const comment = post.comments[commentIndex];


    if (post.owner.toString() === req.user._id.toString() ||
        comment.user.toString() === req.user._id.toString()) {

        post.comments.splice(commentIndex, 1);

        await post.save();

        res.json({
            message: "Comment Deleted"
        })
    } else {
        res.status(404).json({
            message: "You are not allowed to delete this comment",
        })
    }
})





export const editCaption = tryCatch(async (req, res) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404).json({
            message: "Post Not Found with this id",
        })
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        res.status(403).json({
            message: "You are not owner of this course",
        })
    }

    post.caption = req.body.caption;

    await post.save();


    res.json({
        message: "Post Updated"
    })
})






