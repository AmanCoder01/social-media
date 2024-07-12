import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to mongodb");

    } catch (error) {
        console.log("error", error)
    }
}