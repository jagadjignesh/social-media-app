import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AuthProvider = (props) => {
    
    const [isLoggedIn , setIsLoggedIn] = useState();
    const siteurl = import.meta.env.VITE_SITE_URL;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userAuth = async () => {
            try {
                const url = siteurl+"/api/auth/authuser";
                const { data } = await axios.post(url,{},{withCredentials:true});

                if(data.success === true){
                    localStorage.setItem("isLoggedIn", true);
                    setIsLoggedIn(true);
                } else {
                    localStorage.setItem("isLoggedIn",false);
                    setIsLoggedIn(false);
                    navigate('/');
                }
            } catch (error) {
                console.error(error.message);
            }
        }

        if(location.pathname != '/register'){
            userAuth();
        }

    },[location.pathname]);

    return (
        <AppContext.Provider value={{isLoggedIn, setIsLoggedIn, siteurl}}>
            {props.children}
        </AppContext.Provider>
    );
}
