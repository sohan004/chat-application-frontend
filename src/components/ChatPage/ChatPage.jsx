import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { HiOutlineLink } from 'react-icons/hi';


const ChatPage = () => {
    const [text, setText] = useState('')

    const emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹', '😊', '😇', '🙂',
        '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪',
        '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁',
        '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😮‍💨', '😤', '😠', '😡', '🤬', '🤯',
        '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣', '🤗', '🫡', '🤔', '🫢', '🤭',
        '🤫', '🤥', '😶', '😶‍🌫️', '😐', '😑', '😬', '🫠', '🙄', '😯', '😦', '😧', '😮',
        '😲', '🥱', '😴', '🤤', '😪', '😵', '😵‍💫', '🫥', '🤐', '🥴', '🤢', '🤮', '🤧',
        '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️',
        '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
    ];


    return (
        <div className="h-screen flex flex-col w-full overflow-x-auto">
            <div className="lg:px-10 px-5 py-4 bg-white border-b flex items-center gap-4">
                <img className='h-11 w-11 rounded-full' src="https://i.ibb.co/F3kXkV0/IMG-20221108-135157.jpg" alt="" />
                <h1 className="text-xl font-medium">Sohan</h1>
            </div>

            <div className="flex-grow px-5 w-full h-full overflow-x-auto lg:px-10 py-3 overflow-y-auto flex flex-col ">


                <div className='flex  items-start justify-start gap-2 w-full mb-3'>
                    <img className='h-8 w-8 rounded-full' src="https://i.ibb.co/F3kXkV0/IMG-20221108-135157.jpg" alt="" />
                    <div className='bg-blue-500  max-w-[300px] flex-grow md:max-w-[500px] rounded-e-xl rounded-ss-xl px-4 py-2 text-white'>
                        <p className='whitespace-pre-wrap'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, a.</p>
                        <p className='text-xs opacity-90 text-right mt-2'>1 minute ago</p>
                    </div>
                </div>

                <div className='flex items-start justify-end gap-2 w-full mb-3'>
                    <div className='bg-gray-300 max-w-[300px] flex-grow md:max-w-[500px] rounded-tr-xl rounded-s-xl px-4 py-2 text-black'>
                        <p className=' whitespace-pre-wrap '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, a.</p>
                        <p className='text-xs opacity-90 text-right mt-2'>1 minute ago</p>
                    </div>
                </div>


            </div>

            <div className="bg-white border-t py-5 px-5 gap-4 flex items-center">

                <div className="dropdown dropdown-top">
                    <BsEmojiSmile tabIndex={0} className='text-xl cursor-pointer'></BsEmojiSmile>

                    <div tabIndex={0} className="dropdown-content z-[1]  menu  shadow bg-base-100 w-[300px] p-2 h-[400px] ">
                        <div className='overflow-hidden user-select-none emoji-picker overflow-y-auto flex flex-wrap gap-3 '>
                            {emojis.map((emoji, index) => (
                                <span
                                    key={index}
                                    className={`cursor-pointer text-2xl `}
                                    onClick={() => setText(prev => text + emoji)}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <HiOutlineLink className='text-xl'></HiOutlineLink>
                <textarea
                    onChange={e => setText(e.target.value)}
                    value={text}
                    name=""
                    className="flex-grow focus:outline-none "
                    placeholder='Type a message...'
                    rows={1}
                ></textarea>
            </div>

        </div>
    );
};

export default ChatPage;