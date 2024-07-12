import React, { useState } from 'react'
import Layout from '../components/Layout'
import { UserData } from '../context/UserContext';

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const { updatePassword, user } = UserData();


    const handleUpdatePassword = (e) => {
        e.preventDefault();
        updatePassword(user._id, oldPassword, newPassword, setNewPassword, setOldPassword, setLoading);
    }


    return (
        <Layout>

            <div className='h-full w-11/12 md:w-7/12 lg:w-5/12 mx-auto flex justify-center items-center '>
                <div className='border-1 rounded-md shadow-md p-4 w-full'>
                    <h1 className='text-xl font-semibold text-center pb-4'>Change Password</h1>


                    <form className='pt-4 flex flex-col gap-3 ' onSubmit={handleUpdatePassword}>
                        <input type="text" placeholder='Enter Old Password'
                            className='px-4 py-2 outline-none focus:outline rounded-md bg-gray-100'
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input type="text" placeholder='Enter New Password'
                            className='px-4 py-2 outline-none focus:outline rounded-md bg-gray-100'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <button className='mt-2 mx-auto bg-green-500  font-medium outline-none border-gray-200 border rounded-md py-2 px-3'>
                            {loading ? "Updating..." : "Update Password"}
                        </button>

                    </form>
                </div>
            </div>

        </Layout>
    )
}

export default ChangePassword
