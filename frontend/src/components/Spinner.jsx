import React from 'react'

export const Spinner = ({ height }) => {
    return (
        <div className='flex space-x-2 justify-center items-center bg-white h-full'>
            <span className='sr-only text-black '>Loading...</span>
            <div className='h-8 w-8 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-8 w-8 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-8 w-8 bg-green-500 rounded-full animate-bounce'></div>
        </div>
    )
}


export const Loader = () => {
    return (
        <div className='h-5 w-5 inline-block border-2 rounded-full border-t-2 border-r-transparent border-red-500 animate-spin'>

        </div>
    )
}
