import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { commentPost, deleteComment, deletePost, editCaption, getAllPosts, likeUnlikePost, newPost } from "../controllers/post.controller.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.post("/new", isAuth, uploadFile, newPost); //create post
router.put("/:id", isAuth, editCaption); // update post
router.get("/all", isAuth, getAllPosts);  // see all posts
router.delete("/:id", isAuth, deletePost); // delete post

router.post("/like/:id", isAuth, likeUnlikePost); // like or unlike post
router.post("/comment/:id", isAuth, commentPost); // comment on post
router.delete("/comment/:id", isAuth, deleteComment); // delete comment

export default router