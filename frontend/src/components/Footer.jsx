import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"

import { CgProfile } from 'react-icons/cg'
import { MdChatBubble, MdHome, MdSearch, MdVideocam } from 'react-icons/md'

const sidebar = [
    {
        title: "Home",
        path: "/",
        icon: <MdHome className='text-3xl ' />
    },
    {
        title: "Reels",
        path: "/reels",
        icon: <MdVideocam className='text-3xl ' />
    },
    {
        title: "Search",
        path: "/search",
        icon: <MdSearch className='text-3xl ' />
    },
    {
        title: "Chats",
        path: "/chats",
        icon: <MdChatBubble className='text-[1.4rem] ' />
    },
    {
        title: "Profile",
        path: "/profile",
        icon: <CgProfile className='text-3xl ' />
    }
]


const Footer = () => {
    const path = useLocation().pathname;

    return (
        <div className='bg-gray-100 h-full z-50 border-t-2'>
            <div className='flex items-center px-3 justify-between'>
                {
                    sidebar.map((item, index) => (
                        <Link to={item.path} key={index}
                            className={`flex flex-col items-center cursor-pointer p-2 py-3 gap-4 hover:text-green-500 rounded-sm ${path === item.path ? 'text-gray-900' : 'text-gray-600'}`}>
                            {item.icon}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Footer
