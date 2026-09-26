import React, { useEffect } from 'react';
import Leftsidebar from './Leftsidebar';
import RightSidebar from './RightSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import useOtherUsers from '../hooks/useOtherUsers';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user, otherUsers } = useSelector(store => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useOtherUsers(user?._id);

  return (
    <div className='flex justify-between w-full max-w-7xl mx-auto px-2 md:px-6'>
      <Leftsidebar />
      <Outlet />
      <RightSidebar otherUsers={otherUsers} />
    </div>
  );
};

export default Home;
