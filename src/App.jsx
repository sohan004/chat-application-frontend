import React, { useContext, useEffect, useState } from 'react';
import { IoPersonAddSharp } from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi';
import ChatList from './components/ChatList/ChatList';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { Outlet, useLocation } from 'react-router-dom';
import { AiFillCloseSquare } from 'react-icons/ai';
import AddUserModal from './components/AddUserModal/AddUserModal';
import AuthContext, { MainContext } from './components/Auth/AuthContext';
import SocketIoHandle from './components/SocketIoHandle/SocketIoHandle';
import LeftSideBar from './components/LeftSideBar/LeftSideBar';
import Wrap from './components/Wrap/Wrap';

export const baseURL = 'http://192.168.0.108:3000'


const App = () => {

  const { user, setUser, load, socket, setLoad, chatList, setChatList, chatListLoad, setChatListLoad } = useContext(MainContext);




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

    </div>
  );
};

export default App;