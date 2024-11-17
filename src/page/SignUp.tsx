import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {IoPersonOutline} from "react-icons/io5";
import {MdOutlineMail} from "react-icons/md";
import {FiPhone} from "react-icons/fi";
import {RiFileCodeLine, RiLockPasswordLine} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import {PdfProcessed, usePdfProcessed} from "@/zustand/AppState.ts";
import {googleExchange, UserResponse} from "@/page/GoogleCode.tsx";
import {toast, ToastContainer} from "react-toastify";
import {getSignupCode, signUpUser} from "@/axios/Request.ts";
import {AppLogo} from "@/info/AppInfo.ts";
import {CgCloseO} from "react-icons/cg";

const Signup = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePass, setRetypePass] = useState('');
    const [phone, setPhone] = useState('');
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
    const {item, setItem} = usePdfProcessed()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user) navigate("/")
    }, []);

    const handleSignup = async () => {
        if (userName && email && password && retypePass) {
            if (password === retypePass) {
                const userCreationRequest = {
                    email: email,
                    password: password,
                    phone: phone,
                    name: userName,
                }
                try {
                    const code = await getSignupCode({to: email, useCase: "Tạo tài khoản"})
                    console.log(code)
                    setVerificationCode(code)
                    setUserSignUp(userCreationRequest)
                    setSendCode(true)
                    intervalTimer.current = setInterval(() => {
                        setTimer((prev) => prev - 1)
                    }, 1000)
                } catch (err) {
                    console.log(err.response.data)
                    toast.error("An error occurred while signing up");
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
        }
    }, [timer])

    const handleVerifyCode = async () => {
        if (userCode.length === 6 && !expired) {
            if (userCode == verificationCode && !expired) {
                setTimeout(() => setIsDone(true), 1000)
                if (userSignUp) {
                    const response :UserResponse= await signUpUser(userSignUp)
                    localStorage.setItem('user', JSON.stringify(response))
                    navigate('/')
                }
            } else {
                toast.error('The verification code is incorrect', {
                    hideProgressBar: true,
                    autoClose: 1000
                })
            }
        } else {
            toast.error('Either verification code or expired', { hideProgressBar: true, autoClose: 1000 })
        }
    }


    const handleSignupWithGoogle = () => {
        localStorage.setItem("action", "signup")
        googleExchange()
    }
    const handleForwardLogin = () => {
        navigate("/login", {replace: false});
    }

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) return;

        // Tạo FormData để gửi file PDF
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data: PdfProcessed = await response.json();
                setItem(data)
                navigate("/test")
            } else {
                alert('Failed to upload file.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };
    const closeModal=()=>{
        setSendCode(false)
        setIsDone(false)
        setUserSignUp(undefined)
        setVerificationCode(undefined)
        clearInterval(intervalTimer.current)
        intervalTimer.current = null
        setExpired(false)
        setTimer(60)
    }

    return (
        <div className={`flex justify-center rounded  min-h-screen `}>
            <div className={`custom-container mt-2 flex justify-center `}>
                <div className={`w-2/3 rounded bg-white drop-shadow `}>
                    <div className={`flex flex-col gap-y-2 justify-center items-center pb-3`}>
                        <div className={`w-3/4 flex-col my-4`}>
                            <div className={`flex justify-center`}>
                                <img className={`w-28`} src={AppLogo} alt={`${userName} logo`}/>
                            </div>
                            {/*name*/}
                            <div>
                                <div>
                                    <p>Your Name</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                    <IoPersonOutline color={`green`}/>
                                    <input
                                        value={userName}
                                        onChange={(e) => {
                                            setUserName(e.target.value)
                                        }}
                                        placeholder="Your Name"
                                        spellCheck={false}
                                        className={`outline-none text-black flex-1`}
                                    />
                                </div>
                            </div>
                            {/*email and phone*/}
                            <div className={`flex my-4`}>
                                <div className={`w-1/2 pr-2`}>
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
                                <div className={`w-1/2 pl-2`}>
                                    <div>
                                        <p>Phone</p>
                                    </div>
                                    <div className={`flex rounded border items-center py-2 px-2 `}>
                                        <FiPhone color={`green`}/>
                                        <input
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value)
                                            }}
                                            placeholder="Phone"
                                            spellCheck={false}
                                            className={`outline-none text-black max-w-[90%] flex-1 pl-4`}
                                        />
                                    </div>
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
                            {/*retype password*/}
                            <div>
                                <div>
                                    <p>Retype password</p>
                                </div>
                                <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                    <RiLockPasswordLine color={`green`}/>
                                    <input
                                        value={retypePass}
                                        onChange={(e) => {
                                            setRetypePass(e.target.value)
                                        }}
                                        type={`password`}
                                        placeholder="Retype password"
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
                                    Sign up
                                </button>
                            </div>
                            <div className={`flex justify-center my-4`}>
                                <p className={`text-gray-500`}><i>or</i></p>
                            </div>
                            {/*Signup with Google*/}
                            <div className={`flex items-center justify-center`}>
                                <button
                                    onClick={handleSignupWithGoogle}
                                    type={`button`}
                                    className=" flex  gap-x-3 items-center rounded-2xl bg-gray-100 p-2 hover:bg-gray-200">
                                    <img className={`w-6`} src="/public/google.png" alt={`Google Signup`}/>
                                    Sign up with Google
                                </button>
                            </div>
                            <div className={`flex items-center justify-center my-4 gap-x-1`}>
                                <p className={`text-[14px] text-gray-700`}>Already have an account? </p>
                                <p onClick={handleForwardLogin}
                                   className={`text-[14px] text-green-400 cursor-pointer hover:underline`}>Log in</p>
                            </div>
                            {/*file*/}
                            <div className="p-4 flex items-center justify-center w-full">
                                <form onSubmit={handleSubmit}
                                      className="space-y-4 flex justify-center items-center flex-col">
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="block text-sm text-gray-50 w-[120px] file:py-2 file:px-4
                                                   file:rounded-full file:border-0
                                                   file:text-sm file:font-semibold
                                                   file:bg-violet-50 file:text-violet-700
                                                   hover:file:bg-violet-100"/>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Upload
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`backdrop-blur-sm bg-black bg-opacity-60 flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full h-full max-h-full ${sendCode ? "block" : "hidden"}`}>
                    <div className="relative p-4 w-[700px] max-h-full">
                        <div
                            className="relative bg-[#f5f5f5] rounded-lg flex items-center justify-center min-h-60 shadow ">
                            <div className={`overflow-hidden `}>
                                <div className={`flex-col  my-4`}>
                                    <div className={`flex flex-col gap-4`}>
                                        <div className={`flex justify-center`}>
                                            <p>Xác nhận mã đã được gửi đến email của bạn</p>
                                        </div>
                                        <div className={`flex rounded border px-2 items-center py-2 gap-x-4`}>
                                            <RiFileCodeLine color={`green`}/>
                                            <input
                                                value={userCode}
                                                onChange={(e) => {
                                                    setUserCode(e.target.value)
                                                }}
                                                placeholder="Code"
                                                spellCheck={false}
                                                className={`outline-none p-2 text-black flex-1`}
                                            />
                                        </div>
                                        <div className={`flex justify-center`}>
                                            <p className={`mt-1 text-red-500 `}>
                                                Valid timer: <span className={`font-bold`}>{timer}</span>
                                            </p>
                                        </div>
                                        <div className={``}>
                                            <button
                                                onClick={handleVerifyCode}
                                                type={`button`}
                                                className={`w-full rounded hover:bg-green-600 text-white bg-green-500 py-2`}
                                            >
                                                Verify
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div onClick={closeModal}
                                className={`absolute top-2 cursor-pointer right-2`}>
                                <CgCloseO size={28}/>
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

type InputProps = {
    icon: ReactNode,
    value: string,
    onChange: (value: string) => void
    style?: string,
    placeholder: string,
}
export const Input: React.FC<InputProps> = ({icon, value, onChange, placeholder, style}) => {
    return (
        <div className={`flex rounded border items-center py-2 px-2 `}>
            {icon}
            <input
                value={value}
                onChange={(e) => {
                    onChange(e.target.value)
                }}
                placeholder={placeholder}
                spellCheck={false}
                className={`outline-none text-black max-w-[90%] flex-1 pl-4 ${style}`}
            />
        </div>
    )
}