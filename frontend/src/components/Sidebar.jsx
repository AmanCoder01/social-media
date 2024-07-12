import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { MdHome, MdPeopleAlt, MdVideocam, MdChatBubble, MdLogout, MdSearch } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { UserData } from '../context/UserContext';
import { RiLockPasswordFill } from "react-icons/ri";


const sidebar = [
    {
        title: "Home",
        path: "/",
        icon: <MdHome className='text-2xl' />
    },
    {
        title: "Reels",
        path: "/reels",
        icon: <MdVideocam className='text-2xl' />
    },
    {
        title: "Search",
        path: "/search",
        icon: <MdSearch className='text-2xl' />
    },
    {
        title: "Chats",
        path: "/chats",
        icon: <MdChatBubble className='text-[1.4rem]' />
    },
    {
        title: "Profile",
        path: "/profile",
        icon: <CgProfile className='text-2xl' />
    },
    {
        title: "ChangePassword",
        path: "/change-password",
        icon: <RiLockPasswordFill className='text-2xl' />
    },
    {
        title: "Logout",
        icon: <MdLogout className='text-2xl' />
    },
]

const Sidebar = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();

    const { logoutUser } = UserData();

    const logoutHandler = () => {
        logoutUser(navigate);
    }

    return (
        <div className='w-full h-full border-r shadow-md'>
            <div className='flex flex-col  pt-1'>
                {
                    sidebar.map((item, index) => (
                        <Link to={item.path} key={index}
                            onClick={item.title === "Logout" ? logoutHandler : undefined}
                            className={`flex items-center cursor-pointer p-2 py-3 gap-4 hover:bg-gray-200 rounded-sm ${path === item.path && 'bg-gray-300'}`}>
                            {item.icon}
                            <h1 className='text-lg font-semibold'>{item.title}</h1>
                        </Link>
                    ))
                }
            </div >
        </div >
    )
}

export default Sidebar
