import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apiUrl } from "../service";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);


    async function newPost(formData, type, setFilePrev, setCaption, setFile) {
        setLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/api/post/new?type=${type}`, formData, { withCredentials: true });
            toast.success(res.data.message);
            console.log(res);

            if (res.data.post.type === "post") {
                setPosts([res.data.post, ...posts]);
            } else {
                setReels([res.data.post, ...reels])
            }

            setFilePrev("");
            setCaption("");
            setFile("");
            setLoading(false)

        } catch (error) {
            // console.log(error);
            setLoading(false);
            toast.error(error.response.data.message || "Something went wrong! Please try again..");
        }
    }


    async function fetchPosts() {
        setFetchLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/post/all`, { withCredentials: true });
            // console.log(res.data);
            setPosts(res.data.posts);
            setReels(res.data.reels);
            setFetchLoading(false)

        } catch (error) {
            console.log(error);
            setFetchLoading(false);
            toast.error(error.response.data.message);
        }
    }


    async function likePost(id) {
        try {
            const res = await axios.post(`${apiUrl}/api/post/like/${id}`, { withCredentials: true });
            setPosts(posts.map((item) => (
                item._id === id ? { ...item, likes: res.data.likes } : item
            )))

            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }


    async function addComment(id, comment, setComment, setShow) {
        try {
            const res = await axios.post(`${apiUrl}/api/post/comment/${id}`, { comment }, { withCredentials: true });
            // console.log(res.data);
            setPosts(posts.map((item) => (
                item._id === id ? { ...item, comments: res.data.posts.comments } : item
            )));
            toast.success(res.data.message);
            setComment("");
            setShow("");
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }


    async function deleteComment(commentId, id) {
        try {
            const res = await axios.delete(`${apiUrl}/api/post/comment/${id}?commentId=${commentId}`);
            // console.log(res);

            setPosts(posts.map((item) => (
                item._id === id ? { ...item, comments: item.comments.filter(comment => comment._id !== commentId) } : item
            )))

            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }


    async function deletePost(id) {
        try {
            const res = await axios.delete(`${apiUrl}/api/post/${id}`);
            console.log(res);

            //filter delete post from posts
            setPosts(posts.filter(post => post._id !== id));

            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }


    async function editCaption(id, caption, setInputOpen, setCaption) {
        try {
            const res = await axios.put(`${apiUrl}/api/post/${id}`, { caption }, { withCredentials: true });

            console.log(res);

            toast.success(res.data.message);
            setInputOpen(false);
            setCaption("");

            //setnew caption from posts
            setPosts(posts.map((item) => (
                item._id === id ? { ...item, caption } : item
            )))

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchPosts();
    }, [])


    return (
        <PostContext.Provider value={{ editCaption, fetchPosts, deletePost, newPost, loading, posts, reels, likePost, addComment, deleteComment, fetchLoading }}>
            {children}
            <Toaster />
        </PostContext.Provider>
    );
};

export const PostData = () => useContext(PostContext);
