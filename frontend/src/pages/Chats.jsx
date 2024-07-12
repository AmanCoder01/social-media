import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { ChatData } from '../context/ChatContext'
import axios from 'axios';
import { MdChatBubble, MdSearch } from 'react-icons/md';
import { Link } from 'react-router-dom';
import ChatCard from '../components/chats/ChatCard';
import { UserData } from '../context/UserContext';
import MessagesContainer from '../components/chats/MessagesContainer';
import { SocketData } from '../context/SocketContext';
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const Chats = () => {
    const { createChat, selectedChat, setSelectedChat, chats, setChats } = ChatData();
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState(false);
    const [sidebar, setSidebar] = useState(false);
    const { user: loggedInUser } = UserData();
    const { onlineUsers, socket } = SocketData();



    async function fetchAllUsers() {
        try {
            const { data } = await axios.get("/api/user/all?search=" + query);

            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }


    const getAllChats = async () => {
        try {
            const { data } = await axios.get("/api/messages/chats");
            setChats(data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchAllUsers();
    }, [query]);

    useEffect(() => {
        getAllChats();
    }, []);



    async function createNewChat(id) {
        await createChat(id);
        setSearch(false);
        getAllChats();
    }

    return (
        <Layout>
            <div className="w-[100%] mx-auto h-full overflow-hidden z-10">
                <div className="flex mx-auto h-full relative">
                    <MdChatBubble className='absolute text-3xl  bg-green-500 rounded-full h-9 w-9 p-1 z-50 block md:hidden' onClick={() => setSidebar(!sidebar)} />
                    <div className={` h-full border mx-auto  md:block  ${sidebar ? "w-[100%] md:w-[25%] block" : "hidden   md:w-[25%] "}`}>

                        <div className='py-2 px-4 pl-12 md:pl-0'>
                            {
                                search ?
                                    <h1 className='text-lg text-red-500 font-bold cursor-pointer' onClick={() => setSearch(false)}>X</h1> :
                                    <MdSearch className='text-2xl  font-bold cursor-pointer' onClick={() => setSearch(true)} />
                            }
                        </div>


                        {
                            search ?

                                <div className=' w-11/12 mx-auto'>
                                    <input type="text" placeholder='Search User...'
                                        className='px-4 py-2 outline-none border rounded-md w-full bg-gray-100'
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                    />

                                    <div className='flex pt-4 flex-col gap-2'>
                                        {
                                            users.length === 0 ? <h1>No users found</h1> :
                                                users?.map((e, index) => (
                                                    <div key={index} onClick={() => createNewChat(e._id)} className='flex items-center gap-6 border p-2 rounded-md bg-gray-200 cursor-pointer'>
                                                        <img src={e.profilePic.url} alt="" className='h-8 w-8 rounded-full' />
                                                        {e.name}
                                                    </div>
                                                ))
                                        }
                                    </div>
                                </div>

                                :

                                <div className=' w-11/12 mx-auto'>
                                    <div className='flex flex-col gap-2 overflow-y-auto'>
                                        {
                                            chats.length === 0 ? <h1 className='text-center pt-4'>Search User to chat</h1> :

                                                chats.map((e, index) => (
                                                    <ChatCard key={index} chat={e} setSelectedChat={setSelectedChat} selectedChat={selectedChat}
                                                        isOnline={onlineUsers.includes(e.users[0]._id)} />
                                                ))
                                        }
                                    </div>

                                </div>

                        }
                    </div>


                    <div className={`  ${sidebar ? "w-0  hidden md:block md:w-[75%]" : "w-full md:w-[75%]"}`}>


                        {
                            selectedChat === null ?
                                <div className='text-center flex justify-center items-center h-full'>
                                    Hello 👋 {loggedInUser.name} select a chat to start conversation
                                </div> :
                                <div>
                                    <MessagesContainer selectedChat={selectedChat} setChats={setChats} />
                                </div>
                        }

                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default Chats
