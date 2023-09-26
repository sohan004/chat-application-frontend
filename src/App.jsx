import React, { useState } from 'react';
import { IoPersonAddSharp } from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi';
import ChatList from './components/ChatList/ChatList';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import { AiFillCloseSquare } from 'react-icons/ai';
import AddUserModal from './components/AddUserModal/AddUserModal';

export const baseURL = 'http://localhost:3000'


const App = () => {
  const [searchUserInput, setSearchUserInput] = useState('')
  const [searchUser, setSearchUser] = useState([])
  const [loading, setLoading] = useState(false)

  const searchUserHandler = (e) => {
    e.preventDefault()
    if (!searchUserInput) return setSearchUser([])
    setLoading(true)
    fetch(`${baseURL}/chatList/search/${searchUserInput}`, {
      headers: {
        'Authorization': `${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        setSearchUser(data?.userList)
        // setSearchUser(data)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }

  const chatData = [
    {
      _id: '1',
      name: 'John Doe',
      message: 'Hello',
      time: '12:00',
      image: 'https://i.ibb.co/F3kXkV0/IMG-20221108-135157.jpg'
    },
    {
      _id: '2',
      name: 'John Doe',
      message: 'Hello',
      time: '12:00',
      image: 'https://i.ibb.co/F3kXkV0/IMG-20221108-135157.jpg'
    },
    {
      _id: '3',
      name: 'John Doe',
      message: 'Hello',
      time: '12:00',
      image: 'https://i.ibb.co/F3kXkV0/IMG-20221108-135157.jpg'
    },
    {
      _id: '4',
      name: 'John Doe',
      message: 'Hello',
      time: '12:00',
      image: 'https://i.ibb.co/F3kXkV0/IMG-20221108-135157.jpg'
    },


  ]
  return (
    <div className='h-screen overflow-hidden overflow-y-auto flex'>

      <div className='w-[380px]  overflow-y-auto h-full hidden lg:block border-e py-5'>
        <div className='flex justify-between items-center px-4 py-3 border-b mb-1'>
          <h1 className='text-2xl font-semibold'>Chats</h1>
          <div className='flex items-center gap-4'>
            <IoPersonAddSharp
              onClick={() => window.add_user_modal.showModal()}
              className='text-xl cursor-pointer'>
            </IoPersonAddSharp>
            <HiUserGroup className='text-2xl'></HiUserGroup>
            <img className='h-10 w-10 rounded-full' src="https://i.ibb.co/F3kXkV0/IMG-20221108-135157.jpg" alt="" />
          </div>
        </div>
        <div className='px-5 mb-4 py-2'>
          <div className=' flex items-center gap-2 border-green-500 border-b px-4'>
            <input type="text" placeholder='search by name' name="chatlistname" className='w-full   focus:outline-none px-2 py-1' id="" />
            <FaSearch></FaSearch>
          </div>
        </div>
        {chatData.map((c) => <ChatList key={c._id} c={c}></ChatList>)}
      </div>


      <div className='h-full flex-grow bg-slate-100 overflow-x-auto'>
        <Outlet></Outlet>
      </div>



      <AddUserModal
        searchUserHandler={searchUserHandler}
        searchUser={searchUser}
        loading={loading}
        setSearchUser={setSearchUser}
        searchUserInput={searchUserInput}
        setSearchUserInput={setSearchUserInput}

      ></AddUserModal>

    </div>
  );
};

export default App;