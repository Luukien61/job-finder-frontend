import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {RiHome4Fill, RiShoppingBag4Fill} from "react-icons/ri";
import {AiFillCloud, AiFillMessage, AiFillSafetyCertificate} from "react-icons/ai";
import {BsFileEarmarkPersonFill, BsFillQuestionCircleFill, BsFillTelephoneFill} from "react-icons/bs";
import {IoMail, IoNotifications, IoWarning} from "react-icons/io5";
import {FaLocationDot} from "react-icons/fa6";
import {IoIosAddCircle} from "react-icons/io";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import Autoplay from "embla-carousel-autoplay";
import {homePage} from "@/url/Url.ts";
import {useNavigate} from "react-router-dom";
import useAuthRedirect from "@/hook/useAuthRedirect.ts";
import {getUserDto, uploadCvToAWS, uploadCvToAWSSpring} from "@/axios/Request.ts";
import {UserResponse} from "@/page/GoogleCode.tsx";
import {toast, ToastContainer} from "react-toastify";
import {UserDtoState} from "@/zustand/AppState.ts";
import FlexStickyLayout, {OnePageCv} from "@/component/AllPagesPDFViewer.tsx";
import {PiFolderUser} from "react-icons/pi";
import {BiSolidLeaf} from "react-icons/bi";
import {CiImageOn} from "react-icons/ci";

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
    savedJobs: number[]; // Set các ID công việc đã lưu
    appliedJobs: number[]; // Set các ID công việc đã ứng tuyển
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
    "Hồ sơ", "Đã lưu", "Đã ứng tuyển", "Tài khoản"
]

const UserProfile = () => {
    const [currentUser, setCurrentUser] = useState<UserDto>();
    const [cv, setCv] = useState<PdfItem[]>([]);
    const navigate = useNavigate();
    const [itemChoose, setItemChoose] = useState<number>(0);
    const [selectCv, setSelectCv] = useState<string>('');
    const [openModal, setOpenModal] = useState<boolean>(false)
    const warningItem: WarningNote[] = []

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
        if (currentUser && currentUser.cv && currentUser.cv.length > 0) {
            const pdfItem: PdfItem[] = currentUser.cv.map((item) => {
                const urlItem = item.split('/')
                const fileName = urlItem[urlItem.length - 1].replace('.pdf', '').replace('%20',' ')
                return {
                    item: item,
                    fileName: fileName
                }
            })
            setCv(pdfItem)
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
    const handleUploadCv = async (e: ChangeEvent<HTMLInputElement>) => {
        console.log("Handle file")
        const file = e.target.files[0]
        if (file && currentUser) {
            try {
                const formData = new FormData();
                formData.append('file', file);
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
        e.target.value=''
    }

    return (
        <div className={`flex`}>
            <div className={`h-fit fixed min-h-screen w-[270px] bg-white flex`}>
                <div className={`flex flex-col pt-4 bg-green_sidebar w-[80px]`}>
                    <div className={`w-full flex justify-center `}>
                        <a href={homePage}>
                            <img className={`w-10 mx-0 aspect-square`} src={'/public/logo.png'} alt={"logo"}/>
                        </a>

                    </div>
                    <div className={`flex flex-col gap-8 mt-10`}>
                        <div onClick={() => setItemChoose(0)}
                             className={`w-full flex h-8 justify-center cursor-pointer `}>
                            <RiHome4Fill size={32} fill={`${itemChoose == 0 ? 'white' : 'black'}`}/>
                        </div>
                        <div onClick={() => setItemChoose(1)}
                             className={`w-full flex h-8 justify-center cursor-pointer `}>
                            <AiFillCloud size={32} fill={`${itemChoose == 1 ? 'white' : 'black'}`}/>
                        </div>
                        <div onClick={() => setItemChoose(2)}
                             className={`w-full flex h-8 justify-center cursor-pointer `}>
                            <AiFillSafetyCertificate size={32} fill={`${itemChoose == 2 ? 'white' : 'black'}`}/>
                        </div>
                        <div onClick={() => setItemChoose(3)}
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
                                     onClick={() => setItemChoose(index)}
                                     className={`w-full flex opacity-70 h-12 justify-start pl-4 cursor-pointer hover:bg-green_light items-center ${itemChoose == index ? 'bg-green_light' : 'bg-white'}`}>
                                    <p className={`font-bold`}>{item}</p>
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>
            <div className={`ml-[270px] w-[calc(100vw-270px)] flex flex-col relative overflow-y-visible min-h-screen`}>
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
                <div className={`my-6 flex-1 flex mx-6 gap-x-6 relative overflow-y-visible min-h-screen `}>
                    <div className={`flex flex-col w-[67%] `}>
                        <div className={`flex flex-col gap-12 rounded-xl min-h-[calc(100vh-100px)] bg-white p-6`}>
                            {/*info*/}
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
                            <div className={`flex flex-col gap-12`}>
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

                                    <div className={`mx-10 flex gap-10`}>
                                        {/*cv item*/}

                                        {
                                            currentUser && cv && cv.map((value, index) => (
                                                <div onClick={() => handleCvClick(value.item)}
                                                     className={`rounded bg-white w-fit relative overflow-hidden cursor-pointer group`}>
                                                    <OnePageCv key={index} url={value.item}/>
                                                    <div
                                                        className={`absolute flex items-end pl-2 w-full z-10 h-full bottom-0 bg-gradient-to-b from-transparent to-[#283545]`}>
                                                        <p className={`text-white font-bold`}>{value.fileName}</p>
                                                    </div>
                                                </div>

                                            ))
                                        }


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                            delay: 2000
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
            <div onClick={handleCloseModel}
                 className={`backdrop-blur-sm bg-black bg-opacity-60 flex  overflow-hidden fixed inset-0 z-50 justify-center items-center w-full h-full max-h-full ${openModal ? "block" : "hidden"}`}>
                <div onClick={event => handleModalClicks(event)}
                     className="relative p-4 max-w-[60%] max-h-full">
                    <div
                        className="relative bg-[#f5f5f5]  rounded-lg flex items-center justify-center min-h-60 shadow ">
                        <div className={`overflow-hidden `}>
                            <div
                                className="bg-white overflow-y-auto border-b rounded-xl shadow p-5 px-0 relative z-10 min-h-4 ">
                                <FlexStickyLayout url={selectCv}/>
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


export default UserProfile;