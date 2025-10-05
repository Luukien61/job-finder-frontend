import React, {ChangeEvent, useEffect, useState} from 'react';
import {DatePicker, DatePickerProps, Input, Select, Spin} from 'antd';
import {PdfProcessed, UserCreationState} from "@/zustand/AppState.ts";
import {SlCamera} from "react-icons/sl";
import {UserSignupResponse} from "@/page/SignUp.tsx";
import {IoCloudUploadOutline} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import dayjs, {Dayjs} from 'dayjs';
import {default_avatar} from "@/info/AppInfo.ts";
import imageUpload from "@/axios/ImageUpload.ts";
import {completeProfile, updateCv, uploadCvToAWSSpring} from "@/axios/Request.ts";
import {format} from "date-fns";


const CompleteProfile = () => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState<Date>();
    const [gender, setGender] = useState('');
    const [educationLevel, setEducationLevel] = useState('');
    const [university, setUniversity] = useState('');
    const [address, setAddress] = useState('');
    const {user, setUser} = UserCreationState()
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [dayJs, setDayJs] = useState<Dayjs | null>(null);
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        setAvatar(default_avatar)
        if (user) {
            if (user.name) setName(user.name)

            setEmail(user.email)
            setUserId(user.id)
        } else {
            const localUser: UserSignupResponse = JSON.parse(localStorage.getItem('user'));
            setEmail(localUser.email)
            setUserId(localUser.id)
        }
    }, [])

    const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (typeof dateString === 'string') {
            const [day, month, year] = dateString.split("-").map(Number);
            const dateOfBirth = new Date(year, month - 1, day)
            const dateJs = dayjs(dateOfBirth)
            setDate(dateOfBirth);
            setDayJs(dateJs)
        }
    };

    const onEducationLevelChange = (value: string) => {
        setEducationLevel(value);
    };
    const onGenderChange = (value: string) => {
        setGender(value);
    }

    const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const file = files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatar(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setFileName(event.target.files[0].name);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true)
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
            setIsLoading(false);

            if (response.ok) {
                const data: PdfProcessed = await response.json();
                if (data) {
                    const rawDate = data.date
                    setName(data.name);
                    setPhone(data.phone);
                    setAddress(data.location)
                    setGender(data.gender);
                    setUniversity(data.organization)
                    if (!data.image.startsWith("not_found"))
                        setAvatar(`data:image/png;base64,${data.image}`)

                    if (rawDate) {
                        const [day, month, year] = rawDate.split(/[-/]/);
                        const dayjsDate = dayjs(`${year}-${month}-${day}`);
                        console.log(dayjsDate)
                        setDayJs(dayjsDate);
                        const date = new Date(`${year}-${month}-${day}`);
                        setDate(date);
                    } else {
                        setDayJs(null)
                    }
                    if (data.email && data.email != email) {
                        toast.error("Dùng email đã đăng ký tài khoản")
                    }
                }
            } else {

                toast.error("Có lỗi xảy ra");
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error);
        }
    };

    const handleSignUpDone = async () => {

        if (name && email && phone && gender && date) {
            setIsLoading(true)
            let user_avatar = avatar
            let user_id = userId;
            if (avatar && avatar != default_avatar) {
                user_avatar = await imageUpload({image: avatar})
            }
            if (userId == null) {
                const user: UserSignupResponse = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    user_id = user.id;
                } else {
                    navigate('/login');
                }
            }

            const userProfileCompleteRequest = {
                id: user_id,
                name: name,
                email: email,
                phone: phone,
                gender: gender,
                educationLevel: educationLevel,
                university: university,
                address: address,
                dateOfBirth: format(date, 'yyyy-MM-dd'),
                avatar: user_avatar,
                createdAt: format(new Date(), 'yyyy-MM-dd')
            }
            try {
                const response: UserSignupResponse = await completeProfile(userProfileCompleteRequest)
                setUser(response)
                localStorage.setItem('user', JSON.stringify(response))
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const raw_url = await uploadCvToAWSSpring(user_id, formData);
                    if (raw_url) {
                        const url = raw_url.url
                        await updateCv(userId, {value: url})

                    }
                }
                setIsLoading(false)
                navigate("/")
            } catch (error) {
                setIsLoading(false)
                toast.error(error);
            }


        } else {
            toast.error("Vui lòng điền các thông tin còn thiếu")
        }
    }

    return (
        <div>
            <div className={`w-full pb-10`}>
                <img className={`w-full absolute`} src={`https://jobsgo.vn/media/import_cv/background_import_cv.png`}
                     alt={`bg-cv`}/>
                <div className={`relative max-w-[1190px] m-auto items-center  flex justify-center `}>
                    <div className={`w-[65%] rounded pb-4 shadow-2xl mt-10 flex flex-col bg-white`}>
                        {/*upload*/}
                        <div className={`flex w-full justify-center items-center py-2`}>
                            <div className="pl-4 flex items-center justify-center text-[16px] w-1/2">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 flex  w-full rounded justify-center items-center"
                                >
                                    <div className="relative flex-1  w-full overflow-hidden">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full cursor-pointer h-full opacity-0 "
                                        />
                                        <button
                                            type="button"
                                            className="block  h-[40px] truncate text-[16px] cursor-pointer text-black w-full py-1 px-4 rounded-l-lg bg-gray-100 text-center file:font-semibold hover:bg-gray-200"
                                        >
                                            {fileName || "Chọn CV của bạn"}
                                        </button>
                                    </div>
                                    <button

                                        type="submit"
                                        className="px-4 flex items-center justify-between gap-2 bg-gray-100 h-[40px] rounded-r-lg !mt-0 hover:bg-gray-200"
                                    >
                                        Tải lên
                                        <IoCloudUploadOutline size={24} color={"#00b14f"}/>
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div
                            className={` border-b mb-2 flex w-full justify-center items-center text-14 italic opacity-70`}>hoặc
                            hoàn thiện
                        </div>
                        <CompleteInfo
                            avatar={avatar}
                            email={email}
                            name={name}
                            address={address}
                            phone={phone}
                            gender={gender}
                            dayJs={dayJs}
                            educationLevel={educationLevel}
                            university={university}
                            handleAvatarUpload={handleAvatarUpload}
                            onDateChange={onDateChange}
                            setName={(name) => setName(name)}
                            setPhone={setPhone}
                            setAddress={setAddress}
                            setUniversity={setUniversity}
                            onEducationLevelChange={onEducationLevelChange}
                            onGenderChange={onGenderChange}
                            handleSignUpDone={handleSignUpDone}
                        />

                    </div>
                </div>
            </div>
            <div className={`${isLoading ? 'block' : 'hidden'}`}>
                <Spin size="large" fullscreen={true}/>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                pauseOnHover={true}
            />
        </div>
    );
};
type CompleteProfileProps = {
    avatar: string;
    handleAvatarUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    name: string;
    setName: (name: string) => void;
    email: string;
    phone: string;
    setPhone: (phone: string) => void;
    dayJs: dayjs.Dayjs
    onDateChange: (date: Dayjs, dateString: string | string[]) => void;
    address: string;
    setAddress: (address: string) => void;
    educationLevel: string;
    onEducationLevelChange: (educationLevel: string) => void;
    onGenderChange: (egender: string) => void;
    gender: string;
    university: string;
    setUniversity: (university: string) => void;
    handleSignUpDone: () => void;

}
export const CompleteInfo: React.FC<CompleteProfileProps> = (item) => {
    const educationLevelOptions = [
        {
            value: 'Đại học',
            label: 'Đại học',
        },
        {
            value: "Cao đẳng",
            label: "Cao đẳng"
        },
        {
            value: 'Tiến sĩ',
            label: 'Tiến sĩ',
        },
        {
            value: 'Thạc sĩ',
            label: 'Thạc sĩ',
        },
        {
            value: "Trung cấp-nghề",
            label: "Trung cấp-nghề"
        },
        {
            value: "Trung học phổ thông",
            label: "Trung học phổ thông"
        },
        {
            value: "Khác",
            label: "Khác"
        }
    ]
    const genderOptions = [
        {value: 'Nam', label: 'Nam'},
        {value: 'Nữ', label: 'Nữ'},
    ]

    return (
        <div className={`flex flex-col gap-4  w-full bg-white rounded`}>
            <div className={`flex items-center relative justify-center w-full`}>
                <div className={`relative w-[150px] aspect-square`}>
                    <img alt={`avatar`} src={item.avatar}
                         className={`w-[150px] border-2 object-cover aspect-square rounded-full`}/>
                    <div
                        className={`flex items-center absolute bottom-0 left-[75%] w-fit z-50 justify-start py-1 `}
                    >
                        <label
                            className="flex flex-col  items-center justify-start w-fit h-full  rounded-lg cursor-pointer  ">
                            <div
                                className={`bg-gray-300 w-[30px] flex items-center justify-center border rounded-full aspect-square`}
                            >
                                <SlCamera size={16}/>
                            </div>
                            <input
                                onChange={item.handleAvatarUpload}
                                type="file"
                                accept={'image/*'}
                                multiple={false}
                                className="hidden outline-none"
                            />
                        </label>
                    </div>
                </div>
            </div>
            {/*name*/}
            <div className={`flex flex-col gap-6  w-full px-4 *:w-full`}>
                <div className={`w-full`}>
                    <CustomInput value={item.name}
                                 width={'w-full'}
                                 onChange={(e) => item.setName(e.target.value)}
                                 label={'Họ và tên'}/>
                </div>
                <div className={`flex `}>
                    <div className={`flex flex-col w-1/2 pr-2`}>
                        <CustomInput value={item.email}
                                     disable={true}
                                     onChange={() => {
                                     }}
                                     width={'w-full'}
                                     label={'Email'}/>
                    </div>
                    <div className={`flex flex-col w-1/2 pl-2`}>
                        <CustomInput value={item.phone}
                                     width={'w-full'}
                                     onChange={(e) => item.setPhone(e.target.value)}
                                     label={'Số điện thoại'}/>
                    </div>
                </div>
                <div className={`flex `}>
                    <div className={`flex flex-col w-1/2 pr-2`}>
                        <p className={`ml-1 mb-1`}>Ngày sinh</p>
                        <DatePicker
                            allowClear={false}
                            defaultValue={dayjs(new Date('2000-01-01'))}
                            value={item.dayJs}
                            placeholder={"VD: 19-06-2000"}
                            format="DD-MM-YYYY"
                            className={`p-[9px] `}
                            onChange={item.onDateChange}/>

                    </div>
                    <div className={`flex flex-col w-1/2 pl-2`}>
                        <CustomInput value={item.address}
                                     width={'w-full'}
                                     onChange={(e) => item.setAddress(e.target.value)}
                                     label={'Địa chỉ'}/>
                    </div>
                </div>

                <div className={`flex `}>
                    <div className={`flex flex-col w-1/2 pr-2`}>
                        <p className={`ml-1 mb-1`}>Trình độ học vấn</p>
                        <Select
                            className={`h-[42px]`}
                            value={item.educationLevel}
                            optionFilterProp="label"
                            onChange={item.onEducationLevelChange}
                            options={educationLevelOptions}
                        />

                    </div>
                    <div className={`flex flex-col w-1/2 pl-2`}>
                        <p className={`ml-1 mb-1`}>Giới tính</p>
                        <Select
                            className={`h-[42px]`}
                            value={item.gender}
                            optionFilterProp="label"
                            onChange={item.onGenderChange}
                            options={genderOptions}
                        />
                    </div>
                </div>
                <div className={`flex `}>
                    <div className={`flex flex-col w-full`}>
                        <CustomInput value={item.university}
                                     width={'w-full'}
                                     onChange={(e) => item.setUniversity(e.target.value)}
                                     label={'Trường học'}/>
                    </div>
                </div>
                <div className={`flex w-full mb-4`}>
                    <button
                        onClick={item.handleSignUpDone}
                        className={`w-full hover:bg-green_default text-white font-bold p-2 text-[18px] text-center rounded bg-green_nga`}>Hoàn
                        thành
                    </button>
                </div>

            </div>
        </div>
    )
}

export const CustomInput = (
    {
        labelIcon=null,
        showPlainText=false,
        label,
        value,
        onChange,
        width,
        disable = false,
        allowClear = false,
        type = 'text',
        addBefore='',
        prefix=null,
        autoComplete = '',
        isBoldLabel = false,
        labelStyle ='',
        defaultValue='',
    }
) => {
    return (
        <>
            <div className={`flex gap-1 justify-start items-center`}>
                {labelIcon}
                <p className={`ml-1 ${labelStyle} ${isBoldLabel && 'font-semibold'}`}>{label}</p>
            </div>
            {
                showPlainText ? (
                    <p className={`ml-1 mt-1 p-2 border border-green_default rounded-md font-semibold ${labelStyle}`}>{defaultValue}</p>
                    ) : (
                    <Input
                        autoComplete={autoComplete}
                        defaultValue={defaultValue}
                        addonBefore={addBefore}
                        prefix={prefix}
                        type={type}
                        allowClear={allowClear}
                        disabled={disable}
                        value={value}
                        onChange={onChange}
                        spellCheck={false}
                        className={`p-2 outline-none  rounded border mt-2 ${width}`}/>
                )
            }
        </>
    )
}
export default CompleteProfile;