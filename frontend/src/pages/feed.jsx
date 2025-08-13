import { useContext, useEffect, useState } from "react";
import Posts from "../components/posts";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";

const Feed = () => {
    const { siteurl } = useContext(AppContext);
    const [ feed , setFeed ] = useState();

    useEffect(() => {
        
        const getUserFeed = async () => {
            const url = siteurl+"/api/auth/user-feed";
            const { data } = await axios.post(url,{},{withCredentials:true});

            if(data.success === true) {
                setFeed(data.posts);
            } else {
                toast.error(data.msg);
            }
        }
        
        getUserFeed();
    },[]);

    return (
        <>
            <div className="dark bg-gray-900 text-white p-6 flex">
                {/* <h2>feed</h2> */}
                <div className="flex-2">
                    <Posts posts={feed} />
                </div>
                {/* <div className="flex-1 px-6">
                    <h2>Recent Message</h2>
                    <p>Comming Soon...</p>
                </div> */}
            </div>
        </>
    )
}

export default Feed;