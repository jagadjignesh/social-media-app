import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";

const Posts = ({posts}) => {
    const [ newposts , setPosts ] = useState(posts); 
    const { siteurl } = useContext(AppContext);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);


    useEffect(() => {
        if (posts) {
            setPosts(posts);
        }
    }, [posts]);

    const handleToggleLike = async (post_id) => {
        try {
            const url = siteurl + "/api/auth/like-dislike";
            const { data } = await axios.post(url, { post_id }, { withCredentials: true });

            if (data.success === true) {
                const isLiked = data.liked;

                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post._id === post_id) {
                            const updatedLikes = isLiked ? post.likes + 1 : post.likes - 1;
                            return { ...post, isLiked, likes: updatedLikes };
                        }
                        return post;
                    })
                );
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        }
    };

    const openCommentModal = async (post) => {
        setSelectedPost(post);
        try {
            const url = siteurl+"/api/auth/get-comment";
            const { data } = await axios.post(url,{post_id:post._id} , { withCredentials: true });
            if (data.success === true) {
                setComments(data.comments);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const closeCommentModal = () => {
        setSelectedPost(null);
        setCommentText("");
        setComments([]);
    };

    const handleAddComment = async () => {
        try {
            const url = siteurl+"/api/auth/add-comment";
            const { data } = await axios.post(url, {comment: commentText,post_id:selectedPost._id}, { withCredentials: true });

            if (data.success === true) {
                setComments(prev => [...prev, data.comment]);
                setCommentText("");

                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === selectedPost._id
                            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
                            : post
                    )
                );
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            <div className="grid gap-6">
                {newposts && newposts.length > 0 ? (newposts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-gray-800 rounded-lg p-4 shadow hover:shadow-lg transition"
                    >
                        <a href={`/profile/${post.user_id._id}`} className="flex items-center mb-3">
                            {post.user_id.profileimage && post.user_id.profileimage != "" ? (<img className="w-12 h-12 mr-3 rounded-full shadow-lg" src={siteurl+"/"+post.user_id.profileimage} alt="Bonnie image" />) : (<div className="m-2 relative w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                <svg className="absolute w-14 h-14 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            </div>)}
                            <h2 className="text-lg font-semibold">{post.user_id.name}</h2>
                        </a>
                        <img
                            src={siteurl+"/"+post.postimage}
                            // alt={post.title}
                            className="w-full h-48 object-cover rounded mb-3"
                        />
                        {/* <h4 className="text-lg font-semibold mb-1">{post.title}</h4> */}
                        <p className="text-gray-400 text-sm mb-2">{new Date(post.createdAt).toDateString()}</p>
                        <p className="text-gray-300 mb-3">{post.description}</p>
                        <div className="flex items-center justify-start gap-6 text-sm text-gray-400 border-t border-gray-700 pt-3">
                            <div className="flex items-center gap-1 cursor-pointer transition">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className={`w-5 h-5 cursor-pointer transition-colors duration-200 
                                                ${post.isLiked && post.isLiked === true ? 'fill-red-500 text-red-500' : 'fill-none text-gray-500 stroke-gray-500 stroke-2'}`}
                                    onClick={() => handleToggleLike(post._id)}
                                    >
                                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343 3.172 11.515a4 4 0 010-5.656z" />
                                </svg>
                                <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition" onClick={() => openCommentModal(post)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8h2a2 2 0 012 2v10l-4-4H7a2 2 0 01-2-2V8a2 2 0 012-2h2"
                                    />
                                </svg>
                                <span>{post.commnetCount}</span>
                            </div>
                        </div>
                    </div>
                ))) : (<div className="h-screen"><p>No Post Found.</p></div>)}
            </div>

            {selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 w-full max-w-lg h-3/4 rounded-lg overflow-hidden shadow-lg flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h3 className="text-white text-lg font-semibold">Comments</h3>
                            <button className="text-gray-400 hover:text-white" onClick={closeCommentModal}>✕</button>
                        </div>

                        {/* Comments list (scrollable) */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {comments.length > 0 ? comments.map((c, idx) => (
                                <div key={idx} className="flex gap-3 items-start">
                                    {c.user.profileimage ? (
                                        <img src={siteurl+"/"+c.user.profileimage} className="w-8 h-8 rounded-full" alt="user" />
                                    ) : (
                                        <div className="relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                            <svg className="absolute w-9 h-9 text-gray-400 -left-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-white font-medium">{c.user.name}</p>
                                        <p className="text-sm text-gray-300">{c.text}</p>
                                    </div>
                                </div>
                            )) : <p className="text-gray-400 text-sm">No comments yet.</p>}
                        </div>

                        {/* Input box (fixed at bottom) */}
                        <div className="border-t border-gray-700 p-4 flex items-center gap-2">
                            <textarea
                                className="flex-1 bg-gray-800 text-white p-2 rounded resize-none h-20"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                                onClick={() => handleAddComment(selectedPost._id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default Posts;