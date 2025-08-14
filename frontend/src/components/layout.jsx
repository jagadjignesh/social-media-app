import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Sidebar from "./sidebar.jsx";
import { useEffect, useState } from "react";
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext.jsx';

const Layout = () => {
    const [isOpen, setIsOpen] = useState(false);
	const { isLoggedIn } = useContext(AppContext);
	const navigate = useNavigate();
    useEffect(() => {
        if(!isLoggedIn){
            navigate('/login');
        }
    },[]);

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
