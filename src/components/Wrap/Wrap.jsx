import React, { useContext, useEffect } from 'react';
import { MainContext } from '../Auth/AuthContext';
import { useLocation } from 'react-router-dom';
import sound from '../../assets/audio/out-of-nowhere-message-tone.mp3'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Wrap = ({ children }) => {
    const { user, setUser, load, socket, setLoad, chatList, setChatList, chatListLoad, setChatListLoad } = useContext(MainContext);

    const path = useLocation().pathname;
    const chatIdPath = path?.split('/')[path?.split('/').length - 1]
  

    useEffect(() => {
        socket.on('seenBy', async (change) => {
            const check = chatList?.map(c => {
                if (c._id == change?.chatId) {
                    return {
                        ...c,
                        lastMessage: {
                            ...c.lastMessage,
                            seenBy: [...c.lastMessage.seenBy, change.seenByUser]
                        }
                    }
                }
                else {
                    return c
                }
            })

            setChatList(check)
        });
        return () => {
            socket.off('seenBy');
        };
    }, [chatList, path]);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default Wrap;