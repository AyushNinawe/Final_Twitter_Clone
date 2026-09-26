import React from 'react';
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';

const RightSidebar = ({ otherUsers }) => {
  return (
    <div className='w-[25%] hidden md:block pl-4'>
      <div className='flex items-center p-2.5 bg-gray-100 rounded-full outline-none w-full border border-transparent focus-within:border-[#1D9BF0] focus-within:bg-white transition'>
        <CiSearch size="20px" className="text-gray-500" />
        <input type="text" className='bg-transparent outline-none px-2 w-full text-sm' placeholder='Search' />
      </div>
      <div className='p-4 bg-gray-50 border border-gray-100 rounded-2xl my-4'>
        <h1 className='font-bold text-lg mb-3'>Who to follow</h1>
        {otherUsers && otherUsers.length > 0 ? (
          otherUsers.map((user) => {
            return (
              <div key={user?._id} className='flex items-center justify-between my-3'>
                <div className='flex items-center'>
                  <img
                    src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120'
                    alt='avatar'
                    className='size-10 shrink-0 rounded-full object-cover'
                  />
                  <div className='ml-2.5'>
                    <h2 className='font-bold text-sm leading-tight text-gray-900'>{user?.name}</h2>
                    <p className='text-xs text-gray-500'>@{user?.username}</p>
                  </div>
                </div>
                <div>
                  <Link to={`/home/profile/${user?._id}`}>
                    <button className='px-4 py-1.5 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-semibold transition'>
                      Profile
                    </button>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className='text-sm text-gray-400 py-2'>No suggestions available right now.</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
