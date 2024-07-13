import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { UserData } from '../context/UserContext';
import PostCard from '../components/PostCard';
import { PostData } from '../context/PostContext';
import { Loader, Spinner } from '../components/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import { apiUrl } from '../service';
import { SocketData } from '../context/SocketContext';



const UserAccount = () => {
    const { posts, reels, fetchLoading } = PostData();
    const { user: loggedInUser, followUser } = UserData();
    const { onlineUsers } = SocketData();

    const [activeTab, setActiveTab] = useState("Posts");
    const [myPost, setMyPost] = useState([]);
    const [myReel, setMyReel] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [show, setShow] = useState(false);
    const [followersData, setFollowersData] = useState([]);
    const [followingsData, setFollowingsData] = useState([]);
    const [title, setTitle] = useState("");

    const params = useParams()


    async function fetchUser() {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/user/${params.id}`, { withCredentials: true })
            setUser(res.data.user);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [params.id])


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
    }, [loading, user])


    const followHandler = () => {
        setFollowed(!followed);
        followUser(user._id, fetchUser);
    }

    const followers = user.followers;

    useEffect(() => {
        if (followers && followers.includes(loggedInUser._id)) {
            setFollowed(true);
        }
    }, [user])


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


    return (
        <Layout>
            <div className='w-11/12 md:w-10/12 lg:w-6/12 mx-auto border rounded-md shadow-md py-8'>

                {show && <Modal value={title === "Followers" ? followersData : followingsData} title={title} setShow={setShow} />}

                <div className='flex items-center gap-2 md:gap-6 lg:gap-12  w-full  md:w-10/12 mx-auto '>
                    <div>
                        <img src={user?.profilePic?.url} alt=""
                            className='w-20 h-20 md:w-40 md:h-40  rounded-full border ' />
                    </div>
                    <div className='flex flex-col justify-center text-md font-semibold '>
                        <h1 className='text-lg font-bold'>{user?.name}</h1>
                        <p>{user?.email}</p>
                        <div className='flex items-center gap-4'>
                            <p>{user?.gender}</p>
                            {onlineUsers.includes(user?._id) && <div className='text-green-500  '>Online</div>}

                        </div>

                        <div className='flex items-center gap-5 py-3'>
                            <div className='cursor-pointer flex flex-col items-center'>
                                <span className='text-lg font-semibold'>{myPost?.length + myReel.length}</span>
                                <span className=''>Posts</span>
                            </div>

                            <div className='cursor-pointer flex flex-col items-center' onClick={() => {
                                setTitle("Followers")
                                setShow(true)
                            }}>
                                <span className='text-lg font-semibold'>{user?.followers?.length}</span>
                                <span className=''>Followers</span>
                            </div>

                            <div className='cursor-pointer flex flex-col items-center' onClick={() => {
                                setTitle("Followings")
                                setShow(true)
                            }}>
                                <span className='text-lg font-semibold'>{user?.followings?.length}</span>
                                <span className=''>Followings</span>
                            </div>


                        </div>

                        {user._id !== loggedInUser._id &&
                            <button onClick={followHandler}
                                className={`${followed ? "bg-gray-300" : "bg-green-500"} mt-2 py-1 px-4 rounded-md`}
                            >{followed ? "Unfollow" : "Follow"}</button>}
                    </div>
                </div>


            </div>


            <div className='w-full md:w-10/12 lg:w-7/12 mx-auto mt-7'>
                <div className='flex items-center gap-9 justify-center text-lg font-bold'>
                    <span onClick={() => setActiveTab("Posts")} className={`${activeTab === "Posts" && "border-b-4 border-green-500 rounded-b-md"} cursor-pointer`}>Posts</span>
                    <span onClick={() => setActiveTab("Reels")} className={`${activeTab === "Reels" && "border-b-4 border-green-500 rounded-b-md"} cursor-pointer`}>Reels</span>
                </div>

                <div className='w-full md:w-8/12 mx-auto'>

                    <div className='flex flex-col gap-6 my-6'>
                        {fetchLoading ? <div className='pt-10'><Spinner /></div> : activeTab === "Posts" ?
                            myPost.map((item, index) => (
                                <PostCard item={item} key={index} />
                            ))

                            :
                            myReel.map((item, index) => (
                                <PostCard item={item} key={index} auto={false} />
                            ))

                        }

                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default UserAccount
