import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";
import { isDbConnected, memoryTweets, memoryUsers } from "../models/memoryStore.js";

export const createTweet = async (req, res, next) => {
    try {
        const { description, id } = req.body;
        const userId = id || req.user;
        if (!description || !userId) {
            return res.status(400).json({
                message: "Fields are required",
                success: false
            });
        }

        if (isDbConnected()) {
            const user = await User.findById(userId).select("-password");
            const newTweet = await Tweet.create({
                description,
                userId,
                userDetails: user ? [user] : []
            });
            return res.status(201).json({
                message: "Tweet Created Successfully",
                tweet: newTweet,
                success: true
            });
        } else {
            const user = memoryUsers.find(u => String(u._id) === String(userId));
            const safeUserDetails = user ? [{ _id: user._id, name: user.name, username: user.username }] : [];
            const newTweet = {
                _id: "mem_tweet_" + Date.now(),
                description,
                userId,
                userDetails: safeUserDetails,
                like: [],
                createdAt: new Date().toISOString()
            };
            memoryTweets.unshift(newTweet);
            return res.status(201).json({
                message: "Tweet Created Successfully",
                tweet: newTweet,
                success: true
            });
        }
    } catch (error) {
        console.error("createTweet error:", error);
        next(error);
    }
};

export const deleteTweet = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (isDbConnected()) {
            await Tweet.findByIdAndDelete(id);
        } else {
            const idx = memoryTweets.findIndex(t => String(t._id) === String(id));
            if (idx > -1) {
                memoryTweets.splice(idx, 1);
            }
        }
        return res.status(200).json({
            message: "Tweet Deleted successfully",
            success: true
        });
    } catch (error) {
        console.error("deleteTweet error:", error);
        next(error);
    }
};

export const likeOrDislike = async (req, res, next) => {
    try {
        const loggedInUserId = req.body.id || req.user;
        const tweetId = req.params.id;

        if (isDbConnected()) {
            const tweet = await Tweet.findById(tweetId);
            if (!tweet) {
                return res.status(404).json({
                    message: "Tweet not found",
                    success: false
                });
            }
            if (tweet.like.includes(loggedInUserId)) {
                await Tweet.findByIdAndUpdate(tweetId, { $pull: { like: loggedInUserId } });
                return res.status(200).json({
                    message: "User unliked your tweet",
                    success: true
                });
            } else {
                await Tweet.findByIdAndUpdate(tweetId, { $push: { like: loggedInUserId } });
                return res.status(200).json({
                    message: "User liked your tweet",
                    success: true
                });
            }
        } else {
            const tweet = memoryTweets.find(t => String(t._id) === String(tweetId));
            if (!tweet) {
                return res.status(404).json({
                    message: "Tweet not found",
                    success: false
                });
            }
            if (!tweet.like) tweet.like = [];
            const idx = tweet.like.indexOf(loggedInUserId);
            if (idx > -1) {
                tweet.like.splice(idx, 1);
                return res.status(200).json({
                    message: "User unliked your tweet",
                    success: true
                });
            } else {
                tweet.like.push(loggedInUserId);
                return res.status(200).json({
                    message: "User liked your tweet",
                    success: true
                });
            }
        }
    } catch (error) {
        console.error("likeOrDislike error:", error);
        next(error);
    }
};

export const getAllTweets = async (req, res, next) => {
    try {
        const id = req.params.id || req.user;

        if (isDbConnected()) {
            const loggedInUser = await User.findById(id);
            const loggedInUserTweets = await Tweet.find({ userId: id });
            const following = loggedInUser?.following || [];
            const followingUserTweet = await Promise.all(following.map((otherUsersId) => {
                return Tweet.find({ userId: otherUsersId });
            }));
            const all = loggedInUserTweets.concat(...followingUserTweet);
            all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.status(200).json({
                tweets: all,
                success: true
            });
        } else {
            const loggedInUser = memoryUsers.find(u => String(u._id) === String(id));
            const following = loggedInUser?.following || [];
            const allowedIds = new Set([String(id), ...following.map(String)]);
            const tweets = memoryTweets.filter(t => allowedIds.has(String(t.userId)));
            tweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.status(200).json({
                tweets: tweets.length > 0 ? tweets : memoryTweets,
                success: true
            });
        }
    } catch (error) {
        console.error("getAllTweets error:", error);
        next(error);
    }
};

export const getFollowingTweets = async (req, res, next) => {
    try {
        const id = req.params.id || req.user;

        if (isDbConnected()) {
            const loggedInUser = await User.findById(id);
            const following = loggedInUser?.following || [];
            const followingUserTweet = await Promise.all(following.map((otherUsersId) => {
                return Tweet.find({ userId: otherUsersId });
            }));
            const tweets = [].concat(...followingUserTweet);
            tweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.status(200).json({
                tweets,
                success: true
            });
        } else {
            const loggedInUser = memoryUsers.find(u => String(u._id) === String(id));
            const following = new Set((loggedInUser?.following || []).map(String));
            const tweets = memoryTweets.filter(t => following.has(String(t.userId)));
            tweets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.status(200).json({
                tweets,
                success: true
            });
        }
    } catch (error) {
        console.error("getFollowingTweets error:", error);
        next(error);
    }
};
