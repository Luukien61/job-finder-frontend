import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {RiHome4Fill, RiShoppingBag4Fill} from "react-icons/ri";
import {AiFillCloud, AiFillMessage, AiFillSafetyCertificate} from "react-icons/ai";
import {BsFileEarmarkPersonFill, BsFillQuestionCircleFill, BsFillTelephoneFill} from "react-icons/bs";
import {IoMail, IoNotifications} from "react-icons/io5";
import {FaLocationDot} from "react-icons/fa6";
import {IoIosAddCircle} from "react-icons/io";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import Autoplay from "embla-carousel-autoplay";
import {homePage} from "@/url/Url.ts";
import {Outlet, Route, Router, Routes, useNavigate} from "react-router-dom";
import useAuthRedirect from "@/hook/useAuthRedirect.ts";
import {
    deleteCvById,
    getAllSavedJobsByUserId,
    getAppliedJobsByUserId,
    getUserDto, sendAccountVerification,
    uploadCvToAWSSpring
} from "@/axios/Request.ts";
import {UserResponse} from "@/page/GoogleCode.tsx";
import {toast, ToastContainer} from "react-toastify";
import FlexStickyLayout, {OnePageCv} from "@/component/AllPagesPDFViewer.tsx";
import {MdDelete} from "react-icons/md";
import {Button, Input, Spin} from "antd";
import {JobWidthCard, JobWidthCardProps} from "@/page/JobDetail.tsx";
import {BiSolidEdit} from "react-icons/bi";


export interface UserDto {
    userId: string;
    name: string;
    avatar: string;
    email: string;
    address: string;
    password: string;
    phone: string;
    university: string;
    dateOfBirth: string; // Hoặc `Date` nếu cần kiểu Date
    gender: string;
    role: string;
    cv: string[]; // Danh sách URL hoặc đường dẫn CV
    savedJobs: JobWidthCardProps[]; // Set các ID công việc đã lưu
    appliedJobs: JobWidthCardProps[]; // Set các ID công việc đã ứng tuyển
    searchHistory: string[]; // Danh sách các lịch sử tìm kiếm
}

const note = [
    "Nội dung mô tả công việc sơ sài, không đồng nhất với công việc thực tế",
    "Hứa hẹn \"việc nhẹ lương cao\", không cần bỏ nhiều công sức dễ dàng lấy tiền \"khủng\"",
    "Yêu cầu tải app, nạp tiền, làm nhiệm vụ",
    "Yêu cầu nộp phí phỏng vấn, phí giữ chỗ...",
    "Yêu cầu ký kết giấy tờ không rõ ràng hoặc nộp giấy tờ gốc",
    "Địa điểm phỏng vấn bất bình thường"
]
type WarningNote = {
    img: string,
    note: string,
}
type PdfItem = {
    item: string,
    fileName: string,
}

const sideBarItem = [
    {
        title: "Hồ sơ",
        url: ''
    },
    {
        title: "Đã lưu",
        url: 'saved'
    },
    {
        title: "Đã ứng tuyển",
        url: 'applied'
    },
    {
        title: "Tài khoản",
        url: 'account'
    }

]

