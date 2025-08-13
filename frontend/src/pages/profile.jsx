import { useContext, useState } from 'react';
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from '../contexts/AppContext';
import { useEffect } from 'react';
import Posts from '../components/posts';
import { useLocation, useParams } from "react-router-dom";

const Profile = () => {
    const { siteurl } = useContext(AppContext);
    const [user , setUser] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const {id} = useParams();
    const [posts , setPosts] = useState();
    const location = useLocation();

    useEffect(() => {
        const getUser = async () => {
            try {
                const payload = id ? {id} : {};
                const url = siteurl+"/api/auth/getuser";
                const {data} = await axios.post(url,payload,{withCredentials:true});
        
                if(data.success === true){
                    if(data.user.profileimage){
                        data.user.profileimage = siteurl+"/"+data.user.profileimage;
                    }
                    setUser(data.user);
                } else {
                    toast.error(data.msg);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        getUser();


        const getposts = async () => {
            try {
                const payload = id ? {id} : {};
                const url = siteurl+"/api/auth/get-user-posts";
                const {data} = await axios.post(url,payload,{withCredentials:true});

                if(data.success === true){
                    setPosts(data.posts);
                }
            } catch (error) {
                toast.error(error.messege);
            }
        }

        getposts();
    },[location.pathname]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });

    const handleEditClick = () => {
        setEditedUser({ ...user });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const url = siteurl+"/api/auth/update-user";

        const formData = new FormData();
        formData.append("profileimage", selectedFile);
        formData.append("email", editedUser.email);
        formData.append("bio", editedUser.bio ?? '');
        formData.append("name", editedUser.name);

        try {
            const {data} = await axios.post(url, formData, {withCredentials:true});
            
            if(data.success === true){
                toast.success(data.msg);
                setUser(editedUser);
                setIsModalOpen(false);
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }

    };

    return (
        <div className="dark bg-gray-900 text-white min-h-screen p-6 flex-1">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-6 relative">
                    {user.profileimage && user.profileimage != "" ? (<img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={user.profileimage} alt="Bonnie image" />) : (<div className="m-2 relative w-24 h-24 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg className="absolute w-28 h-28 text-gray-400 -left-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                    </div>)}
                    <div>
                        <h2 className="text-2xl font-semibold">{user.name}</h2>
                        {/* <p className="text-gray-400">@{user.username}</p> */}
                        <div className="flex gap-4 mt-2 text-sm text-gray-300">
                            <span><strong>{user.followers ?user.followers.length : 0 }</strong> Followers</span>
                            <span><strong>{user.followings ?user.followings.length : 0}</strong> Following</span>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <button
                        onClick={handleEditClick}
                        className="absolute top-0 right-0 text-sm px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Bio */}
                <div className="mb-8">
                    <p className="text-gray-300">{user.bio}</p>
                </div>

                {/* Posts */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Posts</h3>
                    <Posts posts={posts} />
                </div>

                {/* Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <form encType="multipart/form-data" onSubmit={handleSave} >
                            <div className="bg-gray-800 p-6 rounded-lg w-96">
                                <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Profile Image</label>
                                        <input
                                            type="file"
                                            name="profileimage"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];

                                                if (file) {
                                                    setSelectedFile(file);
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setEditedUser((prev) => ({
                                                            ...prev,
                                                            profileimage: reader.result,
                                                        }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                } else {
                                                    // If user clears the file input
                                                    setEditedUser((prev) => ({
                                                        ...prev,
                                                        profileimage: '',
                                                    }));
                                                }
                                            }}
                                            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
                                        />

                                        {editedUser.profileimage && editedUser.profileimage != "" ? (
                                            <img
                                                src={editedUser.profileimage}
                                                alt="Preview"
                                                className="mt-4 w-24 h-24 object-cover rounded-full border-2 border-gray-600"
                                            />
                                        ) : (<div className="m-2 relative w-24 h-24 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                            <svg className="absolute w-28 h-28 text-gray-400 -left-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                        </div>)}
                                    </div>


                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedUser.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={editedUser.bio}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6 gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
