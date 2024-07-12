import React, { useState } from 'react'
import Layout from '../components/Layout'
import { FaPhotoVideo } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { UserData } from '../context/UserContext';
import PostCard from '../components/PostCard';
import { PostData } from '../context/PostContext';
import { Loader, Spinner } from '../components/Spinner';



const Home = () => {
    const [caption, setCaption] = useState("");
    const [file, setFile] = useState("");
    const [type, setType] = useState("");
    const [filePrev, setFilePrev] = useState("");

    const { user } = UserData();
    const { newPost, loading, posts, fetchLoading } = PostData();


    const changeFileHandler = (e) => {
        const file = e.target.files[0];
        const fileType = file?.type.split("/")[0];

        if (fileType === "image") {
            setType("post");
        } else {
            setType("reel")
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFilePrev(reader.result);
            setFile(file);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("caption", caption);
        formData.append("file", file);

        newPost(formData, type, setFilePrev, setCaption, setFile);
    }


    return (
        <Layout>
            <div className='w-full h-full flex '>
                <div className=' w-full max-w-[100%] lg:max-w-[70%] pt-4'>
                    <div className='border border-opacity-20 shadow-lg rounded-lg  w-11/12 md:w-7/12 mx-auto  border-gray-500' >
                        <form action="" onSubmit={handleSubmit} className='p-6 flex flex-col gap-4'>
                            <div className='flex items-center gap-4'>
                                <img src={user?.profilePic?.url}
                                    className='w-10 h-10 rounded-full' alt="img" />
                                <input type="text"
                                    className='w-full rounded-3xl p-2 outline-none border bg-gray-100 px-4'
                                    placeholder={`What's in your mind , ${user?.name} ?`}
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                            </div>

                            <div className='border'></div>

                            <div>

                                <label htmlFor="file" className='border p-1 px-2 rounded-md flex items-center gap-2 justify-center' > <FaPhotoVideo className='text-green-500' /> Photo / Video</label>
                                <input type="file" name="" id="file" className='hidden'
                                    onChange={changeFileHandler} />

                            </div>

                            {filePrev ? type === "post" ? <img src={filePrev} className='w-full  object-cover rounded-md' alt="img" /> : <video src={filePrev} className='w-full  object-cover rounded-md' controls alt="img" /> : null}


                            <button className='w-full py-1 bg-green-500 rounded-md text-lg'>
                                {loading ? <div className='flex items-center gap-2 justify-center'><Loader />Loading... </div> : "Post"}
                            </button>
                        </form>
                    </div>


                    <div className='w-11/12 md:w-7/12 mx-auto mt-8'>
                        <h1 className='text-2xl font-semibold mb-6'>All Posts</h1>
                        <div className='flex flex-col gap-6'>
                            {fetchLoading ? <div className='pt-10'><Spinner /></div> :
                                posts?.map((item, index) => (
                                    item.type === "post" && <PostCard item={item} key={index} />
                                ))
                            }
                        </div>
                    </div>
                </div>


                <div className=' w-[0%] lg:w-full lg:max-w-[30%] pt-4  '>

                </div>
            </div>
        </Layout>
    )
}

export default Home
