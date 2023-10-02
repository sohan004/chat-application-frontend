import React, { useContext, useEffect } from 'react';
import { MainContext } from '../Auth/AuthContext';
import { useLocation } from 'react-router-dom';

const Wrap = ({ children }) => {
    const { user, setUser, load, socket, setLoad, chatList, setChatList, chatListLoad, setChatListLoad } = useContext(MainContext);

    const path = useLocation().pathname;
    const chatIdPath = path?.split('/')[path?.split('/').length - 1]
    // console.log(chatIdPath);

    useEffect(() => {
        socket.on('newChatAdd', async (change) => {
            const mathChat = chatList?.find((d) => d?._id === change?.chatInfo?.chatId);
            console.log(mathChat);
            if (mathChat) {
                const newChatList = chatList?.filter((d) => d?._id != change?.chatInfo?.chatId);
                setChatList([
                    {
                        ...mathChat,
                        lastMessage: change?.chatInfo,
                        updatedAt: change?.chatInfo?.updatedAt
                    }
                    , ...newChatList]);
            }

        });
        return () => {
            socket.off('newChatAdd');
        };
    }, [chatList, path]);

  


    return (
        <>

        </>
    );
};

export default Wrap;