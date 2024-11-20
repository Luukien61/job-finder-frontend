import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserCreationState} from "@/zustand/AppState.ts";
import {getSignupCode, signUpUser} from "@/axios/Request.ts";
import {toast, ToastContainer} from "react-toastify";
import {googleExchange} from "@/page/GoogleCode.tsx";
import {AppLogo, defaultPhoneNumber, fullProvinces, policies} from "@/info/AppInfo.ts";
import {MdOutlineMail} from "react-icons/md";
import {RiFileCodeLine, RiLockPasswordFill, RiLockPasswordLine} from "react-icons/ri";
import {CgCloseO} from "react-icons/cg";
import {UserSignupResponse} from "@/page/SignUp.tsx";
import {CustomInput} from "@/page/CompleteProfile.tsx";
import {IoPersonCircleSharp} from "react-icons/io5";
import {GoOrganization} from "react-icons/go";
import {HiOutlinePhone, HiPhone} from "react-icons/hi";
import {Checkbox, Select} from "antd";
import {BiSolidCity} from "react-icons/bi";
import {AiOutlineGlobal} from "react-icons/ai";

type ProvinceProps = { value: string, label: string, code: number }

const EmployerSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePass, setRetypePass] = useState('');
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [province, setProvince] = useState<string>('');
    const [district, setDistrict] = useState<string>();
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
    const [provincesName, setProvincesName] = useState<ProvinceProps[]>([])
    const [districtsName, setDistrictsName] = useState<{ value: string, label: string }[]>([])


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) navigate("/")
        else {
            const rawProvinces = fullProvinces.map(value => (
                {value: value.name, label: value.name, code: value.code}
            ))
            setProvincesName(rawProvinces)
        }
    }, []);

    const getDistrictsByProvinceCode = (_value: any, option: ProvinceProps[] | ProvinceProps) => {
        setDistrict(null)
        if(!Array.isArray(option)){
            setProvince(option.value);
            const province = fullProvinces.find(p => p.code === option.code);
            const district = province.districts.map(value => (
                {value: value.name, label: value.name}
            ))
            setDistrictsName(district)
        }
    }

    const onDistrictSelected = (value: any) => {
        setDistrict(value)
    }

    const handleSignup = async () => {
        if (email && password && retypePass) {
            if (password === retypePass) {
                const userCreationRequest = {
                    password: password,
                    email: email,
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
        <div className={`flex rounded items-start`}>
            <div className={`flex-1 h-screen overflow-hidden flex justify-center `}>
                <div className={`w-full rounded h-screen bg-white  my-auto `}>
                    <div className={`flex flex-col gap-y-2 justify-center items-center pb-3`}>
                        <div className={`flex-col relative my-4 w-full`}>
                            <div className={`sticky top-0 h-40 border-b bg-gray-50 border-green_default mx-4`}>
                                <div className={`flex justify-center`}>
                                    <img className={`w-28 rounded-full`} src={AppLogo} alt={`logo`}/>
                                </div>
                                <div className={`flex justify-center w-full items-center`}>
                                    <p className={`text-[24px] text-green_default font-bold`}>Đăng ký tài khoản Nhà
                                        tuyển
                                        dụng</p>
                                </div>
                            </div>
                            <div className={`flex flex-col w-full my-4 px-4 h-[calc(100vh-200px)] overflow-hidden`}>
                                <div className={`overflow-y-auto flex flex-col pb-14 gap-10 px-4`}>
                                    {/*account*/}
                                    <div className={`flex flex-col w-full gap-6 justify-start mt-6 pb-10 border-green_default border-b`}>
                                        <h2 className="border-l-[6px] mb-6 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                            Tài khoản
                                        </h2>
                                        <div className={`flex flex-col  w-full justify-start`}>
                                            <CustomInput
                                                prefix={<IoPersonCircleSharp className={`mr-2`} size={24}
                                                                             fill={"#00b14f"}/>}
                                                allowClear={true}
                                                value={email}
                                                label={"Email"}
                                                isBoldLable={true}
                                                disable={false}
                                                width={'w-1/2 text-16'}
                                                onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                        <div className={`flex flex-col  w-full justify-start`}>
                                            <CustomInput
                                                prefix={<RiLockPasswordFill className={`mr-2`} size={24}
                                                                            fill={"#00b14f"}/>}
                                                type={'password'}
                                                allowClear={true}
                                                value={password}
                                                isBoldLable={true}
                                                label={"Mật khẩu"}
                                                disable={false}
                                                width={'w-1/2 text-16'}
                                                onChange={(e) => setPassword(e.target.value)}/>
                                        </div>
                                        <div className={`flex flex-col  w-full justify-start`}>
                                            <CustomInput
                                                prefix={<RiLockPasswordFill className={`mr-2`} size={24}
                                                                            fill={"#00b14f"}/>}
                                                type={'password'}
                                                allowClear={true}
                                                value={retypePass}
                                                isBoldLable={true}
                                                label={"Xác nhận mật khẩu"}
                                                disable={false}
                                                width={'w-1/2 text-16'}
                                                onChange={(e) => setRetypePass(e.target.value)}/>
                                        </div>
                                    </div>
                                    {/*Employer Info*/}
                                    <div className={`flex flex-col pr-6 w-full gap-6 justify-start`}>
                                        <h2 className="border-l-[6px] mb-6 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                            Thông tin nhà tuyển dụng
                                        </h2>
                                        <div className={`flex flex-col  w-full justify-start gap-10`}>
                                            <div className={`flex w-full`}>
                                                <div className={`w-full  justify-start`}>
                                                    <CustomInput
                                                        prefix={<GoOrganization className={`mr-2`} size={24}
                                                                                fill={"#00b14f"}/>}
                                                        allowClear={true}
                                                        value={companyName}
                                                        label={"Tên tổ chức"}
                                                        isBoldLable={true}
                                                        disable={false}
                                                        width={'w-full text-16'}
                                                        onChange={(e) => setCompanyName(e.target.value)}/>
                                                </div>
                                            </div>
                                            <div className={`flex w-full`}>
                                                <div className={`flex flex-col w-1/2 pr-6 justify-start`}>
                                                    <CustomInput
                                                        prefix={<AiOutlineGlobal className={`mr-2`} size={24}
                                                                                fill={"#00b14f"}/>}
                                                        allowClear={true}
                                                        value={website}
                                                        label={"Website"}
                                                        isBoldLable={true}
                                                        disable={false}
                                                        width={'w-full text-16 '}
                                                        onChange={(e) => setWebsite(e.target.value)}/>
                                                </div>
                                                <div className={`flex flex-col w-1/2 justify-start`}>
                                                    <CustomInput
                                                        prefix={<HiPhone className={`mr-2`} size={24}
                                                                         fill={"#00b14f"}/>}
                                                        type={'text'}
                                                        allowClear={true}
                                                        value={phone}
                                                        label={"Số điện thoại"}
                                                        isBoldLable={true}
                                                        disable={false}
                                                        width={'w-full text-16'}
                                                        onChange={(e) => setPhone(e.target.value)}/>
                                                </div>
                                            </div>
                                            <div className={`flex w-full`}>
                                                <div className={`w-1/2 pr-6 justify-start`}>
                                                    <p className={`ml-1 mb-1 font-semibold`}>Tỉnh thành phố</p>
                                                    <Select
                                                        placeholder={'Tỉnh thành phố'}
                                                        prefix={<BiSolidCity className={`mr-2`} size={24}
                                                                             fill={"#00b14f"}/>}
                                                        className={`h-[42px] w-full `}
                                                        optionFilterProp="label"
                                                        options={provincesName}
                                                        onChange={(value, option) => getDistrictsByProvinceCode(value, option)}
                                                    />
                                                </div>
                                                <div className={`w-1/2  justify-start`}>
                                                    <p className={`ml-1 mb-1 font-semibold`}>Quận huyện</p>
                                                    <Select
                                                        placeholder={'Quận huyện'}
                                                        prefix={<BiSolidCity className={`mr-2`} size={24}
                                                                             fill={"#00b14f"}/>}
                                                        className={`h-[42px] w-full `}
                                                        value={district}
                                                        optionFilterProp="label"
                                                        onChange={onDistrictSelected}
                                                        options={districtsName}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                        <div className={`mt-10 flex flex-col gap-6`}>
                                            <div className={`bg-gray-50 border border-green_default rounded-lg p-6`}>
                                                <p className={`text-[20px] font-bold text-green_default`}>
                                                    Quy định
                                                </p>
                                                <div className={`w-full pt-4`}>
                                                    <p className={`text-16 `}>Để đảm bảo chất lượng dịch vụ và tạo môi
                                                        trường lành mạnh:</p>
                                                    <ul className={`list-disc ml-6`}>
                                                        {
                                                            policies.map((policy) => (
                                                                <li className={`mt-3`}>{policy}</li>
                                                            ))
                                                        }
                                                    </ul>
                                                    <div className={`mt-6 flex gap-4 items-center`}>
                                                        <div className={`w-fit p-2 rounded-full bg-green_light flex items-center justify-center`}>
                                                            <HiPhone size={24}
                                                                     fill={"#00b14f"}/>
                                                        </div>
                                                        <p className={`text-green_default font-bold text-16`}>{defaultPhoneNumber}</p>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className={`flex gap-4`}>
                                                <div>
                                                    <Checkbox required={true} className={``}>Tôi đã đọc và đồng ý với <span className={`text-green_default font-bold`}>Điều khoản dịch vụ</span> và <span className={`text-green_default font-bold`}>Chính sách bảo mật</span> của JobFinder</Checkbox>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    {/*button*/}
                                    <div className={`w-full`}>
                                        <button
                                            disabled={true}
                                            className={`w-full disabled:bg-gray-200 hover:bg-green_default text-white font-bold p-2 text-[18px] text-center rounded bg-green_nga`}>Hoàn
                                            thành
                                        </button>
                                    </div>
                                    <div className={`w-full`}>
                                        <div className={`flex items-center justify-center  gap-x-1`}>
                                            <p className={`text-[14px] text-gray-700`}>Đã có tài khoản? </p>
                                            <p onClick={handleForwardLogin}
                                               className={`text-[14px] text-green-400 cursor-pointer hover:underline`}>Đăng
                                                nhập</p>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-fit`}>
                <img className={`w-full h-screen object-contain`}
                     src={`/public/job-finder-employer.jpg`}
                     alt={`bg-cv`}/>
            </div>
        </div>
    );
};

export default EmployerSignup;