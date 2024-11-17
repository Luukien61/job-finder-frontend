import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserResponse} from "@/page/GoogleCode.tsx";
import {AiFillMessage} from "react-icons/ai";
import {IoNotifications} from "react-icons/io5";

const Header = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState<UserResponse>()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setLoginUser(user)
        }
    }, [])

    const profileClick=()=>{
        if(loginUser){
            navigate(`/me/${loginUser.userId}`)
        }
    }
    const handleButtonClick = (target: string) => {
        navigate(`${target}`, {replace: false});
    }
    return (
        <div
            className={`px-4 flex min-h-[74px] bg-white border-none border-b-[1px] border-b-[#e9eaec] sticky top-0 z-50 shadow`}>

            <div className={`flex justify-between w-full`}>
                {/*App logo*/}
                <div>
                    <a
                        href="/"
                        target='_self'
                        className="mr-3 flex-none overflow-hidden w-auto flex items-center gap-2"
                    >
                        <img
                            src="/public/job-finder.jpg"
                            alt="App Home page"
                            className="object-cover w-[70%] max-w-[128px] "
                        />
                        {/*<p className="text-black font-semibold">{AppInfo.appName}</p>*/}
                    </a>
                </div>
                <div
                    className={`flex-1 flex *:text-[18px] justify-start gap-10 *:cursor-pointer  items-center *:font-bold`}>
                    <p className={`hover:text-green-500`}>Việc làm</p>
                    <p className={`hover:text-green-500`}>Hồ sơ & CV</p>
                    <p className={`hover:text-green-500`}>Công ty</p>

                </div>
                {/*Login area*/}
                {loginUser ?
                    <div className={`items-center flex gap-x-4 mx-2`}>
                        <div
                            className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 bg-[#E5F7ED]`}>
                            <IoNotifications size={24} fill={"#00B14F"}/>
                        </div>
                        <div
                            onClick={()=>navigate(`/message/${loginUser.userId}`)}
                            className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 p-1 bg-[#E5F7ED]`}>
                            <AiFillMessage size={24} fill={"#00B14F"}/>
                        </div>
                        <div onClick={profileClick}
                             className={`w-9 cursor-pointer  bg-white  aspect-square rounded-full overflow-y-hidden`}>
                            <img src={loginUser && loginUser.avatar} alt={`avatar`}
                                 className="object-cover "/>
                        </div>
                    </div> :
                    <div className={`items-center flex gap-x-4`}>
                        <button
                            onClick={() => handleButtonClick("login")}
                            type={"button"}
                            className={`rounded bg-white border-2 border-primary hover:bg-gray-100 text-primary text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                            Đăng nhập
                        </button>
                        <button
                            onClick={() => handleButtonClick("signup")}
                            type={"button"}
                            className={`rounded hover:bg-green-600 bg-green_default text-white text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                            Đăng ký
                        </button>
                        <button
                            type={"button"}
                            className={`rounded bg-black hover:bg-gray-900 text-white text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                            Nhà tuyển dụng
                        </button>
                    </div>}

            </div>


        </div>
    );
};

export default Header;