import React, { useEffect, useRef, useState } from 'react'
import { UserData } from '../../context/UserContext';
import axios from 'axios';
import { Spinner } from '../Spinner';
import Message from './Message';
import MessageInput from './MessageInput';
import { SocketData } from '../../context/SocketContext';
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const MessagesContainer = ({ setChats, selectedChat }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = UserData();
    const { socket } = SocketData();


    useEffect(() => {
        socket.on("newMessage", (message) => {
            if (selectedChat._id === message.chatId) {
                setMessages((prev) => [...prev, message])
            }


            setChats((prev) => {
                const updatedChat = prev.map((chat) => {
                    if (chat._id === message.chatId) {
                        return {
                            ...chat,
                            latestMessage: {
                                text: message.text,
                                sender: message.sender
                            }
                        }
                    }
                    return chat;
                })
                return updatedChat;
            })

        })



        return () => socket.off("newMessage");
    }, [socket, selectedChat, setChats])



    async function fetchMessages() {
        setLoading(true);
        try {
            const { data } = await axios.get(
                "/api/messages/" + selectedChat.users[0]._id
            );

            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);


    const messageCOntainerRef = useRef(null);

    useEffect(() => {
        if (messageCOntainerRef.current) {
            messageCOntainerRef.current.scrollTop = messageCOntainerRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div className='h-full w-full z-10'>
            {
                selectedChat && (
                    <div className="flex flex-col justify-center ">
                        <div className="flex w-full h-[6vh] items-center gap-3 bg-gray-300 rounded-md px-4 pl-10 md:pl-0 ">
                            <img
                                src={selectedChat.users[0].profilePic.url}
                                className="w-8 h-8 rounded-full"
                                alt=""
                            />
                            <span>{selectedChat.users[0].name}</span>
                        </div>



                        {
                            loading ? <div className='h-full flex items-center justify-center mt-16'>
                                <Spinner />
                            </div>


                                :

                                (
                                    <>
                                        <div ref={messageCOntainerRef}
                                            className="flex flex-col gap-4 h-[74vh]   md:min-h-[81vh] md:max-h-[80vh] overflow-auto border border-gray-300 bg-gray-100 p-3"
                                        >
                                            {messages &&
                                                messages.map((e, index) => (
                                                    <Message key={index}
                                                        message={e.text}
                                                        ownMessage={e.sender === user._id && true}
                                                    />
                                                ))}
                                        </div>


                                        <MessageInput
                                            setMessages={setMessages}
                                            selectedChat={selectedChat}
                                        />
                                    </>
                                )
                        }
                    </div>

                )
            }

        </div>
    )
}

export default MessagesContainer
