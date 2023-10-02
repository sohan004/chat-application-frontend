import { createContext, useEffect, useState } from "react";
import { baseURL } from "../../App";
import io from 'socket.io-client';
import { useLocation } from "react-router-dom";
const socket = io.connect('http://192.168.0.108:3000');


export const MainContext = createContext(null);

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [load, setLoad] = useState(true);
    const [chatList, setChatList] = useState([]);
    const [chatListLoad, setChatListLoad] = useState(true);
   

    useEffect(() => {
        if (!user) return;
        setChatListLoad(true);
        fetch(`${baseURL}/chatList`, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setChatList(data.chatList);
                    setChatListLoad(false);
                }
                else {
                    setChatList([]);
                    setChatListLoad(false);
                }
            })
            .catch(err => {
                setChatList([]);
                setChatListLoad(false);
            })
    }, [user]);

    useEffect(() => {
        setLoad(true);
        const token = localStorage.getItem('token');
        if (!token || user) {
            setLoad(false);
            return;
        }
        fetch(`${baseURL}/account`, {
            headers: { 'Authorization': `${token}` },
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
        setLoad,
        chatList,
        setChatList,
        chatListLoad,
        setChatListLoad,
        socket
    }
    return (
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    );
};

export default AuthContext;