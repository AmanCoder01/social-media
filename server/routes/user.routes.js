import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { followUnfollowUser, getAllUsers, myProfile, updatPassword, updatProfile, userFollowerFollowingData, userProfile } from "../controllers/user.controller.js";
import uploadFile from "../middlewares/multer.js";

const router = express.Router();

router.get("/all", isAuth, getAllUsers);
router.get("/me", isAuth, myProfile);
router.get("/:id", isAuth, userProfile);
router.put("/:id", isAuth, uploadFile, updatProfile);
router.post("/:id", isAuth, updatPassword);
router.post("/follow/:id", isAuth, followUnfollowUser);
router.get("/followdata/:id", isAuth, userFollowerFollowingData);


export default router