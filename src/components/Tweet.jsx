import React from 'react';
import { FaRegComment } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart, CiBookmark } from "react-icons/ci";
import axios from "axios";
import { TWEET_API_END_POINT, timeSince } from '../utils/constant';
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getRefresh } from '../redux/tweetSlice';

const Tweet = ({ tweet }) => {
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const author = Array.isArray(tweet?.userDetails) ? tweet?.userDetails[0] : tweet?.userDetails;
    const authorName = author?.name || "User";
    const authorUsername = author?.username || "user";
    const isLiked = tweet?.like?.includes(user?._id);

    const likeOrDislikeHandler = async (id) => {
        try {
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${id}`, { id: user?._id }, {
                withCredentials: true
            });
            dispatch(getRefresh());
            if (res.data?.message) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error toggling like");
            console.log(error);
        }
    };

    const deleteTweetHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`);
            dispatch(getRefresh());
            if (res.data?.message) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting tweet");
            console.log(error);
        }
    };

    return (
        <div className='border-b border-gray-200 hover:bg-gray-50/50 transition-colors'>
            <div className='flex p-4 gap-3'>
                <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120"
                    alt="avatar"
                    className="size-10 rounded-full object-cover shrink-0"
                />
                <div className='w-full'>
                    <div className='flex items-center gap-1.5'>
                        <h1 className='font-bold text-gray-900'>{authorName}</h1>
                        <p className='text-gray-500 text-sm'>@{authorUsername}</p>
                        {tweet?.createdAt && (
                            <span className='text-gray-400 text-xs'>• {timeSince(tweet.createdAt)}</span>
                        )}
                    </div>
                    <div className='mt-1'>
                        <p className='text-gray-800 text-[15px] whitespace-pre-wrap break-words leading-normal'>{tweet?.description}</p>
                    </div>
                    <div className='flex justify-between items-center mt-3 max-w-md text-gray-500'>
                        <div className='flex items-center gap-1 hover:text-blue-500 cursor-pointer group'>
                            <div className='p-2 group-hover:bg-blue-50 rounded-full transition'>
                                <FaRegComment size="17px" />
                            </div>
                            <span className='text-xs'>0</span>
                        </div>
                        <div onClick={() => likeOrDislikeHandler(tweet?._id)} className={`flex items-center gap-1 cursor-pointer group ${isLiked ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'}`}>
                            <div className='p-2 group-hover:bg-pink-50 rounded-full transition'>
                                <CiHeart size="20px" className={isLiked ? "fill-pink-600 text-pink-600" : ""} />
                            </div>
                            <span className='text-xs'>{tweet?.like?.length || 0}</span>
                        </div>
                        <div className='flex items-center gap-1 hover:text-yellow-600 cursor-pointer group'>
                            <div className='p-2 group-hover:bg-yellow-50 rounded-full transition'>
                                <CiBookmark size="20px" />
                            </div>
                            <span className='text-xs'>0</span>
                        </div>
                        {user?._id === tweet?.userId && (
                            <div onClick={() => deleteTweetHandler(tweet?._id)} className='flex items-center hover:text-red-600 cursor-pointer group' title="Delete Tweet">
                                <div className='p-2 group-hover:bg-red-50 rounded-full transition'>
                                    <MdOutlineDeleteOutline size="20px" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tweet;