const UserProfile = () => {
    const [currentUser, setCurrentUser] = useState<UserDto>();
    const navigate = useNavigate();
    const [itemChoose, setItemChoose] = useState<number>(0);
    const warningItem: WarningNote[] = []
    const [isLoading, setIsLoading] = useState<boolean>(true);
    for (let i = 1; i < 7; i++) {
        const item: WarningNote = {
            img: `/public/warning/${i}.webp`,
            note: note[i - 1],
        }
        warningItem.push(item)
    }
    useAuthRedirect()

    const getUserInfo = async () => {
        const logInUser: UserResponse = JSON.parse(localStorage.getItem("user"));
        if (logInUser) {
            try {
                const userInfo: UserDto = await getUserDto(logInUser.userId);
                if (userInfo) {
                    setCurrentUser(userInfo);
                } else {
                    toast.error("An error occurred.");
                    localStorage.clear()
                    navigate("/login");
                }
                setIsLoading(false);
            } catch (e) {
                toast.error(e.response.data);
                localStorage.clear()
                navigate("/login");
            }

        }
    }

    useEffect(() => {
        getUserInfo()
    }, []);
    const handleItemSidebarClick = (index: number, path: string) => {
        navigate(path)
        setItemChoose(index)

    }

    return (
        <div className={`flex`}>
            {/*sidebar*/}
            <div className={`h-fit fixed min-h-screen w-[270px] bg-white flex`}>
                <div className={`flex flex-col pt-4 bg-green_sidebar w-[80px]`}>
                    <div className={`w-full flex justify-center `}>
                        <a href={homePage}>
                            <img className={`w-10 mx-0 aspect-square`} src={'/public/logo.png'} alt={"logo"}/>
                        </a>

                    </div>
                    <div className={`flex flex-col gap-8 mt-10`}>
                        <div onClick={() => handleItemSidebarClick(0, '')}
                             className={`w-full flex h-8 justify-center cursor-pointer `}>
                            <RiHome4Fill size={32} fill={`${itemChoose == 0 ? 'white' : 'black'}`}/>
                        </div>
                        <div onClick={() => handleItemSidebarClick(1, 'saved')}
                             className={`w-full flex h-8 justify-center cursor-pointer `}>
                            <AiFillCloud size={32} fill={`${itemChoose == 1 ? 'white' : 'black'}`}/>
                        </div>
                        <div onClick={() => handleItemSidebarClick(2, '')}
                             className={`w-full flex h-8 justify-center cursor-pointer `}>
                            <AiFillSafetyCertificate size={32} fill={`${itemChoose == 2 ? 'white' : 'black'}`}/>
                        </div>
                        <div onClick={() => handleItemSidebarClick(3, '')}
                             className={`w-full flex h-8 justify-center cursor-pointer `}>
                            <BsFileEarmarkPersonFill size={32} fill={`${itemChoose == 3 ? 'white' : 'black'}`}/>
                        </div>
                    </div>
                </div>
                <div className={`flex-1 flex flex-col pt-4`}>
                    <div onClick={() => navigate("/")}
                         className={`w-full cursor-pointer flex mb-2 justify-start pl-4`}>
                        <p className={`font-bold text-[24px] font-inter`}>JobFinder</p>
                    </div>
                    <div className={`flex flex-col gap-4 mt-8`}>
                        {
                            sideBarItem.map((item, index) => (
                                <div key={index}
                                     onClick={() => handleItemSidebarClick(index, item.url)}
                                     className={`w-full flex opacity-70 h-12 justify-start pl-4 cursor-pointer hover:bg-green_light items-center ${itemChoose == index ? 'bg-green_light' : 'bg-white'}`}>
                                    <p className={`font-bold`}>{item.title}</p>
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>
            {/*content*/}
            <div className={`ml-[270px] w-[calc(100vw-270px)] flex flex-col relative overflow-y-visible min-h-screen`}>
                {/*header*/}
                <div
                    className={`sticky z-50 top-0 h-[70px] bg-white py-3 px-4 shadow-accent-foreground border-b pr-6 flex gap-6 justify-end items-center`}>
                    <div
                        className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 bg-[#E5F7ED]`}>
                        <IoNotifications size={24} fill={"#00B14F"}/>
                    </div>
                    <div
                        className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 p-1 bg-[#E5F7ED]`}>
                        <AiFillMessage size={24} fill={"#00B14F"}/>
                    </div>
                    <div className={`w-9 cursor-pointer aspect-square rounded-full overflow-y-hidden`}>
                        <img className={`object-cover border-2`} src={currentUser && currentUser.avatar} alt=""/>
                    </div>
                </div>
                {/*content*/}
                <div className={`my-6 flex-1 flex mx-6 gap-x-6 relative overflow-y-visible min-h-screen `}>
                    <div className={`flex flex-col w-[67%] `}>
                        <div className={`rounded-xl min-h-full bg-white p-6`}>
                            <Outlet/>
                        </div>
                    </div>
                    {/*right bar*/}
                    <div
                        className={`w-[calc(33%-24px)] sticky top-0 h-fit bg-white rounded-xl border border-green_default p-5`}>
                        <div className={`flex flex-col gap-4 w-full p-4`}>
                            <div className={`w-full flex gap-4 items-center justify-start`}>
                                <BsFillQuestionCircleFill size={24} fill={"green"}/>
                                <p className={`font-bold text-[20px]`}>Bí kíp tìm việc an toàn</p>
                            </div>
                            <div>
                                <p className={`text-[14px] opacity-70`}>Dưới đây là những dấu hiệu của các tổ chức, cá
                                    nhân
                                    tuyển dụng không minh bạch:
                                </p>
                            </div>
                            <div className={`flex flex-col`}>
                                <p className={`text-green_default font-bold`}>1. Dấu hiệu phổ biến:</p>
                                <Carousel
                                    plugins={[
                                        Autoplay({
                                            delay: 3500
                                        }),
                                    ]}
                                    opts={{
                                        loop: true,
                                    }}
                                    className="w-full max-w-xs">
                                    <CarouselContent>
                                        {warningItem.map((item, index) => (
                                            <CarouselItem key={index}>
                                                <div className="p-1">
                                                    <Card>
                                                        <CardContent
                                                            className="aspect-square relative items-center justify-center p-6">
                                                            <img className={`w-[183px] h-[174px]`} src={item.img}
                                                                 alt={""}/>
                                                            <div
                                                                className={`flex items-center justify-center absolute bottom-0 w-[80%]`}>
                                                                <p className={`text-center text-[14px] opacity-70`}>{item.note}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious/>
                                    <CarouselNext/>
                                </Carousel>
                            </div>
                            <div className={`flex flex-col gap-3`}>
                                <p className={`text-green_default font-bold`}>2. Cần làm gì khi gặp việc làm, công ty
                                    không
                                    minh bạch:</p>
                                <p>- Kiểm tra thông tin về công ty, việc làm trước khi ứng tuyển</p>
                                <p>- Báo cáo tin tuyển dụng với JobFinder thông qua nút <span
                                    className={`text-green_default`}>Báo cáo tin tuyển dụng</span> để được hỗ trợ và
                                    giúp
                                    các ứng viên khác tránh được rủi ro</p>
                                <p>- Hoặc liên hệ với JobFinder thông qua kênh hỗ trợ ứng viên của JobFinder:<br/>
                                    Email: <span className={`text-green_default`}>hotro@jobfinder.vn</span><br/>
                                    Hotline: <span className={`text-green_default`}>(024) 6680 5588</span></p>
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


export const UserProfileInfo = () => {
    const [currentUser, setCurrentUser] = useState<UserDto>();
    const [selectCv, setSelectCv] = useState<string>('');
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [cv, setCv] = useState<PdfItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEditAccount, setIsEditAccount] = useState<boolean>(false)
    const [newEmail, setNewEmail] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [verifyPassword, setVerifyPassword] = useState<string>('')
    const [oldPassword, setOldPassword] = useState<string>('')
    const [editAccountSend, setEditAccountSend] = useState<boolean>(false)
    const [verifyCode, setVerifyCode] = useState<string>('')
    const getUserInfo = async () => {
        const logInUser: UserResponse = JSON.parse(localStorage.getItem("user"));
        if (logInUser) {
            try {
                const userInfo: UserDto = await getUserDto(logInUser.userId);
                if (userInfo) {
                    setCurrentUser(userInfo);
                } else {
                    toast.error("An error occurred.");
                    localStorage.clear()
                    navigate("/login");
                }
                setIsLoading(false);
            } catch (e) {
                toast.error(e.response.data);
                localStorage.clear()
                navigate("/login");
            }

        }
    }

    useEffect(() => {
        getUserInfo()
    }, []);
    useEffect(() => {
        if(currentUser){
            setNewEmail(currentUser.email);
            if ( currentUser.cv && currentUser.cv.length > 0) {
                const pdfItem: PdfItem[] = currentUser.cv.map((item) => {
                    const urlItem = item.split('/')
                    const fileName = urlItem[urlItem.length - 1].replace('.pdf', '').replace('%20', ' ')
                    return {
                        item: item,
                        fileName: fileName
                    }
                })
                setCv(pdfItem)
            }
        }

    }, [currentUser]);

    const handleCvClick = (url: string) => {
        setSelectCv(url)
        setOpenModal(true)
    }

    const handleModalClicks = useCallback((event: React.MouseEvent) => {
        event.stopPropagation()
    }, [])
    const handleCloseModel = useCallback(() => {
        setOpenModal(false);
        setSelectCv(null);
    }, [])
    const removeAccents = (str) => {
        const accentMap = {
            'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'đ': 'd',
            'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
        };

        return str.split('')
            .map(char => accentMap[char.toLowerCase()] || char)
            .join('');
    };

    const handleUploadCv = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        if (file && currentUser) {
            setIsLoading(true);
            const originalName = file.name;
            const lastDot = originalName.lastIndexOf('.');
            const nameWithoutExt = originalName.substring(0, lastDot);
            const ext = originalName.substring(lastDot);
            let cleanName = removeAccents(nameWithoutExt)
            cleanName = cleanName.replace(/\s+/g, '-') + ext.toLowerCase()
            try {
                const formData = new FormData();
                const renamedFile = new File([file], cleanName, {type: file.type});
                formData.append('file', renamedFile);
                await uploadCvToAWSSpring(currentUser.userId, formData);
                const userInfo = await getUserDto(currentUser.userId);
                if (userInfo) {
                    setCurrentUser(userInfo);
                }
            } catch (e) {
                toast.error(e);
            }
        } else {
            toast.error("Bạn chưa chọn file nào")
        }
        setIsLoading(false);
        e.target.value = ''
    }
    const handelRemoveCv = async (url: string) => {
        try {
            setIsLoading(true);
            await deleteCvById(currentUser.userId, url)
            const userInfo = await getUserDto(currentUser.userId);
            if (userInfo) {
                setCurrentUser(userInfo);
            }
            setOpenModal(false)
            setSelectCv(null);
            setIsLoading(false);
        } catch (e) {
            toast.error(e);
        }
    }

    const handleSendVerification =async () => {
        setIsLoading(true);
        if(oldPassword && newPassword && verifyPassword && newEmail){
            if(newPassword==verifyPassword){
                try{
                    const code = await sendAccountVerification({
                        userId: currentUser.userId,
                        email: newEmail,
                        oldPassword: oldPassword,
                        newPassword: newPassword

                    })
                    setEditAccountSend(true)
                    if(code) setVerifyCode(code)

                }catch(e){
                    setIsLoading(false);
                    toast.error(e);
                }
            }else {
                setIsLoading(false);
                toast.error("Xác nhận mật khẩu không đúng")
            }
        }else {
            setIsLoading(false);
            toast.error("Vui lòng điền đầy đủ thông tin")
        }
    }
    const handleClearEditAccountRequest =()=>{
        setIsEditAccount(false);
        setNewEmail(currentUser.email);
        setOldPassword('')
        setNewPassword('')
        setVerifyPassword('')
    }
    return (
        <div className={`flex flex-col gap-12`}>
            {/*info*/}
            <div className={`flex flex-col gap-12 `}>
                <div className={`flex gap-4 w-full border-b pb-10`}>
                    <div className={`rounded-full flex items-center`}>
                        {/*avatar*/}
                        <img className={`aspect-square border-2 rounded-full w-[120px] object-contain`}
                             src={currentUser && currentUser.avatar} alt={"logo"}/>
                    </div>
                    <div className={`flex-1 ml-4 flex flex-col`}>
                        <div>
                            <p className={`font-bold text-[28px]`}>{currentUser && currentUser.name}</p>
                        </div>
                        <div className={`grid grid-cols-2 mt-2 gap-8 w-full`}>
                            <div className={`flex flex-col gap-4`}>
                                <div className={`flex gap-3 items-end justify-start`}>
                                    <IoMail className={`mb-1`} size={20}/>
                                    <p className={`opacity-70`}>{currentUser && currentUser.email}</p>
                                </div>
                                <div className={`flex gap-3 items-end justify-start`}>
                                    <FaLocationDot className={`mb-1`} size={20}/>
                                    <p className={`opacity-70`}>{currentUser && currentUser.address || 'Chưa có địa chỉ'}</p>
                                </div>
                            </div>
                            <div className={`flex flex-col gap-4`}>
                                <div className={`flex gap-3 items-end justify-start`}>
                                    <BsFillTelephoneFill className={`mb-1`} size={20}/>
                                    <p className={`opacity-70`}>{currentUser && currentUser.phone || 'Chưa có số điện thoại'}</p>
                                </div>
                                <div className={`flex gap-3 items-end justify-start`}>
                                    <RiShoppingBag4Fill className={`mb-1`} size={20}/>
                                    <p className={`opacity-70`}>{currentUser && currentUser.university || 'Chưa có trường học'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-col gap-24`}>
                    <div className={`flex flex-col gap-4 w-full`}>
                        <div className={`flex gap-4 items-start`}>
                            <h2 className="border-l-[6px] mb-10 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                CV của tôi
                            </h2>
                            <div
                                data-toggle="tooltip"
                                title={"Tải lên CV"}
                                className={`w-fit cursor-pointer hover:scale-110 duration-300 transition-transform`}>
                                <label
                                    className="flex flex-col items-center justify-start w-fit h-full  rounded-lg cursor-pointer  ">
                                    <IoIosAddCircle size={28} fill={"#00B14F"}/>
                                    <input
                                        onChange={handleUploadCv}
                                        id="dropzone-file"
                                        type="file"
                                        accept={'application/pdf'}
                                        multiple={false}
                                        className="hidden outline-none"
                                    />
                                </label>

                            </div>
                        </div>
                        <div className={`mx-10 flex flex-wrap gap-10`}>
                            {/*cv item*/}

                            {
                                currentUser && cv && cv.map((value, index) => (
                                    <div onClick={() => handleCvClick(value.item)}
                                         className={`rounded bg-white w-fit relative overflow-hidden cursor-pointer group`}>
                                        <OnePageCv key={index} url={value.item}/>
                                        <div
                                            className={`absolute flex items-end pl-2 w-full z-10 h-full bottom-0 bg-gradient-to-b from-transparent to-[#283545]`}>
                                            <p className={`text-white line-clamp-3 font-bold`}>{value.fileName}</p>
                                        </div>
                                    </div>

                                ))
                            }


                        </div>
                    </div>
                    <div className={`flex flex-col gap-4 w-full`}>
                        <div className={`w-full flex gap-4 justify-start items-start`}>
                            <h2 className="border-l-[6px] mb-10 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                Tài khoản
                            </h2>
                            <BiSolidEdit
                                onClick={()=>setIsEditAccount(true)}
                                className={`cursor-pointer hover:scale-110 duration-300 transition-transform`}
                                         size={28} fill={"#00B14F"}/>
                        </div>
                        <div className={` rounded-lg bg-white border p-6 shadow-lg`}>
                            {
                                isEditAccount ? (
                                    <div className={`flex flex-col gap-6 w-full`}>
                                        <div className={`flex items-center`}>
                                            <p className={`w-28`}>Email:</p>
                                            <Input className={`w-1/2 p-2`}
                                                   onChange={(e) => setNewEmail(e.target.value)}
                                                   value={newEmail}
                                                   placeholder="Email"/>
                                        </div>
                                        <div className={`flex items-center`}>
                                            <p className={`w-28`}>Mật khẩu cũ:</p>
                                            <Input type={'password'}
                                                   onChange={(e) => setOldPassword(e.target.value)}
                                                   className={`w-1/2 p-2`}
                                                   value={oldPassword}/>
                                        </div>
                                        <div className={`flex items-center`}>
                                            <p className={`w-28`}>Mật khẩu mới:</p>
                                            <Input type={'password'}
                                                   onChange={(e) => setNewPassword(e.target.value)}
                                                   className={`w-1/2 p-2`}
                                                   value={newPassword}/>
                                        </div>
                                        <div className={`flex items-center`}>
                                            <p className={`w-28`}>Xác nhận:</p>
                                            <Input type={'password'}
                                                   onChange={(e) => setVerifyPassword(e.target.value)}
                                                   className={`w-1/2 p-2`}
                                                   value={verifyPassword}/>
                                        </div>
                                        <div className={`w-full p-2 flex justify-end gap-4 items-center`}>
                                            <button
                                                onClick={handleClearEditAccountRequest}
                                                className={`rounded p-2 min-w-24 text-center font-semibold text-white bg-red-500 hover:bg-red-600`}>
                                                Hủy
                                            </button>

                                            <button
                                                onClick={handleSendVerification}
                                                className={`rounded p-2 min-w-24 text-center font-semibold text-white bg-blue-500 hover:bg-blue-600`}>
                                                Hoàn thành
                                            </button>

                                        </div>
                                    </div>
                                ) : (
                                    <div className={`flex flex-col gap-6 w-full`}>
                                        <div className={`flex`}>
                                            <p className={`w-24`}>Email:</p>
                                            <p>{currentUser && currentUser.email}</p>
                                        </div>
                                        <div className={`flex`}>
                                        <p className={`w-24`}>Mật khẩu:</p>
                                            <p>***********</p>
                                        </div>
                                        <div className={`w-full p-2 flex justify-end items-center`}>
                                            <button
                                                className={`rounded p-2 text-center font-semibold text-white bg-red-500 hover:bg-red-600`}>
                                                Đăng xuất
                                            </button>

                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={handleCloseModel}
                 className={`backdrop-blur-sm bg-black bg-opacity-60 flex  overflow-hidden fixed inset-0 z-50 justify-center items-center w-full h-full max-h-full ${openModal ? "block" : "hidden"}`}>
                <div onClick={event => handleModalClicks(event)}
                     className="relative p-4 max-w-[60%] max-h-full">
                    <div
                        className="relative bg-[#f5f5f5]  rounded-lg flex items-center justify-center min-h-60 shadow ">
                        <div className={`overflow-hidden `}>
                            <div
                                className="bg-white flex flex-col gap-3  overflow-y-auto border-b rounded-xl shadow p-5 pt-0 px-0 relative z-10 min-h-4 ">
                                <div className={`w-full flex justify-end py-1 border-b`}>
                                    <MdDelete onClick={() => handelRemoveCv(selectCv)} className={`cursor-pointer`}
                                              size={28} fill={"#00b14f"}/>
                                </div>
                                <FlexStickyLayout url={selectCv}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${isLoading ? 'block' : 'hidden'}`}>
                <Spin size="large" fullscreen={true}/>
            </div>
        </div>
    )
}

export const SavedJobList = () => {
    const user: UserResponse = JSON.parse(localStorage.getItem('user'))
    const [savedJobList, setSavedJobList] = useState<JobWidthCardProps[]>([])

    const fetchSavedJobList = async () => {
        try {
            const savedJobs: JobWidthCardProps[] = await getAllSavedJobsByUserId(user.userId)
            setSavedJobList(savedJobs)
        } catch (e) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại")
        }
    }

    useEffect(() => {
        fetchSavedJobList()
    }, []);

    return (
        <div className={`flex flex-col`}>
            <div className={`w-full`}>
                <h2 className="border-l-[6px] mb-10 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                    Bài đăng đã lưu
                </h2>
            </div>
            <div className={`flex flex-col gap-3 w-full`}>
                {
                    savedJobList.length > 0 ? (
                        <div className={`flex w-full flex-col gap-3`}>
                            {savedJobList.map((value, index) => (
                                <JobWidthCard
                                    key={index}
                                    companyName={value.companyName}
                                    logo={value.logo}
                                    jobId={value.jobId}
                                    companyId={value.companyId}
                                    experience={value.experience}
                                    expireDate={value.expireDate}
                                    location={value.location}
                                    title={value.title}
                                    salary={value.salary}
                                />
                            ))}
                        </div>

                    ) : (
                        <div className={`flex flex-col gap-4  justify-center items-center`}>
                            <img src={'../../public/no-avatar.png'} alt={""}/>
                            <p className={`font-bold `}>Bạn chưa lưu bài viết nào</p>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export const AppliedJobList = () => {
    const user: UserResponse = JSON.parse(localStorage.getItem('user'))
    const [appliedJobs, setAppliedJobs] = useState<JobWidthCardProps[]>([])

    const fetchSavedJobList = async () => {
        try {
            const savedJobs: JobWidthCardProps[] = await getAppliedJobsByUserId(user.userId)
            setAppliedJobs(savedJobs)
        } catch (e) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại")
        }
    }

    useEffect(() => {
        fetchSavedJobList()
    }, []);

    return (
        <div className={`flex flex-col`}>
            <div className={`w-full`}>
                <h2 className="border-l-[6px] mb-10 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                    Bài đăng đã ứng tuyển
                </h2>
            </div>
            <div className={`flex flex-col gap-3 w-full`}>
                {
                    appliedJobs.length > 0 ? (
                        <div className={`flex w-full flex-col gap-3`}>
                            {appliedJobs.map((value, index) => (
                                <JobWidthCard
                                    key={index}
                                    companyName={value.companyName}
                                    logo={value.logo}
                                    jobId={value.jobId}
                                    companyId={value.companyId}
                                    experience={value.experience}
                                    expireDate={value.expireDate}
                                    location={value.location}
                                    title={value.title}
                                    salary={value.salary}
                                />
                            ))}
                        </div>

                    ) : (
                        <div className={`flex flex-col gap-4  justify-center items-center`}>
                            <img src={'../../public/no-avatar.png'} alt={""}/>
                            <p className={`font-bold `}>Bạn chưa ứng tuyển công việc nào</p>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export const Account = () => {
    return (
        <div>

        </div>
    )
}

export default UserProfile;