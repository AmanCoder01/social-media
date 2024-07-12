import React, { useState } from "react";
import { ChatData } from "../../context/ChatContext";
import toast from "react-hot-toast";
import axios from "axios";

const MessageInput = ({ setMessages, selectedChat }) => {
    const [textMsg, setTextMsg] = useState("");
    const { setChats } = ChatData();

    const handleMessage = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/messages", {
                message: textMsg,
                recieverId: selectedChat.users[0]._id,
            });

            setMessages((message) => [...message, data]);
            setTextMsg("");
            setChats((prev) => {
                const updatedChat = prev.map((chat) => {
                    if (chat._id === selectedChat._id) {
                        return {
                            ...chat,
                            latestMessage: {
                                text: textMsg,
                                sender: data.sender,
                            },
                        };
                    }

                    return chat;
                });

                return updatedChat;
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };


    return (
        <div className="w-full h-full">
            <form onSubmit={handleMessage} className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Enter Message ..."
                    className="border border-gray-300 py-2 w-full outline-none px-3"
                    value={textMsg}
                    onChange={(e) => setTextMsg(e.target.value)}
                    required
                />
                <button type="submit" className="bg-green-500 py-2 px-4 rounded-sm ">
                    Send
                </button>
            </form>
        </div>
    );
};

export default MessageInput;