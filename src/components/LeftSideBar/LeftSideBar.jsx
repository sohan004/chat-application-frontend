import { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { IoPersonAddSharp } from "react-icons/io5";
import { MainContext } from "../Auth/AuthContext";
import ChatList from "../ChatList/ChatList";

const LeftSideBar = () => {

    const {
        user,
        setUser,
        load,
        setLoad,
        chatList,
        setChatList,
        chatListLoad,
        setChatListLoad
    } = useContext(MainContext)

    return (
        <>
            <div className=' w-full md:w-[380px]   overflow-y-auto h-full  border-e py-5'>
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
                        <input type="text" placeholder='search by name' name="chatlistname" className='w-full  bg-transparent focus:outline-none px-2 py-1' id="" />
                        <FaSearch></FaSearch>
                    </div>
                </div>
                {chatList.map((c) => <ChatList key={c._id} c={c}></ChatList>)}
            </div>
        </>
    );
};

export default LeftSideBar;