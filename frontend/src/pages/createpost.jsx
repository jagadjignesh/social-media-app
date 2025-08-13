import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState();
    const [description , setDescription] = useState('');
    const { siteurl } = useContext(AppContext);
    const navigate = useNavigate();

    const handlePostCreate = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("postimage",selectedFile);
        formdata.append("description",description);

        try {
            const url = siteurl+"/api/auth/create-post";
            const {data} = await axios.post(url,formdata,{withCredentials:true});

            if(data.success === true){
                toast.success(data.msg);
                navigate('/feed');
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <div className="dark bg-gray-900 text-white min-h-screen p-6 flex-1">
                <form encType="multipart/form-data" onSubmit={handlePostCreate}>
                    <div className="bg-gray-800 p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Create Post</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Post Image</label>

                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="my-4 w-full h-full object-cover border-2 border-gray-600"
                                    />
                                )}
                                <input
                                    type="file"
                                    name="postimage"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];

                                        if (file) {
                                            setSelectedFile(file);
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setPreviewImage(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        } else {
                                            // If user clears the file input
                                            setPreviewImage("");
                                            setSelectedFile("");
                                        }
                                    }}
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreatePost;