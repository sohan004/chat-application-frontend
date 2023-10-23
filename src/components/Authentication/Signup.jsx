import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaSpinner, FaWindowClose } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { baseURL } from '../../App';
import Swal from 'sweetalert2';
import OTPInput, { ResendOTP } from "otp-input-react";


const Signup = () => {
    const [passState, setPassState] = useState('password');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [err, setErr] = useState('');

    const [otpToken, setOtpToken] = useState('');

    const otpRequest = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (!name || !email || !password || !image) {
            setError('Please fill all the fields');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('jsonData', JSON.stringify({ name, email, password }));


        fetch(`${baseURL}/account/otpRequest`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLoading(false);
                    setError('');
                    setErr('');
                    setOtp('');
                    setOtpToken(data?.token);
                    window.otp_modal.showModal();
                }
                else {
                    setError(data.message);
                    setLoading(false);
                    setOtpToken('');
                }
            })
            .catch(err => {
                setError('Something went wrong');
                setLoading(false);
                setOtpToken('');
            })
    };


    const handle = (e) => {
        if (otp.length < 4) {
            return setErr('Please enter 4 digit otp')
        }

        setErr('');
        setLoading(true);

        fetch(`${baseURL}/account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp, otpToken })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLoading(false);
                if (data.success) {
                    setErr('');
                    window.otp_modal.close();
                    Swal.fire(
                        'Registere Successfully!',
                        'You can login now',
                        'success'
                    )
                    navigate('/login');
                    // window.location.href = '/login';
                }
                else {
                    setErr(data.message);
                    setLoading(false);
                }
            })

    }
    return (
        <div>
            <div className="lg:flex lg:flex-row-reverse">
                <div className="lg:w-1/2 xl:max-w-screen-sm lg:flex lg:justify-center lg:items-center">

                    <div className="mt-10 lg:mt-0 px-12 sm:px-24 md:px-48 lg:px-12  xl:px-24 xl:max-w-2xl w-full">
                        <h2 className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">Sign up</h2>
                        <div className="mt-12">
                            {error && <p className='text-red-500  my-4 text-lg'>{error}</p>}
                            <form onSubmit={otpRequest}>
                                <div>
                                    <div className="text-sm font-bold text-gray-700 tracking-wide">Full Name</div>
                                    <input
                                        onChange={e => setName(e.target.value)}
                                        value={name}
                                        className="w-full bg-transparent text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                        type="text"
                                        placeholder="Jhon Doe"
                                    />
                                </div>
                                <div className='mt-8'>
                                    <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                                    <input
                                        onChange={e => setEmail(e.target.value)}
                                        value={email}
                                        className="w-full bg-transparent text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                        type="text"
                                        placeholder="mike@gmail.com"
                                    />
                                </div>
                                <div className='mt-8'>
                                    <div className="text-sm font-bold text-gray-700 tracking-wide">Profile Image</div>
                                    <input onChange={e => setImage(e.target.files[0])} type="file" className="file-input file-input-bordered w-full mt-2 max-w-xs bg-transparent" />
                                </div>
                                <div className="mt-8 relative">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm font-bold text-gray-700 tracking-wide">Password</div>
                                    </div>
                                    <input
                                        onChange={e => setPassword(e.target.value)}
                                        value={password}
                                        className="w-full text-lg py-2 bg-transparent pe-10 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                        type={passState}
                                        placeholder="Enter your password"
                                    />
                                    {passState == 'password' ? <FaEyeSlash onClick={() => setPassState('text')} className='absolute right-2  top-8 cursor-pointer opacity-60 text-xl'></FaEyeSlash> : <FaEye onClick={() => setPassState('password')} className='absolute right-2  top-8 cursor-pointer opacity-60 text-xl'></FaEye>}
                                </div>

                                <div className="mt-10">
                                    <button
                                        disabled={loading}
                                        className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg flex justify-center items-center gap-2"
                                        type="submit"
                                    >
                                        {loading && <FaSpinner className='text-lg animate-spin'></FaSpinner>}
                                        Sign Up
                                    </button>
                                </div>
                            </form>
                            <div className="mt-6 text-sm font-display font-semibold text-gray-700 text-center">
                                Already have an account? <Link to='/login' className="cursor-pointer text-indigo-600 hover:text-indigo-800">Sign in</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex items-center  justify-center  flex-1 h-screen">
                    <div className=" transform duration-200  cursor-pointer">
                        <img src={'https://media.tenor.com/p0G_bmA2vSYAAAAd/login.gif'} className='w-full' alt="" />
                    </div>
                </div>
            </div>


            <dialog id="otp_modal" className="modal">
                <div method="dialog" className="modal-box max-w-[640px] bg-white p-0 rounded-3xl relative text-[#100A55] ">
                    <FaWindowClose onClick={() => window.otp_modal.close()} className='absolute text-[#100A55]  top-4 text-3xl cursor-pointer left-4'></FaWindowClose>
                    <h1 className="text-2xl mt-7 text-center text-[#100A55] lg:text-4xl">Enter Code</h1>
                    <p className='text-center font-medium my-4 text-red-500'>{err}</p>
                    <div className="p-6 mb-7   lg:mb-5">
                        <div className=' max-w-[500px] mx-auto text-center '>
                            <div>
                                <OTPInput
                                    inputClassName='border-2 text-black bg-white rounded py-6 border-[#100A55] focus:outline-none flex-grow'
                                    className="text-center flex justify-center w-full max-w-[300px] mx-auto"
                                    value={otp} onChange={e => {
                                        // verifyOtp(e)
                                        setOtp(e)

                                    }}
                                    autoFocus OTPLength={4}
                                    otpType="number"
                                // disabled={verifyStatus}
                                />
                                <div>
                                    <button
                                        disabled={loading}
                                        onClick={handle}
                                        className="btn mt-5 text-white hover:bg-blue-900 bg-blue-600 border-0">Send Otp</button>
                                </div>
                            </div> </div>
                    </div>

                </div>
            </dialog>
        </div>
    );
};

export default Signup;