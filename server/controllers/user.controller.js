import { User } from "../models/user.model.js";
import { tryCatch } from "../utils/tryCatch.js";
import { getDataUrl } from "../utils/urlGenerator.js";
import cloudinary from "cloudinary"
import bcrypt from "bcrypt"

export const myProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    return res.json({
        user
    })
})


export const userProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User Not Found with this id"
        })
    }

    return res.json({
        user
    })
})




export const followUnfollowUser = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!user) {
        return res.status(403).json({
            message: "User not found with this id"
        })
    }

    if (user._id.toString() === loggedInUser._id.toString()) {
        return res.status(403).json({
            message: "You can't follow yourself"
        })
    }

    if (user.followers.includes(loggedInUser._id)) {
        const indexFollowing = loggedInUser.followings.indexOf(user._id);
        const indexFollower = user.followers.indexOf(loggedInUser._id);

        loggedInUser.followings.splice(indexFollowing, 1);
        user.followers.splice(indexFollower, 1);

        await user.save()
        await loggedInUser.save()

        return res.json({
            message: "User Unfollowed"
        })
    } else {
        loggedInUser.followings.push(user._id);
        user.followers.push(loggedInUser._id);

        await user.save()
        await loggedInUser.save()

        return res.json({
            message: "User Followed"
        })
    }
})



export const userFollowerFollowingData = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers", "-password")
        .populate("followings", "-password");


    const followers = user.followers
    const followings = user.followings

    if (!user) {
        return res.status(403).json({
            message: "User not found with this id"
        })
    }

    return res.json({
        followers,
        followings
    })

})



export const updatProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (req.body.name) {
        user.name = req.body.name
    }

    const file = req.file;
    console.log(file);
    console.log(req.body.name);


    if (file) {
        const fileUrl = getDataUrl(file);
        await cloudinary.v2.uploader.destroy(user.profilePic.id)

        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content)

        user.profilePic.id = myCloud.public_id;
        user.profilePic.url = myCloud.secure_url;
    }

    await user.save();

    res.json({
        message: "Profile Updated"
    })

})


export const updatPassword = tryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(403).json({
            message: "Please enter all the fields"
        })
    }

    const comparePassword = await bcrypt.compare(oldPassword, user.password);

    if (!comparePassword) {
        return res.status(400).json({
            message: "Wrong old password"
        })
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();


    res.json({
        message: "Password Updated"
    })
})



export const getAllUsers = tryCatch(async (req, res) => {
    const search = req.query.search || "";

    const users = await User.find({
        name: {
            $regex: search,
            $options: "i"
        },
        _id: {
            $ne: req.user._id
        }
    }).select("-password");

    res.json(users);
})