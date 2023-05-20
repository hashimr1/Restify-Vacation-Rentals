import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);


// setToken is a setter function for the token, can be used in other components
// simply retrieve the context which will return the {token, setToken} dict and
// use the setToken function, or use the token
export const AuthProvider = ({children}) => {
    // put your variable with token here to use:
    const [token, setToken] = useState("");

    const updateToken = (val) => {
        setToken(val);
    }
    useEffect(() => {
        setToken(window.localStorage.getItem('token'));
    },[])
    return(
        <AuthContext.Provider value={{token, setToken, updateToken}}>
            {children}
        </AuthContext.Provider>
    )
}