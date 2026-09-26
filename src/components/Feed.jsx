import React from 'react';
import CreatePost from './CreatePost';
import Tweet from './Tweet';
import { useSelector } from "react-redux";
import useGetMyTweets from "../hooks/useGetMyTweets";

const Feed = () => {
  const { tweets } = useSelector(store => store.tweet);
  const { user } = useSelector(store => store.user);

  useGetMyTweets(user?._id);

  return (
    <div className='w-full md:w-[50%] border-l border-r border-gray-200 min-h-screen'>
      <div>
        <CreatePost />
        {tweets && tweets.length > 0 ? (
          tweets.map((tweet) => (
            <Tweet key={tweet?._id || Math.random()} tweet={tweet} />
          ))
        ) : (
          <div className='p-8 text-center text-gray-400'>
            <p className='font-medium text-base'>No tweets to display yet.</p>
            <p className='text-sm mt-1'>Post your first update above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
