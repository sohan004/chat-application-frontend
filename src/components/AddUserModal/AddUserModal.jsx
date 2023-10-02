import { AiFillCloseSquare } from "react-icons/ai";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { baseURL } from "../../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUserModal = () => {
    const [searchUserInput, setSearchUserInput] = useState('')
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const navigate = useNavigate()

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


    const newChatListCreate = (d) => {
        setLoading2(true)
        fetch(`${baseURL}/chatList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                participent: [d?._id],
                chatType: 'private'
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.success) {
                    setLoading2(false)
                    console.log(data)
                    setSearchUser([])
                    setSearchUserInput('')
                    navigate(`/chat/${data?.chatInfo?._id}`)
                    window.add_user_modal.close()
                }
                else{
                    setLoading2(false)
                    console.log(data)
                }
            })
            .catch(err => {
                setLoading2(false)
                console.log(err)
            })
    }

    return (
        <>
            <dialog id="add_user_modal" className="modal px-4">
                <div className="modal-box w-full bg-white overflow-y-auto max-w-3xl rounded-none relative ">
                    {loading2 && <p className="absolute top-2 left-2/4 -translate-x-2/4 rounded-md animate-pulse bg-black text-white p-3 py-1">Please wait...</p>}
                    <AiFillCloseSquare
                        onClick={() => {
                            setSearchUser([])
                            setSearchUserInput('')
                            window.add_user_modal.close()
                        }}
                        className='absolute cursor-pointer top-0 right-0 text-4xl'>
                    </AiFillCloseSquare>
                    <form onSubmit={searchUserHandler} className=' mb-4 py-2 mt-7'>
                        <div className=' flex items-center gap-2 border-green-500 border-b'>
                            <input
                                onChange={e => setSearchUserInput(e.target.value)}
                                value={searchUserInput}
                                type="text"
                                placeholder='search by email or username'
                                name="chatlistname"
                                className='w-full  bg-white focus:outline-none  py-1 px-5'
                                id="" />
                            {!loading && <FaSearch onClick={searchUserHandler} className='bg-green-500 hover:bg-green-700 p-2 cursor-pointer text-5xl  text-white btn'></FaSearch>}
                            {loading && <span className='bg-green-500 hover:bg-green-700'><FaSpinner className=' p-2 animate-spin text-5xl  text-white'></FaSpinner></span>}
                        </div>
                    </form>

                    {!loading && <div>
                        {searchUser.length > 0 ?
                            <div>
                                {searchUser.map((user, index) => (
                                    <div
                                        onClick={() => newChatListCreate(user)}
                                        key={index}
                                        className='flex items-center gap-4 border-b py-2 px-4 cursor-pointer bg-gray-100 hover:bg-gray-200'
                                    >
                                        <img className='h-16 w-16 ' src={baseURL + '/uploads/' + user?.profileImg} alt="" />
                                        <div>
                                            <h1 className='text-lg font-medium'>{user?.name}</h1>
                                            <p className='text-sm text-gray-500'>{user?.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            : <h1 className='text-lg text-center font-medium '>No user found!!</h1>}
                    </div>}
                </div>
            </dialog>
        </>
    );
};

export default AddUserModal;