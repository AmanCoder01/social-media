import React, { useState } from 'react'
import Layout from '../components/Layout'
import { PostData } from '../context/PostContext'
import PostCard from '../components/PostCard';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Spinner } from '../components/Spinner';


const Reels = () => {
    const [index, setIndex] = useState(0);
    const { reels, fetchLoading } = PostData();

    const handlePrev = () => {
        if (index === 0) {
            return null;
        }
        setIndex(index - 1);
    }

    const handleNext = () => {
        if (index === reels.length - 1) {
            return null;
        }
        setIndex(index + 1);
    }

    return (
        <Layout>

            <div className='w-full h-full flex '>
                <div className=' w-full max-w-[100%] md:max-w-[70%] pt-4'>
                    <div className='w-11/12 md:w-6/12 mx-auto mt-8'>
                        <h1 className='text-2xl font-semibold mb-6'>All Reels</h1>
                        <div className='flex items-center gap-6'>
                            <div className='flex flex-col gap-6'>
                                {fetchLoading ? <div className='h-screen'><Spinner /></div> :
                                    reels.length === 0 ? <h1 className='text-center'>No Reels Available</h1> :

                                        <PostCard item={reels[index]} />

                                }
                            </div>

                            <div className='flex flex-col gap-6 text-[2.5rem] '>
                                {index === 0 ? null : <FaArrowUp className='cursor-pointer bg-gray-400 rounded-full p-2' onClick={handlePrev} />}
                                {index === reels.length - 1 ? null : < FaArrowDown className='cursor-pointer bg-gray-400 rounded-full p-2' onClick={handleNext} />}
                            </div>
                        </div>
                    </div>
                </div>


                <div className=' w-[0%] md:w-full md:max-w-[30%] pt-4  '>

                </div>
            </div>
        </Layout>
    )
}

export default Reels
