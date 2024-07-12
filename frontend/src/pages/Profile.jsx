import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { UserData } from '../context/UserContext';
import PostCard from '../components/PostCard';
import { PostData } from '../context/PostContext';
import { Spinner } from '../components/Spinner';
import axios from 'axios';
import Modal from '../components/Modal';
import { apiUrl } from '../service';
import { TbPhotoEdit } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import { MdDone } from "react-icons/md";
import { SocketData } from '../context/SocketContext';



const Profile = () => {
    const { user, updateProfile, updateName } = UserData();
    const { posts, reels, fetchLoading } = PostData();
    const [activeTab, setActiveTab] = useState("Posts");
    const [myPost, setMyPost] = useState([]);
    const [myReel, setMyReel] = useState([]);
    const { onlineUsers } = SocketData();


    const [show, setShow] = useState(false);
    const [followersData, setFollowersData] = useState([]);
    const [followingsData, setFollowingsData] = useState([]);
    const [title, setTitle] = useState("");
    const [filePrev, setFilePrev] = useState("");
    const [file, setFile] = useState("");
    const [name, setName] = useState(user.name);
    const [inputOpen, setInputOpen] = useState(false);

    useEffect(() => {
        //filter my own post from posts array
        const myPosts = posts.filter((item) => {
            return item.owner._id === user._id
        })
        setMyPost(myPosts);
        const myReels = reels.filter((item) => {
            return item.owner._id === user._id
        })
        setMyReel(myReels);
    }, [posts, reels])




    async function followData() {
        try {
            const { data } = await axios.get(`${apiUrl}/api/user/followdata/${user._id}`, { withCredentials: true })
            setFollowersData(data.followers);
            setFollowingsData(data.followings);

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        followData()
    }, [user])



    const changeFileHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFilePrev(reader.result);
            setFile(file);
        }
    }



    const handleUpdateProfile = () => {
        const formData = new FormData();

        formData.append("file", file);

        // console.log(formData);
        updateProfile(user._id, formData, setFile, setFilePrev);
    }


    const handleUpdateName = () => {
        updateName(user._id, name, setName, setInputOpen);
    }


    return (
        <Layout>
            <div className='w-full px-2 md:w-10/12 lg:w-6/12 mx-auto border rounded-md shadow-md py-8'>

                {show &&

                    <Modal value={title === "Followers" ? followersData : followingsData} title={title} setShow={setShow} />}

                <div className='flex items-center gap-2 md:gap-6 lg:gap-12  w-full  md:w-10/12 mx-auto '>
                    <div className='relative '>
                        <img src={filePrev ? filePrev : user?.profilePic?.url} alt=""
                            className={`w-36 h-36  rounded-full border `} />

                        <div className='absolute bottom-0 right-10 border rounded-full bg-gray-50'>
                            {filePrev ? <button className=' px-2 py-1 bg-green-500 rounded-lg' onClick={handleUpdateProfile}><MdDone className='text-xl' /></button> : <label htmlFor="profile"> <TbPhotoEdit className='text-2xl cursor-pointer' /></label>}
                            <input type="file" className='hidden' name="file" id="profile" onChange={changeFileHandler} />
                        </div>
                    </div>


                    <div className='flex flex-col justify-center text-md  font-semibold '>
                        <div className='flex items-center gap-4'>
                            {
                                inputOpen ? <input type="text" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}
                                    className='px-2 py-1 w-1/2 border outline-none border-gray-500 rounded-md' /> :
                                    <h1 className='text-lg font-bold'>{user?.name}</h1>
                            }
                            <span><CiEdit onClick={() => setInputOpen(!inputOpen)} className='text-2xl cursor-pointer' />
                            </span>

                            {inputOpen && <button className='bg-green-500 px-2 py-1 rounded-md' onClick={handleUpdateName}><MdDone /></button>}

                        </div>

                        <p>{user?.email}</p>

                        <p>{user?.gender}</p>



                        <div className='flex items-center gap-5 py-3'>
                            <div className='cursor-pointer flex flex-col items-center'>
                                <span className='text-lg font-semibold'>{myPost?.length + myReel.length}</span>
                                <span className='text-sm md:text:md'>Posts</span>
                            </div>

                            <div className='cursor-pointer flex flex-col items-center' onClick={() => {
                                setTitle("Followers")
                                setShow(true)
                            }}>
                                <span className='text-lg font-semibold'>{user?.followers?.length}</span>
                                <span className='text-sm md:text:md'>Followers</span>
                            </div>

                            <div className='cursor-pointer flex flex-col items-center' onClick={() => {
                                setTitle("Followings")
                                setShow(true)
                            }}>
                                <span className='text-lg font-semibold'>{user?.followings?.length}</span>
                                <span className='text-sm md:text:md'>Followings</span>
                            </div>


                        </div>

                    </div>
                </div>


            </div>


            <div className='w-full md:w-10/12 lg:w-7/12 mx-auto mt-7'>
                <div className='flex items-center gap-9 justify-center text-lg font-bold'>
                    <span onClick={() => setActiveTab("Posts")} className={`${activeTab === "Posts" && "border-b-4 border-green-500 rounded-b-md"} cursor-pointer`}>Posts</span>
                    <span onClick={() => setActiveTab("Reels")} className={`${activeTab === "Reels" && "border-b-4 border-green-500 rounded-b-md"} cursor-pointer`}>Reels</span>
                </div>

                <div className='w-11/12 md:w-8/12 mx-auto'>

                    <div className='flex flex-col gap-6 my-6'>
                        {fetchLoading ? <div className='pt-10'><Spinner /></div> : activeTab === "Posts" ?
                            myPost.length === 0 ? <h1 className='text-center'>No Posts Available to show</h1> : myPost.map((item, index) => (
                                <PostCard item={item} key={index} />
                            ))

                            :
                            myReel.length === 0 ? <h1 className='text-center'>No Reels Available to show</h1> : myReel.map((item, index) => (
                                <PostCard item={item} key={index} auto={false} />
                            ))

                        }

                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default Profile
