import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./database/db.js";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser"
import cors from 'cors';
import { server, app } from "./socket/socket.js";
import path from "path";

dotenv.config();


const corsOption = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
}


cloudinary.v2.config({
    cloud_name: process.env.CLODINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
});


const port = process.env.PORT || 7000;


// using middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(cors(corsOption));


//importing routes
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import messageRoutes from "./routes/message.route.js"


//using routes

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})