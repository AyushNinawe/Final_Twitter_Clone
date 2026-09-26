import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";

const useGetMyTweets = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector((store) => store.tweet);

    const fetchMyTweets = useCallback(async () => {
        if (!id) return;
        try {
            const res = await axios.get(`${TWEET_API_END_POINT}/alltweets/${id}`, {
                withCredentials: true,
            });
            if (res.data?.tweets) {
                dispatch(getAllTweets(res.data.tweets));
            }
        } catch (error) {
            console.log("Error fetching tweets:", error);
        }
    }, [dispatch, id]);

    const followingTweetHandler = useCallback(async () => {
        if (!id) return;
        try {
            const res = await axios.get(`${TWEET_API_END_POINT}/followingtweets/${id}`, {
                withCredentials: true,
            });
            if (res.data?.tweets) {
                dispatch(getAllTweets(res.data.tweets));
            }
        } catch (error) {
            console.log("Error fetching following tweets:", error);
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (isActive) {
            fetchMyTweets();
        } else {
            followingTweetHandler();
        }
    }, [isActive, refresh, fetchMyTweets, followingTweetHandler]);

    return null;
};

export default useGetMyTweets;
