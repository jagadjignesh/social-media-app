import { createContext, useState } from "react";

export const AppContext = createContext();

export const AuthProvider = (props) => {
    
    const [isLoggedIn , setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
    const siteurl = process.env.REACT_APP_SITE_URL;

    return (
        <AppContext.Provider value={{isLoggedIn, setIsLoggedIn, siteurl}}>
            {props.children}
        </AppContext.Provider>
    );
}
