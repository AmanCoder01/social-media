import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserData } from '../context/UserContext';
import { HiOutlineMenuAlt3 } from "react-icons/hi";


const Navbar = () => {
    const navigate = useNavigate();

    const { user, logoutUser } = UserData();
    const [openMenu, setOpenMenu] = useState(false);

    const logoutHandler = () => {
        logoutUser(navigate);
    }

    return (
        <div className='border-b px-4 border-gray-200 shadow-md h-full flex items-center bg-white transition duration-500 ease-in-out'>
            <div className='flex items-center justify-between w-full'>
                <Link to="/">
                    <span className='font-bold'>@</span>
                    <span className='text-2xl font-bold'>ChatBook</span>
                </Link>


                <div className='flex items-center gap-2 relative'>
                    <Link to="/profile" className=''>
                        <img src={user?.profilePic?.url} alt="img"
                            className='w-9 h-9 rounded-full cursor-pointer'
                        />
                    </Link>


                    <div className='block md:hidden'>
                        <HiOutlineMenuAlt3 className='text-3xl cursor-pointer' onClick={() => setOpenMenu(!openMenu)} />
                    </div>

                    {openMenu &&
                        <div className='block md:hidden absolute bg-gray-300 top-12 -right-3 max-w-[10rem] w-[9.5rem] rounded-md  transform transition-all duration-500 '>
                            <div className='flex flex-col justify-center p-3 gap-3 py-4'>
                                <Link to="/change-password" className='hover:text-green-900'>Change Password</Link>
                                <Link onClick={logoutHandler} className='hover:text-green-900'>Logout</Link>
                            </div>
                        </div>
                    }
                </div>


            </div>
        </div>
    )
}

export default Navbar
