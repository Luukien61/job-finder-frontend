import React, {useEffect, useState} from 'react';
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
import {useNavigate} from "react-router-dom";
import useAuthRedirect from "@/hook/useAuthRedirect.ts";
import {getUserDto} from "@/axios/Request.ts";
import {UserResponse} from "@/page/GoogleCode.tsx";
import {toast, ToastContainer} from "react-toastify";
import {UserDtoState} from "@/zustand/AppState.ts";
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


const UserProfile = () => {
    const {setUser}= UserDtoState()
    const navigate = useNavigate();
    useAuthRedirect()
    const getUserInfo =async () => {
        const logInUser : UserResponse = JSON.parse(localStorage.getItem("user"));
        if(logInUser){
            try{
                const userInfo : UserDto = await getUserDto(logInUser.userId);
                if(userInfo){
                    setUser(userInfo);
                }else {
                    toast.error("An error occurred.");
                    localStorage.clear()
                    navigate("/login");
                }
            }catch(e){
                toast.error(e.response.data);
                localStorage.clear()
                navigate("/login");
            }

        }
    }
    useEffect(() => {
        getUserInfo()
    }, []);
    return (
        <div className={`flex`}>
            <Sidebar/>
            <Content/>
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
const sideBarItem = [
    "Hồ sơ", "Đã lưu", "Đã ứng tuyển", "Tài khoản"
]
const Sidebar = () => {
    const navigate = useNavigate();
    const [itemChoose, setItemChoose] = useState<number>(0);
    return (
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
                <div onClick={()=>navigate("/")}
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
    )
}
const note =[
    "Nội dung mô tả công việc sơ sài, không đồng nhất với công việc thực tế",
    "Hứa hẹn \"việc nhẹ lương cao\", không cần bỏ nhiều công sức dễ dàng lấy tiền \"khủng\"",
    "Yêu cầu tải app, nạp tiền, làm nhiệm vụ",
    "Yêu cầu nộp phí phỏng vấn, phí giữ chỗ...",
    "Yêu cầu ký kết giấy tờ không rõ ràng hoặc nộp giấy tờ gốc",
    "Địa điểm phỏng vấn bất bình thường"
]
type WarningNote ={
    img: string,
    note: string,
}
const Content = () => {
    const {user}=UserDtoState()
    const warningItem : WarningNote[] =[]

    for(let i=1;i<7;i++){
        const item : WarningNote={
            img: `/public/warning/${i}.webp`,
            note: note[i-1],
        }
        warningItem.push(item)
    }
    return (
        <div className={`ml-[270px] w-[calc(100vw-270px)] flex flex-col relative overflow-y-visible min-h-screen`}>
            <Header/>
            <div className={`my-6 flex-1 flex mx-6 gap-x-6 relative overflow-y-visible min-h-screen `}>
                <div className={`flex flex-col w-[67%] `}>
                    <div className={`flex flex-col gap-12 rounded-xl min-h-[calc(100vh-100px)] bg-white p-6`}>
                        {/*info*/}
                        <div className={`flex gap-4 w-full border-b pb-10`}>
                            <div className={`rounded-full flex items-center`}>
                                {/*avatar*/}
                                <img className={`aspect-square rounded-full w-[120px] object-contain`}
                                     src={user&&user.avatar} alt={"logo"}/>
                            </div>
                            <div className={`flex-1 ml-4 flex flex-col`}>
                                <div>
                                    <p className={`font-bold text-[28px]`}>{user&&user.name}</p>
                                </div>
                                <div className={`grid grid-cols-2 mt-2 gap-8 w-full`}>
                                    <div className={`flex flex-col gap-4`}>
                                        <div className={`flex gap-3 items-end justify-start`}>
                                            <IoMail className={`mb-1`} size={20}/>
                                            <p className={`opacity-70`}>{user&&user.email}</p>
                                        </div>
                                        <div className={`flex gap-3 items-end justify-start`}>
                                            <FaLocationDot className={`mb-1`} size={20}/>
                                            <p className={`opacity-70`}>Thanh Xuân, Hà Nội</p>
                                        </div>
                                    </div>
                                    <div className={`flex flex-col gap-4`}>
                                        <div className={`flex gap-3 items-end justify-start`}>
                                            <BsFillTelephoneFill className={`mb-1`} size={20}/>
                                            <p className={`opacity-70`}>0123456789</p>
                                        </div>
                                        <div className={`flex gap-3 items-end justify-start`}>
                                            <RiShoppingBag4Fill className={`mb-1`} size={20}/>
                                            <p className={`opacity-70`}>Học Viện Kỹ Thuật Mật Mã</p>
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
                                        <IoIosAddCircle size={28} fill={"green"}/>
                                    </div>
                                </div>

                                <div className={`mx-10 flex gap-10`}>
                                    {/*cv item*/}
                                    <div
                                        className={`rounded bg-white w-fit relative overflow-hidden cursor-pointer group`}>
                                        <img
                                            alt={"cv"}
                                            className={`w-[195px] h-[265px] max-w-full transition-transform  rounded group-hover:scale-110 duration-300`}
                                            src={`https://snapshot.topcv.vn/cv-online/XAoGAVQHAFYPAAFQBlUAAwQBUQAFVQIFVAdWBge92b/1677502635.webp`}/>
                                        <div
                                            className={`absolute flex items-end pl-2 w-full h-full bottom-0 bg-gradient-to-b from-transparent to-[#283545]`}>
                                            <p className={`text-white font-bold`}>Luu Dinh Kien-CV_1</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`rounded bg-white w-fit relative overflow-hidden cursor-pointer group`}>
                                        <img
                                            alt={"cv"}
                                            className={`w-[195px] h-[265px] max-w-full transition-transform  rounded group-hover:scale-110 duration-300`}
                                            src={`https://snapshot.topcv.vn/cv-online/XAoGAVQHAFYPAAFQBlUAAwQBUQAFVQIFVAdWBge92b/1677502635.webp`}/>
                                        <div
                                            className={`absolute flex items-end pl-2 w-full h-full bottom-0 bg-gradient-to-b from-transparent to-[#283545]`}>
                                            <p className={`text-white font-bold`}>Luu Dinh Kien-CV_1</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*odd CV*/}

                        </div>
                    </div>
                </div>
                <div className={`w-[calc(33%-24px)] sticky top-0 h-fit bg-white rounded-xl border border-green_default p-5`}>
                    <div className={`flex flex-col gap-4 w-full p-4`}>
                        <div className={`w-full flex gap-4 items-center justify-start`}>
                            <BsFillQuestionCircleFill size={24} fill={"green"}/>
                            <p className={`font-bold text-[20px]`}>Bí kíp tìm việc an toàn</p>
                        </div>
                        <div>
                            <p className={`text-[14px] opacity-70`}>Dưới đây là những dấu hiệu của các tổ chức, cá nhân
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
                                                        <img className={`w-[183px] h-[174px]`} src={item.img} alt={""}/>
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
                            <p className={`text-green_default font-bold`}>2. Cần làm gì khi gặp việc làm, công ty không
                                minh bạch:</p>
                            <p>- Kiểm tra thông tin về công ty, việc làm trước khi ứng tuyển</p>
                            <p>- Báo cáo tin tuyển dụng với JobFinder thông qua nút <span
                                className={`text-green_default`}>Báo cáo tin tuyển dụng</span> để được hỗ trợ và giúp
                                các ứng viên khác tránh được rủi ro</p>
                            <p>- Hoặc liên hệ với JobFinder thông qua kênh hỗ trợ ứng viên của JobFinder:<br/>
                                Email: <span className={`text-green_default`}>hotro@jobfinder.vn</span><br/>
                                Hotline: <span className={`text-green_default`}>(024) 6680 5588</span></p>
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
    )
}
const Header = () => {
    const {user}=UserDtoState()
    return (
        <div className={`sticky z-50 top-0 h-[70px] bg-white py-3 px-4 shadow-accent-foreground border-b pr-6 flex gap-6 justify-end items-center`}>
            <div className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 bg-[#E5F7ED]`}>
                <IoNotifications size={24} fill={"#00B14F"}/>
            </div>
            <div className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 p-1 bg-[#E5F7ED]`}>
                <AiFillMessage size={24} fill={"#00B14F"}/>
            </div>
            <div className={`w-9 cursor-pointer aspect-square rounded-full overflow-y-hidden`}>
                <img className={`object-cover`} src={user&&user.avatar} alt="" />
            </div>
        </div>
    )
}
export default UserProfile;