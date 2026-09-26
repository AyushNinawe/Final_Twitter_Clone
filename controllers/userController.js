import { User } from "../models/userSchema.js";
import { isDbConnected, memoryUsers } from "../models/memoryStore.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const getSecret = () => process.env.TOKEN_SECRET || process.env.JWT_SECRET || "default_jwt_secret_dev_key";

export const Register = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        if (isDbConnected()) {
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    message: "User already exists",
                    success: false
                });
            }
            const hashedPassword = await bcryptjs.hash(password, 10);
            await User.create({
                name,
                username,
                email,
                password: hashedPassword
            });
            return res.status(201).json({
                message: "Account Created Successfully",
                success: true
            });
        } else {
            // Memory fallback
            const exists = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (exists) {
                return res.status(400).json({
                    message: "User already exists",
                    success: false
                });
            }
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = {
                _id: "mem_" + Date.now(),
                name,
                username,
                email,
                password: hashedPassword,
                followers: [],
                following: [],
                bookmarks: [],
                createdAt: new Date().toISOString()
            };
            memoryUsers.push(newUser);
            return res.status(201).json({
                message: "Account Created Successfully",
                success: true
            });
        }
    } catch (error) {
        console.error("Register error:", error);
        next(error);
    }
};

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false
            });
        }

        let user;
        if (isDbConnected()) {
            user = await User.findOne({ email });
        } else {
            user = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        }

        if (!user) {
            return res.status(401).json({
                message: "Incorrect Email or password",
                success: false
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect Email or password",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };
        const token = await jwt.sign(tokenData, getSecret(), { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        // Strip password
        const safeUser = { ...user };
        if (safeUser.toObject) {
            const obj = safeUser.toObject();
            delete obj.password;
            return res.status(200).json({
                message: `Welcome back ${user.name}`,
                user: obj,
                token,
                success: true
            });
        }

        delete safeUser.password;
        return res.status(200).json({
            message: `Welcome back ${user.name}`,
            user: safeUser,
            token,
            success: true
        });
    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
};

export const logout = (req, res) => {
    return res.cookie("token", "", { maxAge: 0 }).json({
        message: "User logged out successfully",
        success: true
    });
};

export const getMyProfile = async (req, res, next) => {
    try {
        const id = req.params.id;
        let user;
        if (isDbConnected()) {
            user = await User.findById(id).select("-password");
        } else {
            const found = memoryUsers.find(u => String(u._id) === String(id));
            if (found) {
                user = { ...found };
                delete user.password;
            }
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.error("getMyProfile error:", error);
        next(error);
    }
};

export const getOtherUsers = async (req, res, next) => {
    try {
        const { id } = req.params;
        let otherUsers = [];
        if (isDbConnected()) {
            otherUsers = await User.find({ _id: { $ne: id } }).select("-password");
        } else {
            otherUsers = memoryUsers
                .filter(u => String(u._id) !== String(id))
                .map(u => {
                    const copy = { ...u };
                    delete copy.password;
                    return copy;
                });
        }

        return res.status(200).json({
            otherUsers: otherUsers || [],
            success: true
        });
    } catch (error) {
        console.error("getOtherUsers error:", error);
        next(error);
    }
};

export const bookmark = async (req, res, next) => {
    try {
        const loggedInUserId = req.body.id || req.user;
        const tweetId = req.params.id;

        if (isDbConnected()) {
            const user = await User.findById(loggedInUserId);
            if (!user) {
                return res.status(404).json({ message: "User not found", success: false });
            }
            if (user.bookmarks.includes(tweetId)) {
                await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
                return res.status(200).json({
                    message: "Removed from bookmarks.",
                    success: true
                });
            } else {
                await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
                return res.status(200).json({
                    message: "Saved to bookmarks.",
                    success: true
                });
            }
        } else {
            const user = memoryUsers.find(u => String(u._id) === String(loggedInUserId));
            if (!user) {
                return res.status(404).json({ message: "User not found", success: false });
            }
            if (!user.bookmarks) user.bookmarks = [];
            const idx = user.bookmarks.indexOf(tweetId);
            if (idx > -1) {
                user.bookmarks.splice(idx, 1);
                return res.status(200).json({ message: "Removed from bookmarks.", success: true });
            } else {
                user.bookmarks.push(tweetId);
                return res.status(200).json({ message: "Saved to bookmarks.", success: true });
            }
        }
    } catch (error) {
        console.error("bookmark error:", error);
        next(error);
    }
};

export const follow = async (req, res, next) => {
    try {
        const loggedInUserId = req.body.id || req.user;
        const userId = req.params.id;

        if (isDbConnected()) {
            const loggedInUser = await User.findById(loggedInUserId);
            const user = await User.findById(userId);
            if (!user || !loggedInUser) {
                return res.status(404).json({ message: "User not found", success: false });
            }
            if (!user.followers.includes(loggedInUserId)) {
                await user.updateOne({ $push: { followers: loggedInUserId } });
                await loggedInUser.updateOne({ $push: { following: userId } });
            } else {
                return res.status(400).json({
                    message: `User already followed to ${user.name}`,
                    success: false
                });
            }
            return res.status(200).json({
                message: `${loggedInUser.name} just followed ${user.name}`,
                success: true
            });
        } else {
            const loggedInUser = memoryUsers.find(u => String(u._id) === String(loggedInUserId));
            const user = memoryUsers.find(u => String(u._id) === String(userId));
            if (!user || !loggedInUser) {
                return res.status(404).json({ message: "User not found", success: false });
            }
            if (!user.followers.includes(loggedInUserId)) {
                user.followers.push(loggedInUserId);
                loggedInUser.following.push(userId);
            } else {
                return res.status(400).json({
                    message: `User already followed to ${user.name}`,
                    success: false
                });
            }
            return res.status(200).json({
                message: `${loggedInUser.name} just followed ${user.name}`,
                success: true
            });
        }
    } catch (error) {
        console.error("follow error:", error);
        next(error);
    }
};

export const unfollow = async (req, res, next) => {
    try {
        const loggedInUserId = req.body.id || req.user;
        const userId = req.params.id;

        if (isDbConnected()) {
            const loggedInUser = await User.findById(loggedInUserId);
            const user = await User.findById(userId);
            if (!user || !loggedInUser) {
                return res.status(404).json({ message: "User not found", success: false });
            }
            if (user.followers.includes(loggedInUserId)) {
                await user.updateOne({ $pull: { followers: loggedInUserId } });
                await loggedInUser.updateOne({ $pull: { following: userId } });
            } else {
                return res.status(400).json({
                    message: `User has not followed yet`,
                    success: false
                });
            }
            return res.status(200).json({
                message: `${user.name} unfollowed ${loggedInUser.name}`,
                success: true
            });
        } else {
            const loggedInUser = memoryUsers.find(u => String(u._id) === String(loggedInUserId));
            const user = memoryUsers.find(u => String(u._id) === String(userId));
            if (!user || !loggedInUser) {
                return res.status(404).json({ message: "User not found", success: false });
            }
            user.followers = user.followers.filter(id => id !== loggedInUserId);
            loggedInUser.following = loggedInUser.following.filter(id => id !== userId);
            return res.status(200).json({
                message: `${user.name} unfollowed ${loggedInUser.name}`,
                success: true
            });
        }
    } catch (error) {
        console.error("unfollow error:", error);
        next(error);
    }
};
