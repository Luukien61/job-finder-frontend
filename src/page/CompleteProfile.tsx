import React, {ChangeEvent, useEffect, useState} from 'react';
import {DatePickerProps, Select} from 'antd';
import {DatePicker} from 'antd';
import {UserCreationState} from "@/zustand/AppState.ts";
import {SlCamera} from "react-icons/sl";
import {UserSignupResponse} from "@/page/SignUp.tsx";


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
    const {user} = UserCreationState()

    useEffect(() => {
        if (user) {
            setAvatar(user.avatar)
            setEmail(user.email)
        }
        else {
            const localUser : UserSignupResponse = JSON.parse(localStorage.getItem('user'));
            setAvatar(localUser.avatar)
            setEmail(localUser.email)
        }
    }, [])

    const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (typeof dateString === 'string') {
            const [day, month, year] = dateString.split("-").map(Number);
            const dateOfBirth = new Date(year, month - 1, day)
            setDate(dateOfBirth);
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

    return (
        <div>
            <div className={`w-full pb-10`}>
                <img className={`w-full absolute`} src={`https://jobsgo.vn/media/import_cv/background_import_cv.png`}
                     alt={`bg-cv`}/>
                <div className={`relative max-w-[1190px] m-auto items-center  flex justify-center `}>
                    <div className={`w-[75%] rounded pb-6 shadow-2xl mt-10 flex flex-col gap-4 bg-white`}>
                        <div className={``}>

                        </div>
                        <div className={`flex items-center relative justify-center w-full`}>
                            <div className={`relative w-[150px] aspect-square`}>
                                <img alt={`avatar`} src={avatar}
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
                                            onChange={handleAvatarUpload}
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
                                <CustomInput value={name}
                                             width={'w-full'}
                                             onChange={(e) => setName(e.target.value)}
                                             label={'Họ và tên'}/>
                            </div>
                            <div className={`flex `}>
                                <div className={`flex flex-col w-1/2 pr-2`}>
                                    <CustomInput value={email}
                                                 width={'w-full'}
                                                 onChange={(e) => setEmail(e.target.value)}
                                                 label={'Email'}/>
                                </div>
                                <div className={`flex flex-col w-1/2 pl-2`}>
                                    <CustomInput value={phone}
                                                 width={'w-full'}
                                                 onChange={(e) => setPhone(e.target.value)}
                                                 label={'Số điện thoại'}/>
                                </div>
                            </div>
                            <div className={`flex `}>
                                <div className={`flex flex-col w-1/2 pr-2`}>
                                    <p className={`ml-1 mb-1`}>Ngày sinh</p>
                                    <DatePicker
                                        placeholder={"Ngày sinh"}
                                        format="DD-MM-YYYY"
                                        className={`p-[9px]`}
                                        onChange={onDateChange}/>

                                </div>
                                <div className={`flex flex-col w-1/2 pl-2`}>
                                    <CustomInput value={address}
                                                 width={'w-full'}
                                                 onChange={(e) => setAddress(e.target.value)}
                                                 label={'Địa chỉ'}/>
                                </div>
                            </div>

                            <div className={`flex `}>
                                <div className={`flex flex-col w-1/2 pr-2`}>
                                    <p className={`ml-1 mb-1`}>Trình độ học vấn</p>
                                    <Select
                                        className={`h-[42px]`}
                                        value={educationLevel}
                                        optionFilterProp="label"
                                        onChange={onEducationLevelChange}
                                        options={educationLevelOptions}
                                    />

                                </div>
                                <div className={`flex flex-col w-1/2 pl-2`}>
                                    <p className={`ml-1 mb-1`}>Giới tính</p>
                                    <Select
                                        className={`h-[42px]`}
                                        value={gender}
                                        optionFilterProp="label"
                                        onChange={onGenderChange}
                                        options={genderOptions}
                                    />
                                </div>
                            </div>
                            <div className={`flex `}>
                                <div className={`flex flex-col w-full pl-2`}>
                                    <CustomInput value={university}
                                                 width={'w-full'}
                                                 onChange={(e) => setUniversity(e.target.value)}
                                                 label={'Trường học'}/>
                                </div>
                            </div>
                            <div className={`flex w-full mt-4`}>
                                <button
                                    className={`w-full hover:bg-green_default text-white font-bold p-2 text-[18px] text-center rounded bg-green_nga`}>Hoàn
                                    thành
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};


const CustomInput = ({label, value, onChange, width}) => {
    return (
        <>
            <p className={`ml-1`}>{label}</p>
            <input
                value={value}
                onChange={onChange}
                spellCheck={false}
                className={`p-2 outline-none rounded border mt-1 ${width}`}/>
        </>
    )
}
export default CompleteProfile;