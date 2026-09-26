import React, { useState } from 'react';
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getIsActive, getRefresh } from '../redux/tweetSlice';

const CreatePost = () => {
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { user } = useSelector(store => store.user);
    const { isActive } = useSelector(store => store.tweet);
    const dispatch = useDispatch();

    const submitHandler = async () => {
        if (!description.trim()) {
            toast.error("Please enter tweet text");
            return;
        }
        if (!user) {
            toast.error("Please log in to post a tweet");
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post(`${TWEET_API_END_POINT}/create`, {
                description,
                id: user?._id
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            dispatch(getRefresh());
            if (res.data.success) {
                toast.success(res.data.message || "Tweet posted!");
                setDescription("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post tweet");
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    const forYouHandler = () => {
        dispatch(getIsActive(true));
    };

    const followingHandler = () => {
        dispatch(getIsActive(false));
    };

    return (
        <div className='w-full border-b border-gray-200'>
            <div>
                <div className='flex items-center justify-evenly border-b border-gray-200'>
                    <div
                        onClick={forYouHandler}
                        className={`${
                            isActive ? "border-b-4 border-[#1D9BF0] font-bold text-gray-900" : "border-b-4 border-transparent text-gray-500 font-medium"
                        } cursor-pointer hover:bg-gray-100/70 w-full text-center px-4 py-3.5 transition`}
                    >
                        <h2 className='text-sm md:text-base'>For you</h2>
                    </div>
                    <div
                        onClick={followingHandler}
                        className={`${
                            !isActive ? "border-b-4 border-[#1D9BF0] font-bold text-gray-900" : "border-b-4 border-transparent text-gray-500 font-medium"
                        } cursor-pointer hover:bg-gray-100/70 w-full text-center px-4 py-3.5 transition`}
                    >
                        <h2 className='text-sm md:text-base'>Following</h2>
                    </div>
                </div>

                <div className='p-4'>
                    <div className='flex gap-3'>
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120"
                            className="size-10 rounded-full object-cover shrink-0"
                            alt='avatar'
                        />
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='w-full outline-none border-none text-lg text-gray-800 placeholder-gray-500 resize-none font-normal'
                            placeholder="What is happening?!"
                        />
                    </div>
                    <div className='flex items-center justify-between pt-3 border-t border-gray-100 mt-2'>
                        <div className='text-[#1D9BF0] hover:bg-blue-50 p-2 rounded-full cursor-pointer transition'>
                            <CiImageOn size="22px" />
                        </div>
                        <button
                            onClick={submitHandler}
                            disabled={submitting || !description.trim()}
                            className='bg-[#1D9BF0] hover:bg-[#1A8CD8] disabled:opacity-50 px-5 py-1.5 text-sm text-white font-bold border-none rounded-full cursor-pointer transition'
                        >
                            {submitting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
