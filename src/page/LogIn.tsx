import React, {useState} from 'react';
import {MdOutlineMail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSignup = () => {

    }
    const handleForwardSignup = () => {
        navigate("/signup",{replace: false});
    }
    const googleLogin = () => {
        const clientId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri: string = import.meta.env.VITE_GOOGLE_REDIRECT_URL;
        const scope: string = import.meta.env.VITE_GOOGLE_SCOPE;
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    };
    return (
        <div className={`flex justify-center rounded  min-h-screen bg-bg_default`}>
            <div className={`custom-container mt-2 flex justify-center `}>
                <div className={`w-2/3 rounded bg-white drop-shadow `}>
                    <div className={`flex flex-col gap-y-2 justify-center items-center pb-3`}>
                        <div className={`w-3/4 flex-col my-4`}>
                            <div className={`flex justify-center`}>
                                <img className={`w-32`} src={"/public/job-finder.png"} alt={`logo`}/>
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
                                    <p>Password</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                    <RiLockPasswordLine color={`green`}/>
                                    <input
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        type={`password`}
                                        placeholder="Password"
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
                                    Log in
                                </button>
                            </div>
                            <div className={`flex justify-center my-4`}>
                                <p className={`hover:underline text-[16px] cursor-pointer text-blue-400`}>Forgotten password?</p>
                            </div>
                            <div className={`flex justify-center my-4`}>
                                <p className={`text-gray-500`}><i>or</i></p>
                            </div>
                            {/*Signup with Google*/}
                            <div className={`flex items-center justify-center`}>
                                <button
                                    onClick={googleLogin}
                                    type={`button`}
                                    className=" flex  gap-x-3 items-center rounded-2xl bg-gray-100 p-2 hover:bg-gray-200">
                                    <img className={`w-6`} src="/public/google.png" alt={`Google Signup`}/>
                                    Log in with Google
                                </button>
                            </div>
                            <div className={`flex items-center justify-center my-4 gap-x-1`}>
                                <p className={`text-[14px] text-gray-700`}>Dont have an account? </p>
                                <p onClick={handleForwardSignup}
                                   className={`text-[14px] text-green-400 cursor-pointer hover:underline`}>Sign up</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;