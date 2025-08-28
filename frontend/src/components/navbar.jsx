import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../contexts/AppContext";
import { Menu } from "lucide-react";

const Navbar = ({isOpen, setIsOpen}) => {
    const {isLoggedIn, setIsLoggedIn , siteurl, currentUser} = useContext(AppContext);
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handelLogout = async () => {
        try {
            const url = siteurl+"/api/auth/logout";
            const res = await axios.post(url,null,{withCredentials:true});
    
            if(res.data.success){
                localStorage.setItem("isLoggedIn",false);
                setIsLoggedIn(false);
                toast(res.data.msg);
                navigate('/login');
            } else {
                toast.error(res.data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handelUserDelete = async () => {
        try {
            const url = siteurl+"/api/auth/delete-user";
            const { data } = await axios.post(url,{},{withCredentials:true});

            if(data.success === true){
                localStorage.setItem("isLoggedIn",false);
                setIsLoggedIn(false);
                toast(data.msg);
                setShowDeleteConfirm(false); 
                navigate('/login');
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Mobile Toggle Button */}
                    <div className="sm:hidden m-3">
                        <button onClick={toggleSidebar} className="text-gray-800 dark:text-white">
                        {<Menu size={28} />}
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex shrink-0 items-center">
                            <img src="src/assets/social-world.png" alt="Your Company" className="h-8 w-auto" />
                        </div>
                        <h2 className="relative rounded-full bg-gray-800 p-1 text-gray-400  ml-3 text-white">Social World</h2>
                        {/* <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <a href="#" aria-current="page" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Dashboard</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
                            </div>
                        </div> */}
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span className="absolute -inset-1.5"></span>
                        <span className="sr-only">View notifications</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true" className="size-6">
                            <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        </button> */}

                        <el-dropdown className="relative ml-3">
                        <button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
                            <span className="absolute -inset-1.5"></span>
                            <span className="sr-only">Open user menu</span>

                            {currentUser && currentUser.profileimage && currentUser.profileimage != "" ? (<img src={siteurl+"/"+currentUser.profileimage} alt="" className="size-8 rounded-full" />) : (<div className="m-2 relative w-8 h-8 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                            <svg className="absolute w-8 h-8 text-gray-400 -left-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>)}
                        </button>

                        <el-menu anchor="bottom end" popover className="w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden">Your Profile</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 focus:bg-gray-100 focus:outline-hidden" onClick={handelLogout}>Sign out</a>
                            <a href="#" className="block px-4 py-2 text-sm text-red-700 focus:bg-red-100 focus:outline-hidden" onClick={() => setShowDeleteConfirm(true)}>Delete Account</a>
                        </el-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>

            {/* <el-disclosure id="mobile-menu" hidden className="block sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                <a href="#" aria-current="page" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">Dashboard</a>
                <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
                <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a>
                <a href="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
                </div>
            </el-disclosure> */}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Account Deletion</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handelUserDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
