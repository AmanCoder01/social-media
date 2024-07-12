import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import { PostData } from '../context/PostContext';



const SignUp = () => {

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        file: ""
    })
    const [filePrev, setFilePrev] = useState("");

    const { registerUser, loading, isAuth } = UserData();
    const navigate = useNavigate();
    const { fetchPosts } = PostData();


    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const changeFileHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFilePrev(reader.result);
            setData((prev) => ({
                ...prev,
                "file": file
            }))
        }
    }



    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("gender", data.gender);
        formData.append("file", data.file);

        registerUser(formData, navigate, fetchPosts);
    }

    useEffect(() => {
        if (isAuth) {
            navigate("/");
        }
    }, [isAuth])



    return (
        <div className='h-screen w-full flex justify-between gap-[4rem] md:w-11/12 lg:w-8/12  mx-auto items-center'>

            <div className='hidden md:block'>
                <h1 className='text-[3rem] font-bold  text-green-500 tracking-wider'>@CHATBOOK</h1>
                <p className='text-lg pt-4 font-semibold'>You can share your <br /> emotions  and chat with anyone in world.</p>
            </div>
            <div className=' w-full max-w-lg border rounded-xl py-6 px-8 shadow-xl '>
                <div className='mb-6 text-center'>
                    <h1 className='text-2xl font-bold pb-1'>SignUp</h1>
                    <p className=' font-medium'>Please enter yor details</p>
                </div>

                <div>
                    <form action="" onSubmit={handleSubmit} className='flex flex-col gap-3'>
                        <div className='flex flex-col justify-center items-center gap-1'>
                            {
                                filePrev ?
                                    <img src={filePrev} alt="" className='h-[5rem] w-[5rem] rounded-full ' />
                                    :
                                    <label htmlFor="file" className=' h-[5rem] w-[5rem] rounded-full border flex items-center justify-center'> <FaCloudUploadAlt className='text-2xl' /></label>
                            }
                            <input type="file" name="" id="file" className=' hidden' onChange={changeFileHandler} accept='*/image' />
                            <span className='font-semibold'>Upload Profile</span>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-medium'>Name <span className='text-red-500'>*</span></label>
                            <input type="text" placeholder='XPro'
                                className='custom-input'
                                name='name'
                                value={data.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-medium'>Email <span className='text-red-500'>*</span></label>
                            <input type="email" placeholder='exaample@gmail.com'
                                className='custom-input'
                                name='email'
                                value={data.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-medium'>Password <span className='text-red-500'>*</span></label>
                            <input type="password" placeholder='xyz@123'
                                className='custom-input'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-medium'>Gender <span className='text-red-500'>*</span></label>
                            <select name="gender" id="" className='custom-input'
                                value={data.gender}
                                onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className='pt-1'>
                            ALready have account ? <Link to="/signin" className='text-blue-500'>SignIn</Link>
                        </div>

                        <div className='mt-2'>
                            <button className='w-full bg-green-500 text-lg font-medium outline-none border-gray-200 border rounded-md p-2 px-3'>
                                {loading ? "Loading..." : "SignUp"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp
