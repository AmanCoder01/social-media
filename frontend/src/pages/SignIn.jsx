import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";

const SignIn = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loginUser, loading, isAuth } = UserData();
    const { fetchPosts } = PostData();

    const submitHandler = async (e) => {
        e.preventDefault();
        loginUser(email, password, navigate, fetchPosts);
    };


    useEffect(() => {
        if (isAuth) {
            navigate("/");
        }
    }, [isAuth])


    return (
        <div className="h-screen w-full flex items-center justify-between gap-[4rem] md:w-11/12 lg:w-9/12  mx-auto">
            <div className="hidden md:block">
                <h1 className="text-[3rem] font-bold  text-green-500 tracking-wider">
                    @CHATBOOK
                </h1>
                <p className="text-lg pt-4 font-semibold">
                    You can share your <br /> emotions and chat with anyone in world.
                </p>
            </div>

            <div className=" w-full max-w-lg border rounded-xl py-6  px-8 shadow-xl ">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold pb-1">SignIn</h1>
                    <p className=" font-medium">Please enter yor details</p>
                </div>

                <div>
                    <form
                        action=""
                        onSubmit={submitHandler}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex flex-col gap-1">
                            <label htmlFor="" className="font-medium">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="exaample@gmail.com"
                                className="custom-input"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="" className="font-medium">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="xyz@123"
                                className="custom-input"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-1">
                            Don't have account ?{" "}
                            <Link to="/signup" className="text-blue-500">
                                SignUp
                            </Link>
                        </div>

                        <div className="mt-2">
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-lg font-medium outline-none border-gray-200 border rounded-md p-2 px-3"
                            >
                                {loading ? "Loading..." : "SignIn"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
