import jwt from "jsonwebtoken"

import { User } from "../models/user.model.js";

export const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(403).json({
                message: "Unauthorized"
            })
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedData) {
            return res.status(400).json({
                message: "Token Expired"
            })
        }

        req.user = await User.findById(decodedData.id);
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Please Login"
        })
    }
}