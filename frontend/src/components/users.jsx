import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const Users = ({state}) => {
    const { siteurl } = useContext(AppContext);
    const [users, setUsers] = useState();
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState();

    useEffect(() => {
        const userConnections = async () => {
            try {
                const url = siteurl + "/api/auth/user-connections";
                const { data } = await axios.post(url, {state}, { withCredentials: true });

                if (data.success === true) {
                    setUsers(data.users);
                    setCurrentUserId(data.user_id);
                } else {
                    toast.error(data.msg);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        userConnections();
    }, [state]);

    const handleFollow = async (user_id) => {
    try {
        const url = siteurl + "/api/auth/follow-user";
        const { data } = await axios.post(url, { user_id }, { withCredentials: true });

        if (data.success === true) {
            toast.success(data.msg);

            setUsers(prevUsers =>
                prevUsers.map(user => {
                    if (user._id === user_id) {
                        const isFollowing = user.followers?.includes(currentUserId);

                        let updatedFollowers;
                        if (isFollowing) {
                            updatedFollowers = user.followers.filter(id => id !== currentUserId);
                        } else {
                            updatedFollowers = [...(user.followers || []), currentUserId];
                        }

                        return {
                            ...user,
                            followers: updatedFollowers
                        };
                    }
                    return user;
                })
            );

        } else {
            toast.error(data.msg);
        }
    } catch (error) {
        toast.error(error.message);
    }
}


    return (
        <>
            <div className="flex flex-wrap">
                {users && users != '' ? (users.map((user, index) => {
                    const isFollowing = user.followers?.includes(currentUserId);
                    return (
                        <div key={index} className="w-full sm:w-1/2 md:w-1/4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 m-7 py-5">
                            <div className="flex flex-col items-center pb-10">
                                {user.profileimage && user.profileimage != "" ? (<img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={siteurl+"/"+user.profileimage} alt="Bonnie image" />) : (<div className="m-2 relative w-24 h-24 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-28 h-28 text-gray-400 -left-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                </div>)}
                                
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.name}</h5>
                                <span className="text-sm text-center text-gray-500 dark:text-gray-400">{user.bio}</span>
                                <div className="flex gap-4 mt-2 text-sm text-gray-300">
                                    <span><strong>{user.followers ?user.followers.length : 0 }</strong> Followers</span>
                                    <span><strong>{user.followings ?user.followings.length : 0}</strong> Following</span>
                                </div>
                                <div className="flex mt-4 md:mt-6">
                                    <div className={`cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none 
                                    ${isFollowing ? 
                                        'bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900' 
                                        : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}`} 
                                    onClick={() => handleFollow(user._id)}>{isFollowing ? "Unfollow" : "Follow"}</div>
                                    <div className="cursor-pointer py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={() => navigate("/profile/" + user._id)}>View Profile</div>
                                </div>
                            </div>
                        </div>
                    )
                })) : (<p>Users not found.</p>)}

            </div>
        </>
    )
}

export default Users;