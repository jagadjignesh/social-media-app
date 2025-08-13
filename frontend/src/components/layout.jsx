import { Outlet } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Sidebar from "./sidebar.jsx";

const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="flex h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default Layout;
