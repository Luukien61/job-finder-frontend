import React, {useEffect, useRef, useState} from 'react';
import {MdOutlineMail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import {UserCreationState} from "@/zustand/AppState.ts";
import {googleExchange} from "@/page/GoogleCode.tsx";
import {toast, ToastContainer} from "react-toastify";
import {getSignupCode, signUpUser} from "@/axios/Request.ts";
import {AppLogo} from "@/info/AppInfo.ts";
import {LuQrCode} from "react-icons/lu";
import {Input} from "antd";
import {IoIosCloseCircle} from "react-icons/io";

export type UserSignupResponse = {
    id: string,
    email: string,
    avatar: string,
    name?: string,
}

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePass, setRetypePass] = useState('');
    const navigate = useNavigate();
    const [timer, setTimer] = useState<number>(60)
    const [expired, setExpired] = useState<boolean>(false)
    const [userCode, setUserCode] = useState<string>('')
    const [verificationCode, setVerificationCode] = useState<string>('')
    const [, setIsDone] = useState<boolean>(false)
    const [sendCode, setSendCode] = useState<boolean>(false)
    // eslint-disable-next-line no-undef
    const intervalTimer = useRef<NodeJS.Timeout | null>(null)
    const [userSignUp, setUserSignUp] = useState<any>()
    const {setUser} = UserCreationState()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) navigate("/")
    }, []);

    const handleSignup = async () => {
        if (email && password && retypePass) {
            if (password === retypePass) {
                const userCreationRequest = {
                    password: password,
                    email: email,
                }
                try {
                    const code = await getSignupCode({to: email, useCase: "Tạo tài khoản"})
                    console.log("Code: " + code)
                    setVerificationCode(code)
                    setUserSignUp(userCreationRequest)
                    setSendCode(true)
                    intervalTimer.current = setInterval(() => {
                        setTimer((prev) => prev - 1)
                    }, 1000)
                } catch (err) {
                    toast.error(err.response.data);
                }

            } else {
                toast.error("Please enter your password");
            }
        } else {
            toast.error("Please enter require fields");
        }
    }
    useEffect(() => {
        if (timer === 0 && intervalTimer.current) {
            setExpired(true)
            clearInterval(intervalTimer.current)
            intervalTimer.current = null
            setTimer(60)
            setSendCode(false)
        }
    }, [timer])

    const handleVerifyCode = async () => {
        if (userCode.length === 6 && !expired) {
            if (userCode == verificationCode && !expired) {
                setTimeout(() => setIsDone(true), 1000)
                if (userSignUp) {
                    const response: UserSignupResponse = await signUpUser(userSignUp)
                    localStorage.setItem('user', JSON.stringify(response))
                    setUser(response)
                    navigate('/profile/complete')
                }
            } else {
                toast.error('The verification code is incorrect', {
                    hideProgressBar: true,
                    autoClose: 1000
                })
            }
        } else {
            toast.error('Either verification code or expired', {hideProgressBar: true, autoClose: 1000})
        }
    }


    const handleSignupWithGoogle = () => {
        localStorage.setItem("action", "signup")
        googleExchange()
    }
    const handleForwardLogin = () => {
        navigate("/login", {replace: false});
    }


    const closeModal = () => {
        setSendCode(false)
        setIsDone(false)
        setUserSignUp(undefined)
        setVerificationCode(undefined)
        clearInterval(intervalTimer.current)
        intervalTimer.current = null
        setExpired(false)
        setUserCode('')
        setTimer(60)
    }

    return (
        <div className={`flex justify-center rounded min-h-screen`}>
            <div className={`custom-container mt-2 flex justify-center `}>
                <div className={`w-2/3 rounded bg-white my-auto drop-shadow `}>
                    <div className={`flex flex-col gap-y-2 justify-center items-center pb-3`}>
                        <div className={`w-3/4 flex-col my-4`}>
                            <div className={`flex justify-center`}>
                                <img className={`w-28`} src={AppLogo} alt={`logo`}/>
                            </div>
                            {/*name*/}
                            {/*email and phone*/}
                            <div className={`flex my-4`}>
                                <div className={`w-full`}>
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
                            {/*retype password*/}
                            <div>
                                <div>
                                    <p>Xác nhận mật khẩu</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                    <RiLockPasswordLine color={`green`}/>
                                    <input
                                        value={retypePass}
                                        onChange={(e) => {
                                            setRetypePass(e.target.value)
                                        }}
                                        type={`password`}
                                        placeholder="Xác nhận mật khẩu"
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
                                    Đăng ký
                                </button>
                            </div>
                            <div className={`flex justify-center my-4`}>
                                <p className={`text-gray-500`}><i>hoặc</i></p>
                            </div>
                            {/*Signup with Google*/}
                            <div className={`flex items-center w-full justify-center`}>
                                <button
                                    onClick={handleSignupWithGoogle}
                                    type={`button`}
                                    className=" flex w-fit px-4 justify-center gap-x-3 items-center rounded-lg bg-gray-100 p-2 hover:bg-gray-200">
                                    <img className={`w-6`} src="/public/google.png" alt={`Google Signup`}/>
                                    Đăng ký với Google
                                </button>
                            </div>
                            <div className={`flex items-center justify-center mt-10 gap-x-1`}>
                                <p className={`text-[14px] text-gray-700`}>Đã có tài khoản? </p>
                                <p onClick={handleForwardLogin}
                                   className={`text-[14px] text-green-400 cursor-pointer hover:underline`}>Đăng nhập</p>
                            </div>
                            {/*file*/}

                        </div>
                    </div>
                </div>

                <div
                    className={`backdrop-blur-sm bg-black bg-opacity-60 flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full h-full max-h-full ${sendCode ? "block" : "hidden"}`}>
                    <div className="relative p-4  max-h-full">
                        <div
                            className="relative bg-[#f5f5f5] p-6 rounded-lg flex items-center justify-center min-h-60 shadow ">
                            <div className={`overflow-hidden `}>
                                <div className={`flex-col  my-4`}>
                                    <div className={`flex flex-col gap-4`}>
                                        <div className={`flex justify-center`}>
                                            <p>Xác nhận mã đã được gửi đến email của bạn</p>
                                        </div>
                                        <Input
                                            prefix={<LuQrCode className={`mr-2`} size={24}
                                                              fill={"#00b14f"}/>}
                                            allowClear={true}
                                            maxLength={6}
                                            value={userCode}
                                            onChange={(e) => setUserCode(e.target.value)}
                                            showCount={true}
                                            spellCheck={false}
                                            className={`p-2 outline-none rounded border mt-2 `}/>
                                        <div className={`flex justify-center`}>
                                            <p className={`mt-1 text-red-500 `}>
                                                Thời hạn: <span className={`font-bold`}>{timer}</span>
                                            </p>
                                        </div>
                                        <div className={``}>
                                            <button
                                                onClick={handleVerifyCode}
                                                type={`button`}
                                                className={`w-full rounded hover:bg-green-600 text-white bg-green-500 py-2`}
                                            >
                                                Xác nhận
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div onClick={closeModal}
                                 className={`absolute top-2 cursor-pointer right-2`}>
                                <IoIosCloseCircle className={`cursor-pointer`}
                                                  size={28} fill={"#00b14f"}/>
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

export default Signup;

