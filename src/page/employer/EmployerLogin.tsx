import React, {useEffect, useState} from 'react';
import {AppLogo, requiredFields} from "@/info/AppInfo.ts";
import {CustomInput} from "@/page/CompleteProfile.tsx";
import {IoPersonCircleSharp} from "react-icons/io5";
import {RiLockPasswordFill} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {employerLogin} from "@/axios/Request.ts";

const EmployerLogin = () => {
    const [email, setEmail]=useState<string>("");
    const [password, setPassword]=useState<string>("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        if(email && password){
            try{
                const response = await employerLogin({email:email,password:password});
                if(response){
                    localStorage.setItem('company',JSON.stringify(response));
                    navigate('/employer');
                }
            }catch(err){
                toast.error(err.response.data)
            }
        }else {
            toast.error(requiredFields)
        }
    }
    useEffect(() => {
        const company = JSON.parse(localStorage.getItem('company'));
        if(company && company.id){
            navigate("/employer");
        }
    }, []);
    return (
        <div className={`flex-1 h-screen overflow-hidden flex justify-center `}>
            <div className={`w-full rounded h-screen bg-white  my-auto `}>
                <div className={`flex flex-col gap-y-2 justify-center items-center pb-3`}>
                    <div className={`flex-col relative my-4 w-full`}>
                        <div className={`sticky top-0 h-40 border-b bg-gray-50 border-green_default mx-4`}>
                            <div className={`flex justify-center`}>
                                <a href={'/'}>
                                    <img className={`w-28 rounded-full`} src={AppLogo} alt={`logo`}/>
                                </a>
                            </div>
                            <div className={`flex justify-center w-full items-center`}>
                                <p className={`text-[24px] text-green_default font-bold`}>Chào mừng bạn đã quay trở lại </p>
                            </div>
                        </div>
                        <div className={`flex flex-col w-full my-16 px-4 h-full`}>
                            <div className={`overflow-y-auto flex flex-col gap-10 px-4`}>
                                <div className={`w-full flex justify-center items-center`}>
                                    <div className={`w-[calc(66%-70px)]  max-w-[550px] flex flex-col gap-6`}>
                                        <div className={`flex w-full`}>
                                            <div className={`w-full justify-start`}>
                                                <CustomInput
                                                    prefix={<IoPersonCircleSharp className={`mr-2`} size={24}
                                                                                 fill={"#00b14f"}/>}
                                                    allowClear={true}
                                                    value={email}
                                                    label={"Email"}
                                                    isBoldLabel={true}
                                                    disable={false}
                                                    width={'w-full text-16'}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className={`flex w-full`}>
                                            <div className={`w-full justify-start`}>
                                                <CustomInput
                                                    prefix={<RiLockPasswordFill className={`mr-2`} size={24}
                                                                                fill={"#00b14f"}/>}
                                                    allowClear={true}
                                                    value={password}
                                                    label={"Mật khẩu"}
                                                    type={'password'}
                                                    isBoldLabel={true}
                                                    disable={false}
                                                    width={'w-full text-16'}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className={`flex justify-end items-center px-1`}>
                                            <p className={`text-green_default font-semibold text-14 italic hover:underline cursor-pointer`}>Quên
                                                mật khẩu?</p>
                                        </div>

                                        <div className={`w-full`}>
                                            <button
                                                onClick={handleLogin}
                                                className={`w-full disabled:bg-gray-200 hover:bg-green_default text-white font-bold p-2 text-[18px] text-center rounded bg-green_nga`}>
                                                Đăng nhập
                                            </button>
                                        </div>
                                        <div className={`flex items-center justify-center`}>
                                            <p className={`text-14 opacity-70`}>Chưa có tài khoản? <span onClick={()=>navigate('/employer/entry/signup')} className={`text-14 font-semibold  hover:underline cursor-pointer text-green_default`}>Đăng ký ngay</span></p>

                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerLogin;