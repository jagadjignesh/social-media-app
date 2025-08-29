import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const ChatUsers = () => {
    const [ conversations , setConversations ] = useState([]);
    const { siteurl } = useContext(AppContext); 
    const navigate = useNavigate();

    useEffect(() => {
        const getChatUsers = async () => {
            const url = siteurl+"/api/auth/get-chat-users";
            const { data } = await axios.post(url,{},{withCredentials:true});

            if(data.success === true){
                setConversations(data.conversation);
            }
        }
        getChatUsers();
    },[]);

    return (
        <div className="dark:bg-gray-900 bg-white text-gray-900 dark:text-white p-6 flex flex-col gap-6 md:flex-row">
            <div className="relative w-full flex flex-col rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <nav className="flex flex-col gap-1 p-1.5">
                    {conversations && conversations.length > 0 ? conversations.map((conversation, index) => (
                        <div
                            key={index}
                            role="button"
                            onClick={() => navigate(`/message/${conversation.user._id}`)}
                            className="flex w-full items-center rounded-md p-3 transition-all text-slate-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 focus:bg-slate-100 dark:focus:bg-gray-700 active:bg-slate-100 dark:active:bg-gray-700"
                        >
                            <div className="mr-4 grid place-items-center">
                                {conversation.user.profileimage && conversation.user.profileimage != "" ? (<img
                                    alt={conversation.user.name}
                                    src={siteurl+"/"+conversation.user.profileimage}
                                    className="inline-block h-12 w-12 rounded-full object-cover object-center"
                                />) : (<div className="relative w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-14 h-14 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                </div>)}
                            </div>
                            <div>
                                <h6 className="font-medium">{conversation.user.name}</h6>
                                <p className="text-sm text-slate-500 dark:text-gray-400">{conversation.lastMessage.text}</p>
                            </div>
                        </div>
                    )) : ( <h2 className="text-center">No Conversation Found.</h2>)}
                </nav>
            </div>
        </div>
    );
};

export default ChatUsers;