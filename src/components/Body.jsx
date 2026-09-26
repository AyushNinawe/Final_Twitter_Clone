import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Feed from './Feed';
import Profile from './Profile';

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/home",
        element: <Home />,
        children: [
            {
                index: true,
                element: <Feed />
            },
            {
                path: "profile/:id",
                element: <Profile />
            }
        ]
    },
    {
        path: "*",
        element: <Login />
    }
]);

const Body = () => {
    return <RouterProvider router={appRouter} />;
};

export default Body;
