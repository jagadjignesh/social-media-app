import { Outlet } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Sidebar from "./sidebar.jsx";
import { useState } from "react";

const Layout = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="flex h-screen">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default Layout;
