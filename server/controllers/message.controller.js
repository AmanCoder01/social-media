
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/messages.model.js";
import { getReciverSocketId, io } from "../socket/socket.js";
import { tryCatch } from "../utils/tryCatch.js";


export const sendMessage = tryCatch(async (req, res) => {
    const { recieverId, message } = req.body;

    const senderId = req.user._id;

    if (!recieverId) {
        res.status(403).json({
            message: "Please give reciver id"
        })
    }

    let chat = await Chat.findOne({
        users: { $all: [senderId, recieverId] }
    })

    if (!chat) {
        chat = new Chat({
            users: [senderId, recieverId],
            latestMessage: {
                text: message,
                sender: senderId
            }
        })

        await chat.save();
    }

    const newMessage = new Message({
        chatId: chat._id,
        sender: senderId,
        text: message
    })

    await newMessage.save();

    await chat.updateOne({
        latestMessage: {
            text: message,
            sender: senderId
        }
    })

    const reciverSocketId = getReciverSocketId(recieverId);

    if (reciverSocketId) {
        io.to(reciverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage)
})


export const getAllMessages = tryCatch(async (req, res) => {
    const { id } = req.params;

    const userId = req.user._id;

    const chat = await Chat.findOne({
        users: { $all: [userId, id] }
    })

    if (!chat) {
        res.status(403).json({
            message: "No chat found"
        })
    }

    const messages = await Message.find({
        chatId: chat._id
    })

    res.status(201).json(messages)
})




export const getAllChats = tryCatch(async (req, res) => {
    const chats = await Chat.find({
        users: req.user._id
    }).populate({
        path: "users",
        select: "name profilePic"
    })

    chats.forEach((e) => {
        e.users = e.users.filter(
            user => user._id.toString() !== req.user._id.toString()
        )
    })

    res.json(chats)
})