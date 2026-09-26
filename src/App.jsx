import React, { useEffect } from 'react';
import './App.css';
import Body from './components/Body';
import { Toaster } from "react-hot-toast";
import axios from 'axios';

function App() {
  useEffect(() => {
    const token = localStorage.getItem("twitter_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    axios.defaults.withCredentials = true;
  }, []);

  return (
    <div className="App min-h-screen bg-white">
      <Body />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
