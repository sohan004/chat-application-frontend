import React, { useContext, useEffect, useState } from 'react';
import { IoPersonAddSharp } from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi';
import ChatList from './components/ChatList/ChatList';
import { FaSearch, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AiFillCloseSquare, AiOutlineClose } from 'react-icons/ai';
import AddUserModal from './components/AddUserModal/AddUserModal';
import AuthContext, { MainContext } from './components/Auth/AuthContext';
import SocketIoHandle from './components/SocketIoHandle/SocketIoHandle';
import LeftSideBar from './components/LeftSideBar/LeftSideBar';
import sound from './assets/audio/out-of-nowhere-message-tone.mp3';
import Wrap from './components/Wrap/Wrap';
import moment from 'moment';
import { toast } from 'react-toastify';

export const baseURL = 'http://192.168.0.108:3000'


const App = () => {
  const navigate = useNavigate();

  const { user, setUser, load, socket, setLoad, chatList, setChatList, chatListLoad, setChatListLoad } = useContext(MainContext);

  const path = useLocation().pathname;
  const chatIdPath = path?.split('/')[path?.split('/').length - 1]
  // console.log(chatIdPath);

  const newChatAdded = (change) => {
    // console.log(change?.chatInfo?.chatId);

    const mathChat = chatList?.find((d) => d?._id == change?.chatInfo?.chatId);
    console.log(mathChat);
    if (mathChat) {
      if (chatIdPath != change?.chatInfo?.chatId) {
        toast(change?.chatInfo?.message, {
          onClick: () => {
            navigate(`/chat/${change?.chatInfo?.chatId}`);
          }
        })
        const audio = new Audio(sound);
        audio.play();
        console.log('yes');
      }

      const newChatList = chatList?.filter((d) => d?._id != change?.chatInfo?.chatId);
      setChatList([
        {
          ...mathChat,
          lastMessage: change?.chatInfo,
          updatedAt: change?.chatInfo?.updatedAt
        }
        , ...newChatList]);
    }

  }

  useEffect(() => {
    socket.on('newChatAdd2', newChatAdded);

    return () => {
      socket.off('newChatAdd2');
    };
  }, [newChatAdded, path]);


  return (
    <div className='h-screen overflow-hidden overflow-y-auto flex'>

      <Wrap></Wrap>

      <div className='hidden md:block'>

        <LeftSideBar></LeftSideBar>
      </div>


      <div className='h-full flex-grow bg-slate-100 overflow-x-auto'>
        <Outlet></Outlet>
      </div>



      <AddUserModal></AddUserModal>
      <SocketIoHandle></SocketIoHandle>

      <dialog id="profile_details" className="modal px-3">
        <div className="modal-box bg-white max-w-xl relative">
          <AiOutlineClose
            onClick={() => window.profile_details.close()}
            className='absolute right-4 text-2xl cursor-pointer top-4'></AiOutlineClose>
          <img className="h-24 w-24 mx-auto rounded-full" src={baseURL + '/uploads/' + user?.profileImg} alt="" />
          <h1 className="text-center text-2xl font-semibold capitalize mt-3">{user?.name}</h1>
          <p className="text-center mt-1 text-lg">{user?.email}</p>
          <p className="text-center mt-1 opacity-50">Join at: {moment(user?.createdAt).format('MMMM Do YYYY')}</p>
          <p
            onClick={() => {
              window.profile_details.close();
              setChatList([]);
              localStorage.removeItem('token');
              setUser(null);
            }}
            className='text-center flex justify-center items-center gap-2 cursor-pointer text-xl mt-5 text-red-500'>Log Out <FaSignOutAlt></FaSignOutAlt></p>
        </div>
      </dialog>

    </div>
  );
};

export default App;