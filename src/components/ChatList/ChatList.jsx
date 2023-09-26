import { NavLink } from "react-router-dom";

const ChatList = ({ c }) => {
    return (
        <NavLink to={`/chat/${c._id}`} className={({ isActive }) => `flex px-5 py-5 hover:bg-gray-200 duration-150 transform shadow-sm justify-between items-start ${isActive && 'bg-gray-200'}`}>
            <div className="flex items-start gap-3">
                <div className="relative">
                    <img src={c.image} className="h-12 w-12 rounded-full" alt="" />
                    <p className="h-3 absolute bottom-0 right-0 w-3 bg-green-500 border rounded-full"></p>
                </div>
                <div>
                    <p className="font-medium text-lg">sohan</p>
                    <p className="text-sm opacity-90"><span>Lorem ipsum dolor sit ggrg g</span></p>
                </div>
            </div>
            <p className="text-xs">1 minute ago</p>
        </NavLink>
    );
};

export default ChatList;