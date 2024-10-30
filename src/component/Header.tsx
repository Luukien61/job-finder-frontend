import React from 'react';
import {AppInfo} from "../info/AppInfo.ts";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const handleButtonClick=(target: string)=>{
        navigate(`${target}`,{replace:false});
    }
    return (
        <div className={`px-4 flex bg-white border-none border-b-[1px] border-b-[#e9eaec] sticky top-0 z-50 shadow`}>

            <div className={`flex justify-between w-full`}>
                {/*App logo*/}
                <div>
                    <a
                        href="/"
                        target='_self'
                        className="mr-3 flex-none overflow-hidden w-auto flex items-center gap-2"
                    >
                        <img
                            src="/public/job-finder.png"
                            alt="App Home page"
                            className="object-cover w-[40%] max-w-[128px] "
                        />
                        <p className="text-black font-semibold">{AppInfo.appName}</p>
                    </a>
                </div>
                {/*Login area*/}
                <div className={`items-center flex gap-x-4`}>
                    <button
                        onClick={()=>handleButtonClick("login")}
                        type={"button"}
                        className={`rounded bg-white border-2 border-primary hover:bg-gray-100 text-primary text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                        Log In
                    </button>
                    <button
                        onClick={()=>handleButtonClick("signup")}
                        type={"button"}
                        className={`rounded bg-primary hover:bg-green-400 text-white text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                        Sign Up
                    </button>
                    <button
                        type={"button"}
                        className={`rounded bg-black hover:bg-gray-900 text-white text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                        Employer
                    </button>
                </div>
            </div>


        </div>
    );
};

export default Header;