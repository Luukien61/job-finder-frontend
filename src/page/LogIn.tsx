import React, {useEffect, useState} from 'react';
import {MdOutlineMail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import {googleExchange} from "@/page/GoogleCode.tsx";
import {ToastContainer} from "react-toastify";
import {AppLogo} from "@/info/AppInfo.ts";

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user) navigate("/")
    }, []);
    const handleSignup = () => {

    }
    const handleForwardSignup = () => {
        navigate("/signup",{replace: false});
    }
    const googleLogin = () => {
        localStorage.setItem('action', 'login')
        googleExchange()
    };
    return (
        <div className={`flex justify-center rounded min-h-screen  bg-bg_default`}>
            <div className={`custom-container mt-2 flex justify-center `}>
                <div className={`w-2/3 rounded bg-white my-auto drop-shadow `}>
                    <div className={`flex flex-col gap-y-2 justify-center items-center pb-3`}>
                        <div className={`w-3/4 flex-col my-4`}>
                            <div className={`flex justify-center`}>
                                <img className={`w-28`} src={AppLogo} alt={`logo`}/>
                            </div>

                            {/*email and phone*/}
                            <div className={`my-4`}>
                                <div>
                                    <p>Email</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 `}>
                                    <MdOutlineMail color={`green`}/>
                                    <input
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                        placeholder="Email"
                                        spellCheck={false}
                                        className={`outline-none text-black max-w-[90%] flex-1 pl-4`}
                                    />
                                </div>
                            </div>
                            {/*password*/}
                            <div className={`my-4`}>
                                <div>
                                    <p>Mật khẩu</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                    <RiLockPasswordLine color={`green`}/>
                                    <input
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        type={`password`}
                                        placeholder="Mật khẩu"
                                        spellCheck={false}
                                        className={`outline-none text-black flex-1`}
                                    />
                                </div>
                            </div>
                            {/*Signup button*/}
                            <div className={`mt-8 drop-shadow-2xl`}>
                                <button
                                    onClick={handleSignup}
                                    type={`button`}
                                    className={`w-full rounded hover:bg-gray-800 text-white bg-primary py-2`}>
                                    Đăng nhập
                                </button>
                            </div>
                            <div className={`flex justify-center my-4`}>
                                <p className={`hover:underline text-[16px] cursor-pointer text-blue-400`}>Quên mật khẩu?</p>
                            </div>
                            <div className={`flex justify-center my-4`}>
                                <p className={`text-gray-500`}><i>hoặc</i></p>
                            </div>
                            {/*Signup with Google*/}
                            <div className={`flex items-center justify-center`}>
                                <button
                                    onClick={googleLogin}
                                    type={`button`}
                                    className=" flex  gap-x-3 items-center rounded-2xl bg-gray-100 p-2 hover:bg-gray-200">
                                    <img className={`w-6`} src="/public/google.png" alt={`Google Signup`}/>
                                    Đăng nhập với Google
                                </button>
                            </div>
                            <div className={`flex items-center justify-center my-4 gap-x-1`}>
                                <p className={`text-[14px] text-gray-700`}>Chưa có tài khoản? </p>
                                <p onClick={handleForwardSignup}
                                   className={`text-[14px] text-green-400 cursor-pointer hover:underline`}>Đăng ký</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
            />
        </div>
    );
};

export default LogIn;