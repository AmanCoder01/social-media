import React from 'react'
import { UserData } from '../../context/UserContext';
import { BsSendCheck } from "react-icons/bs"

const ChatCard = ({ chat, setSelectedChat, selectedChat, isOnline }) => {
    const { user: loggedInUser } = UserData();
    let user;

    if (chat) {
        user = chat.users[0];
    }
    return (
        <>
            {
                user && (
                    <div className={`border rounded-lg p-1 bg-gray-100 px-2 cursor-pointer hover:bg-gray-300 ${selectedChat && ""} `} onClick={() => setSelectedChat(chat)}>
                        <div className='flex items-center gap-3 relative'>
                            <img src={user?.profilePic?.url} alt="" className='w-9 h-9 rounded-full' />
                            <div className='flex flex-col '>
                                {isOnline && <div className='absolute text-4xl left-0 bottom-1 animate-pulse  bg-green-500 h-3 w-3 rounded-full '></div>}
                                <span>{user.name}</span>
                                <span className='flex items-center gap-2'>
                                    {
                                        loggedInUser._id === chat.latestMessage.sender ? <BsSendCheck className='text-blue-500' /> : ""
                                    }
                                    {chat.latestMessage.text.slice(0, 18)}...
                                </span>
                            </div>
                        </div>
                    </div >
                )
            }
        </>
    )
}

export default ChatCard
