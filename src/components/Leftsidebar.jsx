import React from 'react';
import { CiHome, CiHashtag, CiUser, CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { getMyProfile, getOtherUsers, getUser } from '../redux/userSlice';

const Leftsidebar = () => {
    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${USER_API_END_POINT}/logout`);
            localStorage.removeItem("twitter_token");
            delete axios.defaults.headers.common["Authorization"];
            dispatch(getUser(null));
            dispatch(getOtherUsers(null));
            dispatch(getMyProfile(null));
            navigate('/');
            toast.success(res.data?.message || "Logged out successfully");
        } catch (error) {
            console.log(error);
            // Fallback clear
            localStorage.removeItem("twitter_token");
            delete axios.defaults.headers.common["Authorization"];
            dispatch(getUser(null));
            navigate('/');
            toast.success("Logged out");
        }
    };

    return (
        <div className='w-[20%] min-w-[200px] h-screen sticky top-0 flex flex-col justify-between py-4 pr-3'>
            <div>
                <Link to="/home" className='p-3 inline-block hover:bg-gray-100 rounded-full transition'>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 fill-black">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                </Link>
                <div className='my-2 space-y-1'>
                    <Link to="/home" className='flex items-center px-4 py-3 hover:bg-gray-100 hover:cursor-pointer rounded-full transition text-gray-900'>
                        <CiHome size="26px" />
                        <h2 className='font-semibold text-lg ml-3'>Home</h2>
                    </Link>
                    <div className='flex items-center px-4 py-3 hover:bg-gray-100 hover:cursor-pointer rounded-full transition text-gray-900'>
                        <CiHashtag size="26px" />
                        <h2 className='font-semibold text-lg ml-3'>Explore</h2>
                    </div>
                    <div className='flex items-center px-4 py-3 hover:bg-gray-100 hover:cursor-pointer rounded-full transition text-gray-900'>
                        <IoIosNotificationsOutline size="26px" />
                        <h2 className='font-semibold text-lg ml-3'>Notifications</h2>
                    </div>
                    {user ? (
                        <Link to={`/home/profile/${user._id}`} className='flex items-center px-4 py-3 hover:bg-gray-100 hover:cursor-pointer rounded-full transition text-gray-900'>
                            <CiUser size="26px" />
                            <h2 className='font-semibold text-lg ml-3'>Profile</h2>
                        </Link>
                    ) : (
                        <div className="animate-pulse h-10 w-28 bg-gray-100 rounded-full ml-4 my-2"></div>
                    )}
                    <div className='flex items-center px-4 py-3 hover:bg-gray-100 hover:cursor-pointer rounded-full transition text-gray-900'>
                        <CiBookmark size="26px" />
                        <h2 className='font-semibold text-lg ml-3'>Bookmarks</h2>
                    </div>
                    <div onClick={logoutHandler} className='flex items-center px-4 py-3 hover:bg-gray-100 hover:cursor-pointer rounded-full transition text-gray-900'>
                        <AiOutlineLogout size="26px" />
                        <h2 className='font-semibold text-lg ml-3'>Logout</h2>
                    </div>
                    <button className='mt-3 px-4 py-3 border-none text-base bg-[#1D9BF0] hover:bg-[#1A8CD8] w-full rounded-full text-white font-bold transition shadow-sm cursor-pointer'>
                        Post
                    </button>
                </div>
            </div>

            {user && (
                <div className='flex items-center justify-between p-2 hover:bg-gray-100 rounded-full transition cursor-pointer mb-2'>
                    <div className='flex items-center'>
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120"
                            alt="avatar"
                            className="size-10 rounded-full object-cover shrink-0"
                        />
                        <div className='ml-2 text-left leading-tight hidden lg:block'>
                            <p className='font-bold text-sm text-gray-900 truncate max-w-[100px]'>{user.name}</p>
                            <p className='text-xs text-gray-500 truncate max-w-[100px]'>@{user.username}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leftsidebar;
