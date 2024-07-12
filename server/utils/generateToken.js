import jwt from "jsonwebtoken"


const cookieOptions = {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};

export const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
    })

    res.cookie("token", token, cookieOptions)
}