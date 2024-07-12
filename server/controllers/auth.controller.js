import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { tryCatch } from "../utils/tryCatch.js";
import { getDataUrl } from "../utils/urlGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary"



export const registerUser = tryCatch(async (req, res) => {
    const { name, email, password, gender } = req.body;

    const file = req.file;

    if (!name || !email || !password || !gender || !file) {
        return res.status(400).json({
            message: "Please enter all details"
        })
    }

    const exitUser = await User.findOne({ email });

    if (exitUser) {
        return res.status(400).json({
            message: "User already exist"
        })
    }

    const fileUrl = getDataUrl(file);

    const hashedPassword = await bcrypt.hash(password, 10);

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content)


    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        gender,
        profilePic: {
            id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })

    generateToken(user._id, res);

    return res.status(200).json({
        message: "User Registered successfully",
        user
    })

})










export const loginUser = tryCatch(async (req, res) => {

    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter all details"
        })
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "Invalid Credentials"
        })
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    generateToken(user._id, res);

    return res.status(200).json({
        message: "Login successfully",
        user
    })
})



const cookieOptions = {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};


export const logoutUser = tryCatch((req, res) => {
    res.cookie("token", "", { ...cookieOptions, maxAge: 0 }).json({
        message: "Logout successfully"
    })
})