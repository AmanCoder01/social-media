import React from 'react'
import { Link } from 'react-router-dom'

const Modal = ({ value, title, setShow }) => {
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 transition duration-500 ease-in-out'>
            <div className='bg-white rounded-lg p-4  px-5 shadow-lg w-[300px] max-h-[300px] overflow-y-auto'>
                <div className='flex flex-col'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-xl font-bold'>{title}</h1>
                        <div onClick={() => setShow(false)} className='text-4xl cursor-pointer '>&times;</div>
                    </div>

                    <div className='flex flex-col justify-center gap-2 mt-4'>
                        {
                            value?.length === 0 ? <h1>No {title} yet !</h1> : value && value.map((e, index) => (
                                <Link key={index} to={`/user/${e._id}`} className='flex items-center gap-6 border p-2 rounded-md bg-gray-200'>
                                    <img src={e.profilePic.url} alt="" className='h-8 w-8 rounded-full' />
                                    {e.name}
                                </Link>
                            ))
                        }
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Modal
