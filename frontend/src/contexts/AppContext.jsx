import { createContext, useState } from "react";

export const AppContext = createContext();

export const AuthProvider = (props) => {
    
    const [isLoggedIn , setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
    const [siteurl , setsiteurl] = useState("http://localhost:4001");

    return (
        <AppContext.Provider value={{isLoggedIn, setIsLoggedIn, siteurl}}>
            {props.children}
        </AppContext.Provider>
    );
}