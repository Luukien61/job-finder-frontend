import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {employerSignUp, getVerificationCode} from "@/axios/Request.ts";
import {toast} from "react-toastify";
import {
    AppLogo,
    defaultCompanyLogo,
    defaultCompanyWallpaper,
    defaultPhoneNumber,
    fullProvinces,
    policies
} from "@/info/AppInfo.ts";
import {RiLockPasswordFill} from "react-icons/ri";
import {CustomInput} from "@/page/CompleteProfile.tsx";
import {IoPersonCircleSharp} from "react-icons/io5";
import {GoOrganization} from "react-icons/go";
import {HiPhone} from "react-icons/hi";
import {Checkbox, Input, Select} from "antd";
import {BiSolidCity} from "react-icons/bi";
import {CustomModal} from "@/page/UserProfile.tsx";
import {LuQrCode} from "react-icons/lu";

export type ProvinceProps = { value: string, label: string, code: number }


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
    const [userCode, setUserCode] = useState<string>('')
    const [verificationCode, setVerificationCode] = useState<string>('')
    const [, setIsDone] = useState<boolean>(false)
    const [sendCode, setSendCode] = useState<boolean>(false)
    const [isAgreed, setIsAgreed] = useState<boolean>(false)
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
        if (!Array.isArray(option)) {
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
        if (password && retypePass && email && companyName && phone && province) {
            if (password == retypePass) {
                setSendCode(true)
                try {
                    const code = await getVerificationCode({
                        to: email,
                        useCase: 'Tạo tài khoản Nhà tuyển dụng'
                    })
                    toast.info("Code: " + code)
                    console.log("Code: " + code)
                    if (code) {
                        setVerificationCode(code)
                    } else {
                        toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
                    }
                } catch (e) {
                    toast.error(e);
                }
            }

        } else {
            toast.error("Vui lòng điền các thông tin còn thiếu")
        }

    }

    const handleVerifyCode = async () => {
        if (verificationCode && userCode && userCode.length == 6) {
            if (verificationCode == userCode) {
                let fullAddress = province
                if (district) {
                    fullAddress = district + ', ' + province
                }
                try {
                    const request = {
                        email: email,
                        phone: phone,
                        logo: defaultCompanyLogo,
                        wallpaper: defaultCompanyWallpaper,
                        name: companyName,
                        password: password,
                        address: fullAddress,
                        website: website,
                        createdAt: new Date()
                    }
                    const response = await employerSignUp(request);
                    if(response){
                        localStorage.setItem("company", JSON.stringify(response))
                        navigate("/employer")
                    }
                }catch (e) {
                    toast.error(e.response.data);
                }
            } else {
                toast.error('Mã xác nhận không đúng')
            }
        } else {
            toast.error("Có lỗi xảy ra")
        }
    }


    const handleForwardLogin = () => {
        navigate("/employer/entry/login", {replace: false});
    }


    const closeModal = () => {
        setSendCode(false)
        setIsDone(false)
        setVerificationCode(undefined)
        setUserCode('')
    }

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
                                <p className={`text-[24px] text-green_default font-bold`}>Đăng ký tài khoản Nhà
                                    tuyển
                                    dụng</p>
                            </div>
                        </div>
                        <div className={`flex flex-col w-full my-4 px-4 h-[calc(100vh-200px)] overflow-hidden`}>
                            <div className={`overflow-y-auto flex flex-col pb-14 gap-10 px-4`}>
                                {/*account*/}
                                <div
                                    className={`flex flex-col w-full gap-6 justify-start mt-6 pb-10 border-green_default border-b`}>
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
                                            isBoldLabel={true}
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
                                            isBoldLabel={true}
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
                                            isBoldLabel={true}
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
                                                    isBoldLabel={true}
                                                    disable={false}
                                                    width={'w-full text-16'}
                                                    onChange={(e) => setCompanyName(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className={`flex items-center w-full`}>
                                            <div className={`flex flex-col w-1/2 pr-6 justify-start`}>
                                                <CustomInput
                                                    allowClear={true}
                                                    addBefore={'https://'}
                                                    value={website}
                                                    label={"Website"}
                                                    isBoldLabel={true}
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
                                                    isBoldLabel={true}
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
                                                    <div
                                                        className={`w-fit p-2 rounded-full bg-green_light flex items-center justify-center`}>
                                                        <HiPhone size={24}
                                                                 fill={"#00b14f"}/>
                                                    </div>
                                                    <p className={`text-green_default font-bold text-16`}>{defaultPhoneNumber}</p>
                                                </div>
                                            </div>

                                        </div>
                                        <div className={`flex gap-4`}>
                                            <div>
                                                <Checkbox
                                                    required={true}
                                                    value={isAgreed}
                                                    onChange={() => setIsAgreed(pre => !pre)}
                                                >Tôi đã đọc và đồng ý với <span
                                                    className={`text-green_default font-bold`}>Điều khoản dịch vụ</span> và <span
                                                    className={`text-green_default font-bold`}>Chính sách bảo mật</span> của
                                                    JobFinder</Checkbox>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {/*button*/}
                                <div className={`w-full`}>
                                    <button
                                        onClick={handleSignup}
                                        disabled={!isAgreed}
                                        className={`w-full disabled:bg-gray-200 hover:bg-green_default text-white font-bold p-2 text-[18px] text-center rounded bg-green_nga`}>Hoàn
                                        thành
                                    </button>
                                </div>
                                <div className={`w-full`}>
                                    <div className={`flex items-center justify-center  gap-x-1`}>
                                        <p className={`text-[14px] text-gray-700`}>Đã có tài khoản? </p>
                                        <p onClick={handleForwardLogin}
                                           className={`text-[14px] font-semibold text-green-400 cursor-pointer hover:underline`}>Đăng
                                            nhập</p>
                                    </div>

                                </div>
                                {
                                    sendCode && (
                                        <CodeVerify
                                            code={userCode}
                                            time={60}
                                            onClose={closeModal}
                                            onVerify={handleVerifyCode}
                                            onExpire={() => setSendCode(false)}
                                            onChange={(e) => setUserCode(e.target.value)}/>
                                    )
                                }
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
type CodeVerifyProps = {
    code: string;
    onChange: (e) => void;
    time: number;
    onVerify: () => void;
    onClose: () => void;
    onExpire: () => void;
}

export const CodeVerify: React.FC<CodeVerifyProps> = (props) => {
    const [timer, setTimer] = useState<number>(props.time);
    const intervalTimer = useRef<NodeJS.Timeout | null>(null)
    useEffect(() => {
        if (timer === 0 && intervalTimer.current) {
            clearInterval(intervalTimer.current)
            setTimer(60)
            intervalTimer.current = null
            props.onExpire()
        }
    }, [timer])
    useEffect(() => {
        intervalTimer.current = setInterval(() => {
            setTimer((prev) => prev - 1)
        }, 1000)
        return () => {
            clearInterval(intervalTimer.current)
            setTimer(60)
            intervalTimer.current = null
        }
    }, []);
    return (
        <CustomModal
            child={
                <div className={`flex flex-col p-6 gap-4`}>
                    <div className={`flex justify-center`}>
                        <p>Xác nhận mã đã được gửi đến email của bạn</p>
                    </div>
                    <Input
                        prefix={<LuQrCode className={`mr-2`} size={24}
                                          fill={"#00b14f"}/>}
                        allowClear={true}
                        maxLength={6}
                        value={props.code}
                        onChange={props.onChange}
                        showCount={true}
                        spellCheck={false}
                        className={`p-2 outline-none rounded border mt-2 `}/>
                    <div className={`flex justify-center`}>
                        <p className={`mt-1 text-red-500 `}>
                            Valid timer: <span className={`font-bold`}>{timer}</span>
                        </p>
                    </div>
                    <div className={``}>
                        <button
                            onClick={props.onVerify}
                            type={`button`}
                            className={`w-full rounded hover:bg-green-600 text-white bg-green-500 py-2`}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>}
            high={'h-fit'}
            handleOutModalClick={() => null}
            closeOnIcon={true}
            handleCloseModal={props.onClose}
            handleModalClicks={() => null}

        />
    )
}

export default EmployerSignup;