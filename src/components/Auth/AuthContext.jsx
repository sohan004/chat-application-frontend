import { createContext, useEffect, useState } from "react";
import { baseURL } from "../../App";


export const MainContext = createContext(null);

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [load, setLoad] = useState(true);

    useEffect(() => {
        setLoad(true);
        const token = localStorage.getItem('token');
        if (!token || user) {
            setLoad(false);
            return;
        }
        fetch(`${baseURL}/account`, {
            headers: { 'Authorization': `${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUser(data.userInfo);
                    setLoad(false);
                }
                else {
                    localStorage.removeItem('token');
                    setUser(null);
                    setLoad(false);
                }
            })
            .catch(err => {
                localStorage.removeItem('token');
                setUser(null);
                setLoad(false);
            })

    }, []);


    const value = {
        user,
        setUser,
        load,
        setLoad
    }
    return (
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    );
};

export default AuthContext;