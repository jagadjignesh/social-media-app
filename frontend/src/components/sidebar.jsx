import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Menu,
    X,
    Home,
    MessageSquare,
    Users,
    User,
    Plus,
    Settings,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {


    const active_link =
        "flex items-center px-4 py-2 mt-5 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200";
    const inactive_link =
        "flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700";

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>


            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r dark:bg-gray-900 dark:border-gray-700 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block`}
            >
                {/* Mobile Toggle Button */}
                <div className="md:hidden">
                    <button onClick={toggleSidebar} className="text-gray-800 dark:text-white">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav>
                        <NavLink
                            to="/feed"
                            onClick={closeSidebar}
                            className={({ isActive }) => (isActive ? active_link : inactive_link)}
                        >
                            <Home size={20} />
                            <span className="mx-4 font-medium">Feed</span>
                        </NavLink>

                        <NavLink
                            to="/message"
                            onClick={closeSidebar}
                            className={({ isActive }) => (isActive ? active_link : inactive_link)}
                        >
                            <MessageSquare size={20} />
                            <span className="mx-4 font-medium">Message</span>
                        </NavLink>

                        <NavLink
                            to="/connections"
                            onClick={closeSidebar}
                            className={({ isActive }) => (isActive ? active_link : inactive_link)}
                        >
                            <Users size={20} />
                            <span className="mx-4 font-medium">Connections</span>
                        </NavLink>

                        <NavLink
                            to="/profile"
                            onClick={closeSidebar}
                            className={({ isActive }) => (isActive ? active_link : inactive_link)}
                        >
                            <User size={20} />
                            <span className="mx-4 font-medium">Profile</span>
                        </NavLink>

                        <hr className="my-6 border-gray-200 dark:border-gray-600" />

                        <NavLink
                            to="/create-post"
                            onClick={closeSidebar}
                            className={({ isActive }) => (isActive ? active_link : inactive_link)}
                        >
                            <Plus size={20} />
                            <span className="mx-4 font-medium">Create Post</span>
                        </NavLink>

                        <a href="#" className={inactive_link}>
                            <Settings size={20} />
                            <span className="mx-4 font-medium">Settings</span>
                        </a>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
