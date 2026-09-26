import React, { useEffect, useState } from 'react';
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from '../redux/userSlice';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      // LOGIN
      try {
        const res = await axios.post(`${USER_API_END_POINT}/login`, {
          email,
          password
        }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        });

        if (res.data.success) {
          if (res.data.token) {
            localStorage.setItem("twitter_token", res.data.token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
          }
          dispatch(getUser(res.data.user));
          toast.success(res.data.message || "Logged in successfully!");
          navigate("/home");
        }
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Invalid credentials or server unavailable");
        }
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      // SIGNUP
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, {
          name,
          username,
          email,
          password
        }, {
          headers: {
            'Content-Type': "application/json"
          },
          withCredentials: true
        });

        if (res.data.success) {
          setIsLogin(true);
          toast.success(res.data.message || "Account created! You can now log in.");
        }
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Registration failed. Please try again.");
        }
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const loginSignupHandler = () => {
    setIsLogin(!isLogin);
  };

  // Demo fill convenience
  const fillDemoAccount = () => {
    setEmail("demo@example.com");
    setPassword("password123");
  };

  return (
    <div className='w-screen min-h-screen bg-white flex items-center justify-center p-4'>
      <div className='flex flex-col md:flex-row items-center justify-evenly w-full max-w-5xl gap-8 py-8'>
        <div className='flex items-center justify-center'>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-28 md:w-56 h-28 md:h-56 fill-black">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>
        <div className='w-full max-w-md'>
          <div className='my-4'>
            <h1 className='font-extrabold text-4xl md:text-5xl tracking-tight text-gray-900'>Happening now</h1>
            <p className='text-gray-500 font-medium mt-1'>Join the conversation today.</p>
          </div>
          <h2 className='mt-6 mb-4 text-2xl font-bold text-gray-900'>
            {isLogin ? "Sign in to X" : "Create your account"}
          </h2>
          <form onSubmit={submitHandler} className='flex flex-col w-full gap-3'>
            {!isLogin && (
              <>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Name'
                  className="outline-[#1D9BF0] border border-gray-300 px-4 py-2.5 rounded-full font-medium text-sm focus:border-[#1D9BF0] transition"
                />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='Username'
                  className="outline-[#1D9BF0] border border-gray-300 px-4 py-2.5 rounded-full font-medium text-sm focus:border-[#1D9BF0] transition"
                />
              </>
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              className="outline-[#1D9BF0] border border-gray-300 px-4 py-2.5 rounded-full font-medium text-sm focus:border-[#1D9BF0] transition"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className="outline-[#1D9BF0] border border-gray-300 px-4 py-2.5 rounded-full font-medium text-sm focus:border-[#1D9BF0] transition"
            />
            <button
              type="submit"
              disabled={loading}
              className='bg-[#1D9BF0] hover:bg-[#1A8CD8] active:scale-98 transition disabled:opacity-50 border-none py-2.5 my-2 rounded-full text-base text-white font-bold cursor-pointer shadow-sm'
            >
              {loading ? "Processing..." : isLogin ? "Sign in" : "Create Account"}
            </button>
            <div className='flex justify-between items-center text-sm mt-2'>
              <span className='text-gray-600'>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={loginSignupHandler}
                  className='font-bold text-[#1D9BF0] hover:underline cursor-pointer bg-transparent border-none p-0'
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </span>
              {isLogin && (
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className='text-xs text-gray-500 hover:text-gray-800 underline bg-transparent border-none cursor-pointer'
                >
                  Use Demo Account
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
