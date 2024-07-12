import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import toast from 'react-hot-toast';
import { apiUrl } from '../service';
import axios from 'axios';
import { Loader, Spinner } from '../components/Spinner';
import { Link } from 'react-router-dom';

const Search = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/user/all?search=${search}`, { withCredentials: true });

            setLoading(false);
            setUsers(res.data)

        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        if (search.length === 0) {
            setUsers([])
        }

    }, [search])


    return (
        <Layout>
            <div className='h-full w-11/12 md:w-7/12 lg:w-6/12 mx-auto '>

                <div className='mt-2 flex flex-col items-center gap-3 justify-center'>
                    <div className='w-full mt-2 flex items-center gap-3  justify-between'>
                        <input type="text" placeholder='Search User...'
                            className='w-full text-lg px-4 py-3 outline-none focus:outline rounded-md bg-gray-100'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button className=' bg-green-500  font-medium outline-none border-gray-200 border rounded-md py-3 px-3'
                            onClick={handleSearch}>
                            Search
                        </button>

                    </div>

                    <div className='flex flex-col gap-2 w-11/12 mt-4  md:w-6/12 mx-auto '>
                        {
                            search === "" ? <h1 className='text-center h-20'>Search for a user</h1> :
                                users?.length === 0 ?
                                    <div className='w-full h-20 flex items-center justify-center'>No User Found</div>
                                    :
                                    loading ?
                                        <div className='mt-32'><Spinner /></div>
                                        :
                                        users?.map((item) => (
                                            <Link key={item._id} to={`/user/${item._id}`} className='flex items-center gap-6 border p-2 rounded-md bg-gray-200'>
                                                <img src={item.profilePic.url} alt="" className='h-8 w-8 rounded-full' />
                                                {item.name}
                                            </Link>
                                        ))

                        }
                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default Search
