import { useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { io } from "socket.io-client";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Messages = () => {
    const { id } = useParams();
    const { currentUser, siteurl } = useContext(AppContext);
    const [ sendText, setSendText] = useState('');
    const [ chats , setChats ] = useState([]);
    const socketRef = useRef();
    const [ targetUser , setTargetUser ] = useState();
    const navigate = useNavigate();
    const [ isUserDeleted , setIsUserDeleted ] = useState(false);

    useEffect(() => {
        const message = async () => {
            try {
                const url = siteurl+"/api/auth/get-conversion";
                const { data } = await axios.post(url,{user_id:id},{withCredentials:true});
                
                if(data.success === true){
                    if(data.isUserDeleted) setIsUserDeleted(data.isUserDeleted);
                    setChats(data.messages);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        message();

        const getUser = async () => {
            try {
                const url = siteurl+"/api/auth/getuser";
                const { data } = await axios.post(url,{id},{withCredentials:true});
                
                if(data.success === true){
                    setTargetUser(data.user);
                }
            } catch (error) {
                console.error(error.message);
            }
        }

        getUser();
    },[]);

    useEffect(() => {
        socketRef.current = io(siteurl, { withCredentials: true });
        socketRef.current.emit("join", currentUser._id);

        const handleMessage = (message) => {
            setChats((prevChats) => [...prevChats, message.saveMessage]);
        }

        socketRef.current.on("receiveMessage", handleMessage);

        return () => {
            socketRef.current.off("receiveMessage", handleMessage);
        };
    },[siteurl, currentUser._id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if(isUserDeleted || sendText == '') return;

        const newMessage = {
            sender: currentUser._id,
            receiver: id,
            text: sendText
        };
        socketRef.current.emit("sendMessage", newMessage);
        setChats((prevChats) => [...prevChats, newMessage]);
        setSendText("");
    }

    return (
        <>
            <div className="dark:bg-gray-900 bg-white min-h-screen text-gray-900 dark:text-white md:p-4 flex flex-col gap-6 md:flex-row">
                <div className="relative w-full flex flex-col rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">

                    <div className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                        <button onClick={() => navigate(-1)} className="text-gray-700 dark:text-white">
                            ← Back
                        </button>
                        {targetUser && targetUser.profileimage && targetUser.profileimage != "" ? (<img src={siteurl + "/" + targetUser.profileimage} alt="My Avatar" className="w-12 h-12 rounded-full" />) : (<div className="relative w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                            <svg className="absolute w-12 h-12 text-gray-400 -left-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>)}
                        <span className="font-medium text-xl text-gray-800 dark:text-white">
                            {targetUser?.name || "Deleted User"}
                        </span>
                    </div>


                    <div className="h-screen overflow-y-auto p-4">
                        {chats.length > 0 ? chats.map((chat,index) => {
                            const isReceived = chat.receiver === currentUser._id;
                            return isReceived ? (
                            <div key={index} className="flex mb-4 cursor-pointer items-center">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                    {targetUser && targetUser.profileimage && targetUser.profileimage != "" ? (<img src={siteurl + "/" + targetUser.profileimage} alt="My Avatar" className="w-8 h-8 rounded-full" />) : (<div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                            <svg className="absolute w-8 h-8 text-gray-400 -left-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                        </div>)}
                                </div>
                                <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3">
                                    <p className="text-gray-700">{chat.text}</p>
                                </div>
                            </div>
                            ) : (
                                <div key={index} className="flex justify-end mb-4 cursor-pointer items-center">
                                    <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                                        <p>{chat.text}</p>
                                    </div>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                        {currentUser && currentUser.profileimage && currentUser.profileimage != "" ? (<img src={siteurl + "/" + currentUser.profileimage} alt="My Avatar" className="w-8 h-8 rounded-full" />) : (<div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                            <svg className="absolute w-8 h-8 text-gray-400 -left-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                        </div>)}
                                    </div>
                                </div>
                            );
                        }) : (<div className="w-full h-full flex justify-center items-center"><h2>Send a Message</h2></div>)}
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 lg:left-auto lg:right-auto lg:w-3/4 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 p-4">
                        <form onSubmit={sendMessage}>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={sendText}
                                    placeholder="Type a message..."
                                    onChange={(e) => setSendText(e.target.value)}
                                    disabled={isUserDeleted}
                                    className={`w-full p-2 rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 ${
                                    isUserDeleted ? 'cursor-not-allowed opacity-60' : ''
                                    }`}
                                />
                                <button
                                    disabled={isUserDeleted}
                                    className={`bg-indigo-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-indigo-600 transition-colors duration-200 ${
                                    isUserDeleted ? 'cursor-not-allowed opacity-60' : ''
                                    }`}
                                >
                                    ➤
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messages;