import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getOtherUsers } from "../redux/userSlice";

const useOtherUsers = (id) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOtherUsers = async () => {
            if (!id) return;
            try {
                const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`, {
                    withCredentials: true
                });
                if (res.data?.otherUsers) {
                    dispatch(getOtherUsers(res.data.otherUsers));
                }
            } catch (error) {
                console.log("Error fetching other users:", error);
            }
        };
        fetchOtherUsers();
    }, [dispatch, id]);
};

export default useOtherUsers;
