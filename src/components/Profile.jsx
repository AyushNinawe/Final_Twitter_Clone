import React from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import useProfile from '../hooks/useProfile.js';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';

const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const { id } = useParams();
    useProfile(id);
    const dispatch = useDispatch();

    const isFollowing = user?.following?.includes(id);

    const followAndUnfollowHandler = async () => {
        if (!user) {
            toast.error("Please login first");
            return;
        }
        if (isFollowing) {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, { id: user?._id });
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data?.message || "Unfollowed successfully");
            } catch (error) {
                toast.error(error.response?.data?.message || "Error unfollowing user");
                console.log(error);
            }
        } else {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, { id: user?._id });
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data?.message || "Followed successfully");
            } catch (error) {
                toast.error(error.response?.data?.message || "Error following user");
                console.log(error);
            }
        }
    };

    const isSelf = profile?._id === user?._id || (!profile && id === user?._id);
    const activeProfile = profile || (id === user?._id ? user : null);

    return (
        <div className='w-full md:w-[50%] border-l border-r border-gray-200 min-h-screen'>
            <div>
                <div className='flex items-center px-4 py-2 sticky top-0 bg-white/80 backdrop-blur z-10 border-b border-gray-100'>
                    <Link to="/home" className='p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer transition'>
                        <IoMdArrowBack size="20px" />
                    </Link>
                    <div className='ml-3'>
                        <h1 className='font-bold text-lg leading-tight'>{activeProfile?.name || "Profile"}</h1>
                        <p className='text-gray-500 text-xs'>{activeProfile?.followers?.length || 0} followers</p>
                    </div>
                </div>

                <div className='relative'>
                    <div className='h-40 bg-gradient-to-r from-blue-400 via-sky-500 to-indigo-500 w-full object-cover'></div>
                    <div className='absolute -bottom-14 left-4 border-4 border-white rounded-full overflow-hidden bg-white shadow-md'>
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&h=240"
                            alt='avatar'
                            className='size-24 rounded-full object-cover'
                        />
                    </div>
                </div>

                <div className='text-right px-4 pt-4'>
                    {isSelf ? (
                        <button className='px-4 py-1.5 hover:bg-gray-100 rounded-full border border-gray-300 font-semibold text-sm transition'>
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={followAndUnfollowHandler}
                            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition ${
                                isFollowing
                                    ? "border border-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50 text-gray-800"
                                    : "bg-black text-white hover:bg-gray-800"
                            }`}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </button>
                    )}
                </div>

                <div className='px-4 mt-6'>
                    <h1 className='font-extrabold text-xl text-gray-900 leading-tight'>{activeProfile?.name || "User"}</h1>
                    <p className='text-gray-500 text-sm'>@{activeProfile?.username || "username"}</p>
                </div>

                <div className='px-4 my-3 text-sm text-gray-700 leading-relaxed'>
                    <p>🌐 Exploring the web's endless possibilities with MERN Stack 🚀 | Problem solver by day, coder by night 🌙 | Coffee lover ☕</p>
                </div>

                <div className='flex gap-4 px-4 text-sm text-gray-600 border-b border-gray-200 pb-4'>
                    <div><span className='font-bold text-gray-900'>{activeProfile?.following?.length || 0}</span> Following</div>
                    <div><span className='font-bold text-gray-900'>{activeProfile?.followers?.length || 0}</span> Followers</div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
