import React, { useEffect, useState } from 'react'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { FaRegComment } from 'react-icons/fa'
import { RiShareForwardLine } from 'react-icons/ri'
import { BsThreeDotsVertical } from 'react-icons/bs'
import moment from "moment"
import { PostData } from '../context/PostContext'
import { UserData } from '../context/UserContext'
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { SocketData } from '../context/SocketContext'


const PostCard = ({ item, auto = true }) => {
    const [show, setShow] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [option, setOption] = useState(false);
    const [inputOpen, setInputOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [caption, setCaption] = useState(item.caption ? item.caption : "");

    const { likePost, addComment, deleteComment, deletePost, editCaption } = PostData();
    const { user } = UserData();
    const { onlineUsers } = SocketData();

    const handleLike = (id) => {
        likePost(id);
        setIsLike(!isLike);
    }

    useEffect(() => {
        for (let i = 0; i < item.likes.length; i++) {
            if (item.likes[i] === user._id) {
                setIsLike(true);
            }
        }
    }, [item, user._id])


    const handleComment = (id) => {
        addComment(id, comment, setComment, setShow);
    }


    const handleDeleteComment = (commentId) => {
        deleteComment(commentId, item._id);
    }


    const forwardedDate = format(new Date(item.createdAt), "MMMM do y");


    const handleOpenOptions = () => {
        setOption(!option);
    }

    const handleDeletePost = () => {
        deletePost(item._id);
        setOption(false);
    }





    const handleCaptionChange = async (e) => {
        e.preventDefault();

        editCaption(item._id, caption, setInputOpen, setCaption);
    }

    return (
        <div className='border w-full max-w-9/12 py-3 z-10 rounded-md '>
            <div className='px-4 py-2 flex items-center gap-4 justify-between'>
                <div className='flex items-center gap-4 relative'>
                    {onlineUsers.include(item._id) && <div className='absolute text-4xl left-0 bottom-1 animate-pulse  bg-green-500 h-3 w-3 rounded-full '></div>}

                    <Link to={`/user/${item.owner._id}`}>
                        <img src={item?.owner?.profilePic?.url}
                            className='w-10 h-10 rounded-full' alt="img" />
                    </Link>

                    <div>
                        <h1 className=''>{item.owner.name}</h1>
                        <p className='text-xs'>{forwardedDate}</p>

                    </div>
                </div>

                <div className='relative'>
                    {item.owner._id === user._id && <BsThreeDotsVertical onClick={handleOpenOptions} className='text-lg cursor-pointer' />}
                    {
                        option &&

                        <div className='absolute bg-gray-100 rounded-md -left-[5.5rem] top-5 p-4'>
                            <div className='flex flex-col '>
                                <button className='px-2 py-1 rounded-md  hover:text-green-500 font-semibold' onClick={() => { setInputOpen(true); setOption(false) }}>Edit</button>
                                <button className='px-2 py-1 rounded-md  hover:text-red-500 font-semibold' onClick={handleDeletePost}>Delete</button>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div className='px-4 py-2'>
                {inputOpen ? <form onSubmit={handleCaptionChange} className='flex items-center gap-4 justify-between'>
                    <input type="text" className='px-2 py-1 outline-none border-2 border-gray-300 rounded-md w-8/12' placeholder='Enter Caption' value={caption} onChange={(e) => setCaption(e.target.value)} />

                    <div className='flex items-center gap-2'>
                        <button className='px-2 py-1 border rounded-md bg-green-500 '>Update</button>
                        <button className='px-2 py-1 border text-white rounded-md bg-red-500' onClick={() => setInputOpen(false)}>Cancel</button>
                    </div>
                </form> :

                    item.caption}
            </div>
            <div className=''>
                {item.type === "post" ? <img src={item.post.url} alt="" className='w-full' /> :
                    auto ? <video src={item.post.url} className='w-full  object-cover ' autoPlay controls alt="img" /> :
                        <video src={item.post.url} className='w-full object-cover ' controls alt="img" />
                }
            </div>


            <div className='px-8 border-t pt-2 '>
                <div className='flex items-center justify-between mb-2'>
                    <h1 className='flex items-center gap-2'>
                        <AiFillLike />
                        {item?.likes.length}
                    </h1>
                    <h1>
                        {item?.comments.length} comments
                    </h1>
                </div>

                <div className='border w-11/12 mx-auto'></div>

                <div className='flex items-center justify-between mt-2'>
                    <div className='flex items-center gap-2' onClick={() => handleLike(item._id)}>
                        {isLike ? <AiFillLike className='text-xl cursor-pointer text-green-500' /> : <AiOutlineLike className='text-lg cursor-pointer' />} Likes
                    </div>
                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => setShow(!show)}>
                        <FaRegComment className='text-xl cursor-pointer' /> Comments
                    </div>
                    <div className='flex items-center gap-2'>
                        <RiShareForwardLine className='text-xl cursor-pointer' /> Share
                    </div>

                </div>

                {
                    show && (
                        <div className='mt-2 pt-2 text-black'>
                            {
                                <div>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleComment(item._id)
                                    }} action="" className='flex items-center justify-between gap-4'>
                                        <input type="text" className='px-2 py-1 outline-none border-2 border-gray-300 rounded-md w-full' placeholder='Comment Now' value={comment} onChange={(e) => setComment(e.target.value)} />
                                        <button className='border px-2 py-1 rounded-md bg-green-500' >Add</button>
                                    </form>
                                </div>
                            }
                        </div>
                    )
                }

                <div className='mt-2 pt-4'>
                    {
                        item.comments.length === 0 ? <h1>No Comments</h1> : (
                            <div className='flex flex-col gap-4 max-h-28 overflow-x-hidden overflow-y-auto'>
                                {
                                    item.comments.map((comment, index) => (
                                        <div key={index} className='flex flex-col gap-1 border-t-2 pt-1'>
                                            <div className='flex items-center gap-2'>
                                                <Link to={`/user/${comment.user._id}`}>
                                                    <img src={comment.user.profilePic.url} alt="img" className='h-9 w-9 rounded-full' />
                                                </Link>

                                                <div>
                                                    <div className='flex items-center gap-4'>
                                                        <h1 className='font-semibold text-sm'>{comment.user.name}</h1>
                                                        {(item.owner._id === user._id || comment.user._id === user._id) && <MdDelete onClick={() => handleDeleteComment(comment._id)} className='text-lg text-red-500 cursor-pointer' />}
                                                    </div>
                                                    <span className='text-xs'>{moment(comment.createdAt).fromNow()}</span>
                                                </div>
                                            </div>

                                            <div className='pl-12'>
                                                <h1>{comment.comment}</h1>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>


        </div >
    )
}

export default PostCard
