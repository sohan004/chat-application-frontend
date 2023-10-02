import EmojiPicker from 'emoji-picker-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { HiOutlineLink } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../App';
import { MainContext } from '../Auth/AuthContext';
import moment from 'moment';
import ScrollToBottom from 'react-scroll-to-bottom';
import sound from '../../assets/audio/out-of-nowhere-message-tone.mp3';
import { PiChecks } from 'react-icons/pi';
import Lottie from 'react-lottie';
import typingAnimation from '../../components/LottieAnimation/TypingAnimation.json';
import ChatList from '../ChatList/ChatList';
import Wrap from '../Wrap/Wrap';


const ChatPage = () => {
    const [text, setText] = useState('')
    const id = useParams().id;
    const [chatInfo, setChatInfo] = useState({})
    const [chatData, setChatData] = useState([])
    const [chatLoad, setChatLoad] = useState(true)
    const navigate = useNavigate();
    const [loadMore, setLoadMore] = useState(false)
    const { user, socket, chatList, setChatList } = useContext(MainContext)
    const oponent = chatInfo?.createUserDetails?._id == user?._id ? chatInfo?.participentDetails[0] : chatInfo?.createUserDetails;
    const [typing, setTyping] = useState(false);
    const [typingTf, setTypingTf] = useState(false)
    const inputref = useRef(null)

    useEffect(() => {
        inputref.current.focus()
    }, [id])



    // new chat create
    useEffect(() => {
        socket.on('newChatAdd', async (change) => {

            if (change.chatInfo.chatId == id) {
                setText('');
                // console.log(change.chatInfo);
                setChatData(prev => [...prev, change.chatInfo]);

                if (change.chatInfo.sender == user?._id) setTypingTf(false)

                if (change.chatInfo.sender != user?._id) {

                    setTyping(false);
                    const audio = new Audio(sound).play()
                    socket.emit('seenByOn', { chatId: id, seenByUser: user?._id, senMessageId: [change.chatInfo._id] })

                    fetch(`${baseURL}/chat/seenBy`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            unSeenId: [change.chatInfo._id]
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                        })
                }
            }

        });
        return () => {
            socket.off('newChatAdd');
        };
    }, [id, chatList]);

    // console.log(user?._id);

    // catch seenBy
    useEffect(() => {
        socket.on('seenBy', async (change) => {
            if (change?.chatId == id) {
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

                console.log(change?.senMessageId);
                setChatData(prev => prev.map(c => {
                    const seen = change?.senMessageId.find(s => s == c._id)
                    if (seen) {
                        c.seenBy = [...c.seenBy, change.seenByUser]
                        return c
                    }
                    else {
                        return c
                    }
                }))
            }

        });
        return () => {
            socket.off('seenBy');
        };
    }, [id, chatList]);


    useEffect(() => {
        if (chatData.length === 0) return
        const findUnSeenChat = chatData?.filter(c => {
            const chk = c.seenBy?.find(s => s == user?._id)
            if (chk) return
            else return c._id
        })
        const onlyId = findUnSeenChat?.map(c => c._id)
        // console.log(onlyId);
        if (onlyId.length > 0) {
            socket.emit('seenByOn', { chatId: id, seenByUser: user?._id, senMessageId: onlyId })
            fetch(`${baseURL}/chat/seenBy`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    unSeenId: onlyId
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                })
        }

    }, [chatData])

    useEffect(() => {
        setChatLoad(true);
        fetch(`${baseURL}/chatList/chat/${id}?skip=0`, { headers: { 'Authorization': `${localStorage.getItem('token')}` } })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.success) {
                    // console.log(data);
                    setChatInfo(data);
                    setChatData(data.chat);
                    setChatLoad(false);
                    if (data.chat.length >= 15) {
                        setLoadMore(true)
                    }
                    else {
                        setLoadMore(false)
                    }
                }
                else {
                    setChatInfo({});
                    setChatData([]);
                    setChatLoad(false);
                    navigate('/');
                }
            })
            .catch(err => {
                navigate('/');
                setChatInfo({});
                setChatData([]);
                setChatLoad(false);
            })
    }, [id])

    useEffect(() => {
        socket.on('typing_start', async (change) => {
            console.log(id);
            if (change.chatId == id && change.action != user?._id) {
                setTyping(true);
            }

        });
        return () => {
            socket.off('typing_start');
        };
    }, [id])
    useEffect(() => {
        socket.on('typing_end', async (change) => {
            if (change.chatId == id && change.action != user?._id) {
                setTyping(false);
            }

        });
        return () => {
            socket.off('typing_start');
        };
    }, [id])

    // console.log(chatLoad);

    const createChat = (e) => {
        if (!user) return
        e.preventDefault();
        if (!text) return;
        const text2 = text
        setText('');
        fetch(`${baseURL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                chatId: id,
                message: text2,
                reciver: oponent?._id,
                type: 'text'
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                // if (data.success) {
                //     console.log(data);
                //     setText('');
                // }
                // else {
                //     console.log(data);
                // }
            })
            .catch(err => {
                navigate('/');
            })
    }

    const loadMoreChat = () => {
        fetch(`${baseURL}/chatList/chat/${id}?skip=${chatData.length}`,
            {
                headers:
                    { 'Authorization': `${localStorage.getItem('token')}` }
            })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                if (data.success) {
                    console.log(data);
                    setChatInfo(data);
                    setChatData(prev => [...data.chat, ...prev]);
                    setChatLoad(false);
                    if (data.chat.length >= 15) {
                        setLoadMore(true)
                    }
                    else {
                        setLoadMore(false)
                    }
                }
                else {
                    setChatInfo({});
                    setChatData([]);
                    setChatLoad(false);
                    navigate('/');
                }
            })
            .catch(err => {
                navigate('/');
                setChatInfo({});
                setChatData([]);
                setChatLoad(false);
            })
    }



    const typingHandler = (e) => {
        if (e.target.value == '') return socket.emit('typingOf', { chatId: id, action: user?._id })

        if (!typingTf) {
            setTypingTf(true)
            socket.emit('typingOn', { chatId: id, action: user?._id })


            var timerLength = 4000;
            setTimeout(() => {
                socket.emit('typingOf', { chatId: id, action: user?._id })
                setTypingTf(false)

            }, timerLength);
        }

    };

    // const debug = chatData[chatData?.length - 1]?.seenBy?.find(f => f == oponent?._id && 'text-green-600')

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

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: typingAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };


    return (
        <div className="h-screen flex flex-col w-full overflow-x-auto">
            <div className="lg:px-10 px-5 py-4 bg-white border-b flex items-center gap-4">
                <img className='h-11 w-11 rounded-full' src={baseURL + '/uploads/' + oponent?.profileImg} alt="" />
                <h1 className="text-xl font-medium">{oponent?.name}</h1>
            </div>

            <ScrollToBottom
                className="flex-grow  px-5 max-w-6xl mx-auto w-full h-full overflow-x-hidden lg:px-10 py-3 overflow-y-auto flex flex-col  ">


                <div className='md:hidden'>
                    <Wrap></Wrap>
                </div>


                {loadMore && <div className='text-center'>
                    <button onClick={loadMoreChat} className="btn btn-sm btn-primary">Load more</button>
                </div>}



                {chatData.map((c, index) => c.sender == user._id ?

                    <div key={c._id} className='flex items-end flex-col justify-start  w-full mb-4'>
                        <div>
                            <p className=' whitespace-pre-wrap bg-gray-300 max-w-[300px]  md:max-w-[500px] rounded-tr-xl rounded-s-xl px-4 py-2 text-black'>{c?.message}</p>
                            <p className='text-xs opacity-90 text-right mt-1'>{moment(c.createdAt).fromNow()}</p>
                        </div>
                        {/* <p className={`text-right ${chatData?.length == 0 && 'hidden'} ${c?.seenBy.find(s => s == oponent?._id) ? 'text-green-600 hidden' : ''}`}>hello</p> */}
                        <PiChecks className={`text-right ${chatData?.length == 0 && 'hidden'} ${c?.seenBy.find(s => s == oponent?._id) ? 'text-green-600 hidden' : ''}`}></PiChecks>

                    </div> :

                    <div key={c._id} className='flex  items-start justify-start gap-2 w-full mb-4'>
                        {/* <img className='h-8 w-8 rounded-full' src={baseURL + '/uploads/' + oponent?.profileImg} alt="" /> */}
                        <div>
                            <p className='whitespace-pre-wrap bg-gradient-to-r from-cyan-500 to-blue-500  max-w-[300px]  md:max-w-[500px] rounded-e-xl rounded-ss-xl px-4 py-2 text-white'>{c?.message}</p>
                            <p className='text-xs opacity-90 text-right mt-1'>{moment(c.createdAt).fromNow()}</p>
                        </div>

                    </div>
                )}
                {chatData[chatData.length - 1]?.seenBy?.find(s => s == oponent?._id) && <PiChecks className={`text-right text-green-600 ms-auto text-xl -mt-1 ${chatData[chatData.length - 1].sender != user?._id && 'hidden'}`}></PiChecks>}

                {/* <div className='flex  items-start justify-start gap-2 w-full mb-3'>
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
                </div> */}

                {typing && <div className='flex items-center gap-1 mt-6 '>
                    <img className='h-8 w-8 rounded-full' src={baseURL + '/uploads/' + oponent?.profileImg} alt="" />
                    <div className='bg-gray-200 rounded-e-xl rounded-ss-xl' >
                        <Lottie
                            options={defaultOptions}
                            height={35}
                            width={70}
                            style={{ margin: '0 0 0 0' }}
                            className={` ml-0`}
                        ></Lottie>
                    </div>
                </div>}




            </ScrollToBottom>

            <form onSubmit={createChat} className="bg-white border-t py-5 px-5 gap-4 flex items-center">

                <div className="dropdown dropdown-top">
                    <BsEmojiSmile tabIndex={0} className='text-xl cursor-pointer'></BsEmojiSmile>

                    <div tabIndex={0} className="dropdown-content z-[1]  menu  shadow bg-base-100 w-[300px] p-2 h-[400px] ">
                        <div className='overflow-hidden user-select-none emoji-picker overflow-y-auto flex flex-wrap gap-3 '>
                            {emojis.map((emoji, index) => (
                                <span
                                    key={index}
                                    className={`cursor-pointer text-2xl `}
                                    onClick={() => setText(prev => prev + emoji)}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <HiOutlineLink className='text-xl'></HiOutlineLink>
                <textarea
                    ref={inputref}
                    onKeyDown={(e) => {
                        typingHandler(e);
                        if (e.key === 'Enter' && !e.shiftKey) {
                            createChat(e);
                        }
                    }}
                    onChange={e => setText(e.target.value)}
                    value={text}
                    className="flex-grow focus:outline-none bg-transparent md:py-2"
                    placeholder='Type a message...' type="text" name="message"
                    rows={1}
                ></textarea>
                {/* <input onChange={e => setText(e.target.value)}
                    id="" /> */}
            </form>

        </div>
    );
};

export default ChatPage;