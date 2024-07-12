import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client"
import { UserData } from "./UserContext";

// const endPoint = "http://localhost:3000"
const endPoint = "https://chat-book-n7ww.onrender.com"

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = UserData();


    useEffect(() => {
        const socket = io(endPoint, {
            query: {
                userId: user?._id
            }
        });
        setSocket(socket);


        socket.on("getOnlineUser", (users) => {
            setOnlineUsers(users);
        })

        return () => socket && socket.close();
    }, [user?._id])

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}

export const SocketData = () => useContext(SocketContext);