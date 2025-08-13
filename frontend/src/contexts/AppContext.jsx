import { createContext, useState } from "react";

export const AppContext = createContext();

export const AuthProvider = (props) => {
    
    const [isLoggedIn , setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
    const siteurl = import.meta.env.VITE_SITE_URL;

    return (
        <AppContext.Provider value={{isLoggedIn, setIsLoggedIn, siteurl}}>
            {props.children}
        </AppContext.Provider>
    );
}
