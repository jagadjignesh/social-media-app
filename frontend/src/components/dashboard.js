import { useContext, useEffect } from "react";
import { AppContext } from "../contexts/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TodoBoard from "./todoboard.jsx";
import Navbar from "./navbar.jsx";

const Dashboard = () => {

    const {isLoggedIn, setIsLoggedIn , siteurl} = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate('/login');
        }
    },[])


    const handelLogout = async () => {
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
    }

    return (
        <>
            <Navbar />
            <h2>Welcome User!</h2>
            <p>This is dashboard page bro.</p>
            <div className="form__sign-up" onClick={handelLogout}>Logout</div>
            <TodoBoard />
        </>
    )
}

export default Dashboard;
