import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { apiUrl } from "../service";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);


    async function loginUser(email, password, navigate, fetchPosts) {
        setLoading(true);
        try {
            const { data } = await axios.post(`${apiUrl}/api/auth/login`, { email, password }, { withCredentials: true }); // as we are recieving {json} value here so sending data in req.body like this
            // console.log(data);
            toast.success(data.message);
            setLoading(false);
            setIsAuth(true);
            fetchPosts();
            setUser(data.user);
            navigate("/"); // giving navigate here because it will only navigate if we get success message
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }



    async function registerUser(formData, navigate, fetchPosts) {
        setLoading(true);

        try {
            const res = await axios.post(`${apiUrl}/api/auth/register`, formData, { withCredentials: true });

            // console.log(res);

            toast.success(res.data.message);
            setIsAuth(true);
            setLoading(false);
            fetchPosts();
            setUser(res.data.user);
            navigate("/");
        } catch (error) {
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }


    async function logoutUser(navigate) {
        try {
            const res = await axios.get(`${apiUrl}/api/auth/logout`, { withCredentials: true });

            console.log(res);

            toast.success(res.data.message);
            setIsAuth(false);
            setUser([]);
            navigate("/signin");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }


    async function fetchUser() {
        try {
            const res = await axios.get(`${apiUrl}/api/user/me`, { withCredentials: true });
            // console.log(res);
            setIsAuth(true);
            setUser(res.data.user);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setIsAuth(false);
            setLoading(false);
        }
    }


    async function followUser(id, fetchUser) {
        try {
            const { data } = await axios.post(`${apiUrl}/api/user/follow/${id}`, { withCredentials: true });
            // console.log(data.user);
            toast.success(data.message);
            fetchUser();

        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }




    async function updateProfile(id, formData, setFile, setFilePrev) {
        console.log(formData);
        try {
            const res = await axios.put(`${apiUrl}/api/user/${id}`, formData, { withCredentials: true });
            // console.log(res);
            setFile("");
            setFilePrev("");
            fetchUser();
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }


    async function updateName(id, name, setName, setInputOpen) {
        try {
            const res = await axios.put(`${apiUrl}/api/user/${id}`, { name }, { withCredentials: true });
            // console.log(res);
            setName("");
            setInputOpen(false);
            fetchUser();
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }




    async function updatePassword(id, oldPassword, newPassword, setNewPassword, setOldPassword, setLoading) {
        setLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/api/user/${id}`, { oldPassword, newPassword }, { withCredentials: true });

            setOldPassword("");
            setNewPassword("");
            setLoading(false);

            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }



    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <UserContext.Provider value={{ updatePassword, updateName, updateProfile, followUser, registerUser, loginUser, logoutUser, isAuth, setIsAuth, user, setUser, loading }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);
