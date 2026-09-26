import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

export const isDbConnected = () => mongoose.connection.readyState === 1;

const defaultHash = bcryptjs.hashSync("password123", 10);

export const memoryUsers = [
  {
    _id: "660000000000000000000001",
    name: "Ayush Ninawe",
    username: "ayushninawe",
    email: "demo@example.com",
    password: defaultHash,
    followers: ["660000000000000000000002"],
    following: ["660000000000000000000002", "660000000000000000000003"],
    bookmarks: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: "660000000000000000000002",
    name: "Sarah Jenkins",
    username: "sarahj",
    email: "sarah@example.com",
    password: defaultHash,
    followers: ["660000000000000000000001"],
    following: ["660000000000000000000001"],
    bookmarks: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: "660000000000000000000003",
    name: "Alex Rivera",
    username: "alex_dev",
    email: "alex@example.com",
    password: defaultHash,
    followers: ["660000000000000000000001"],
    following: [],
    bookmarks: [],
    createdAt: new Date().toISOString()
  }
];

export const memoryTweets = [
  {
    _id: "770000000000000000000001",
    description: "Welcome to Twitter Clone! 🚀 Full-stack React + Express app running smoothly with unified frontend and backend.",
    userId: "660000000000000000000001",
    userDetails: [
      {
        _id: "660000000000000000000001",
        name: "Ayush Ninawe",
        username: "ayushninawe"
      }
    ],
    like: ["660000000000000000000002"],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: "770000000000000000000002",
    description: "Just deployed the new unified architecture! Frontend and backend in one repository on port 3000. ✨",
    userId: "660000000000000000000002",
    userDetails: [
      {
        _id: "660000000000000000000002",
        name: "Sarah Jenkins",
        username: "sarahj"
      }
    ],
    like: ["660000000000000000000001"],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];
