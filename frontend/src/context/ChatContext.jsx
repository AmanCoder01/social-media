import axios from "axios";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { apiUrl } from "../service";


const ChatContext = createContext();


export const ChatContextProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);


    async function createChat(id) {
        try {
            const res = await axios.post(`${apiUrl}/api/messages`, {
                recieverId: id,
                message: "hi"
            })
            console.log(res);

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }


    return (
        <ChatContext.Provider value={{
            createChat,
            selectedChat,
            setSelectedChat,
            chats,
            setChats
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatData = () => useContext(ChatContext);