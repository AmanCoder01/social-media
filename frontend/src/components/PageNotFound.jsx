import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <div className='h-screen w-full'>
            <div className='flex flex-col justify-center items-center h-full w-full'>
                <h1 className='text-2xl font-bold'>404</h1>
                <h1 className='text-4xl font-bold'>Page Not Found</h1>
                <Link to="/" className='text-xl pt-4 cursor-pointer font-bold underline text-blue-500'>@CHATBOOK</Link>
            </div>

        </div>
    )
}

export default PageNotFound
