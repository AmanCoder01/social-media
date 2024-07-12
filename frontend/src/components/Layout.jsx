import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <div className='h-screen w-full '>
            <div className='h-[7.5vh] sticky top-0 '>
                <Navbar />
            </div>

            <div className='h-[92.5vh]  flex overflow-hidden'>
                <div className='hidden md:block  w-[16rem]  '>
                    <Sidebar />
                </div>

                <div className='w-full h-full overflow-auto'>
                    {children}
                </div>
            </div>


            <div className='block md:hidden h-[7.5vh] fixed bottom-0 w-full z-50'>
                <Footer />
            </div>

        </div>
    )
}

export default Layout
