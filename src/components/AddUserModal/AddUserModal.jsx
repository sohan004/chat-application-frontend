import { AiFillCloseSquare } from "react-icons/ai";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { baseURL } from "../../App";

const AddUserModal = ({
    searchUserHandler,
    searchUser,
    setSearchUser,
    loading,
    searchUserInput,
    setSearchUserInput, }) => {
    return (
        <>
            <dialog id="add_user_modal" className="modal">
                <div className="modal-box w-full overflow-y-auto max-w-3xl rounded-none relative">
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
                                className='w-full   focus:outline-none  py-1 px-5'
                                id="" />
                            {!loading && <FaSearch onClick={searchUserHandler} className='bg-green-500 p-2 cursor-pointer text-5xl  text-white btn'></FaSearch>}
                            {loading && <span className='bg-green-500'><FaSpinner className=' p-2 animate-spin text-5xl  text-white'></FaSpinner></span>}
                        </div>
                    </form>

                    {!loading && <div>
                        {searchUser.length > 0 ?
                            <div>
                                {searchUser.map((user, index) => (
                                    <div
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