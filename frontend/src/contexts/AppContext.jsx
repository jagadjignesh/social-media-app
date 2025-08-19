import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AuthProvider = (props) => {
    
    const [isLoggedIn , setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') || false);
    const [currentUser , setCurrentUser] = useState({});
    const siteurl = import.meta.env.VITE_SITE_URL;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userAuth = async () => {
            try {
                const url = siteurl+"/api/auth/authuser";
                const { data } = await axios.post(url,{},{withCredentials:true});

                if(data.success === true){
                    setCurrentUser(data.user);
                    localStorage.setItem("isLoggedIn", true);
                    setIsLoggedIn(true);
                } else {
                    localStorage.setItem("isLoggedIn",false);
                    setIsLoggedIn(false);
                    navigate('/login');
                }
            } catch (error) {
                console.error(error.message);
            }
        }

        if(location.pathname == '/feed'
            || location.pathname == '/message'
            || location.pathname.includes('/message/')
            || location.pathname == '/connections'
            || location.pathname == '/profile'
            || location.pathname.includes('/profile')
            || location.pathname == '/create-post'
            || location.pathname == '/'
        ){
            userAuth();
        }

    },[isLoggedIn,location.pathname]);

    return (
        <AppContext.Provider value={{isLoggedIn, setIsLoggedIn, siteurl , currentUser}}>
            {props.children}
        </AppContext.Provider>
    );
}
