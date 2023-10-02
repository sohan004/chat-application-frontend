import { NavLink } from "react-router-dom";
import { MainContext } from "../Auth/AuthContext";
import { useContext } from "react";
import { baseURL } from "../../App";
import moment from "moment/moment";

const ChatList = ({ c }) => {
    const { user } = useContext(MainContext)

    console.log(c);

    // console.log(c);

    const findChatUser = c?.createUser?._id == user?._id ? c?.participent[0] : c?.createUser
    const lastMessage = c?.lastMessage?.seenBy?.find(s => s == user?._id)
    console.log(lastMessage);

    return (
        <NavLink to={`/chat/${c._id}`} className={({ isActive }) => `flex px-5 py-5 hover:bg-gray-200 duration-150 transform shadow-sm justify-between relative items-start ${isActive && 'bg-gray-200'}`}>
            <div className="flex items-start gap-3">
                <div className="relative">
                    <img src={baseURL + '/uploads/' + findChatUser?.profileImg} className="h-12 w-12 rounded-full" alt="" />
                    {findChatUser?.activeStatus && <p className="h-3 absolute bottom-0 right-0 w-3 bg-green-500 border rounded-full"></p>}
                </div>
                <div>
                    <p className="font-medium text-lg">{findChatUser?.name}</p>
                    <p className={`text-sm opacity-90 ${!lastMessage && 'font-bold'}`}><span>{c?.lastMessage ? c?.lastMessage?.message.slice(0, 20) + '...' : 'click to send message'}</span></p>
                </div>
            </div>
            <p className={`text-xs ${!lastMessage && 'font-bold'}`}>{moment(c.updatedAt).fromNow()}</p>

            {!lastMessage && <p className="h-2 w-2 bg-green-500 rounded-full absolute right-4 top-2/4 -translate-y-2/4"></p>}

        </NavLink>
    );
};

export default ChatList;