import React, {useEffect, useRef, useState} from 'react';
import EmployerHeader from "@/component/employer/EmployerHeader.tsx";
import {AiOutlineGlobal} from "react-icons/ai";
import {PiBuildingOfficeFill, PiCopySimple, PiPhoneLight} from "react-icons/pi";
import ExpandableCard from "@/component/ExpandableCard.tsx";
import {MdLocationPin} from "react-icons/md";
import LocationMap from "@/component/employer/LocationMap.tsx";
import {IoMdAddCircleOutline, IoMdMap} from "react-icons/io";
import Footer from "@/component/Footer.tsx";
import {Avatar, Button, Input, List, notification, Pagination, Space, Tooltip} from "antd";
import {Outlet, useNavigate} from "react-router-dom";
import {
    acceptApplication,
    canPostJob,
    getApplicationsByJobId,
    getCompanyInfo,
    getJobDetailById,
    getJobsByCompanyId,
    getUserBasicInfo,
    rejectApplication
} from "@/axios/Request.ts";
import {
    DefaultPageSize,
    EmployerJobCard,
    JobApplication,
    JobDetailProps,
    PageableResponse
} from "@/info/ApplicationType.ts";
import {convertDate} from "@/service/ApplicationService.ts";
import {toast} from "react-toastify";
import FlexStickyLayout from "@/component/AllPagesPDFViewer.tsx";
import {CustomModal, UserDto} from "@/page/UserProfile.tsx";
import {IoMail} from "react-icons/io5";
import {FaPhoneAlt} from "react-icons/fa";
import {FaLocationDot} from "react-icons/fa6";
import {SiImessage} from "react-icons/si";
import {ImMail} from "react-icons/im";
import {useMessageReceiverState} from "@/zustand/AppState.ts";


const EmployerHome = () => {

    return (
        <div>
            <EmployerHeader/>
            <div className={`w-full flex justify-center`}>
                <div className={`custom-container`}>
                    <Outlet/>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export type CompanyInfo = {
    id: string;
    name: string;
    address: string;
    phone: string;
    website: string;
    logo: string;
    wallpaper: string;
    description: string;
    email: string;
    role: string;

}

export const HomeContent = () => {
    const [currentCompanyId, setCurrentCompanyId] = useState<string>('');
    const [currentCompany, setCurrentCompany] = useState<any>();
    const [isViewJobSide, setIsViewJobSide] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalJobs, setTotalJobs] = useState<number>(0);
    const [jobsCards, setJobsCards] = useState<EmployerJobCard[]>([]);
    const [currentJob, setCurrentJob] = useState<JobDetailProps>();
    const [applicants, setApplicants] = useState<JobApplication[]>([]);
    const [isOpenApplication, setIsOpenApplication] = useState<boolean>(false);
    const [applicant, setApplicant] = useState<UserDto>();
    const [applicationState, setApplicationSate] = useState<string>();
    const [currentAppId, setCurrentAppId] = useState<number>();
    const scrollRef = useRef(null);
    const priorityMap = {
        'PENDING': 0,
        'ACCEPTED': 1,
        'REJECTED': 2
    };
    const {setReceiverId} = useMessageReceiverState()
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message: string) => {
        const key = `open${Date.now()}`;
        api.error({
            message: 'Opp!',
            description: message,
            key,
            showProgress: true,
            onClose: () => {
            },
        });
    };


    const handleGetCompanyInfo = async (id: string) => {
        const response: CompanyInfo = await getCompanyInfo(id);
        setCurrentCompany(response);
    }

    const handleGetJobsByCompanyId = async (id: string, page: number, size = DefaultPageSize) => {
        const response: PageableResponse<EmployerJobCard> = await getJobsByCompanyId(id, page, size);
        if (response) {
            setCurrentPage(response.pageable.pageNumber + 1)
            setTotalJobs(response.totalElements)
            setJobsCards(response.content)
        }

    }
    useEffect(() => {
        const companyId = JSON.parse(localStorage.getItem("company")).id;
        setCurrentCompanyId(companyId);
        handleGetCompanyInfo(companyId);
        handleGetJobsByCompanyId(companyId, 0, DefaultPageSize)
    }, [])
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
            console.error("Failed to copy: ", err);

        }
    }

    const handelJobCardClick = async (jobId: number) => {
        setIsViewJobSide(true);
        try {
            const jobDetail: JobDetailProps = await getJobDetailById(jobId)
            if (jobDetail) {
                setCurrentJob(jobDetail)
                const applicants: JobApplication[] = await getApplicationsByJobId(jobId)
                if (applicants) {

                    const sortedApplications = applicants.sort((a, b) => {
                        return priorityMap[a.state] - priorityMap[b.state];
                    });
                    setApplicants(sortedApplications);
                }
            }

        } catch (e) {
            toast.error("Co loi xay ra")
        }
    }

    const handleApplicantClick = async (userId: string, cvUrl: string, state: string, appId: number) => {
        setIsOpenApplication(true)
        setApplicationSate(state)
        setCurrentAppId(appId)
        try {
            let userInfo: UserDto = await getUserBasicInfo(userId)
            if (userInfo) {
                userInfo = {...userInfo, cv: [cvUrl]};
                setApplicant(userInfo)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const exitApplicantView = () => {
        setIsOpenApplication(false)
        setApplicant(undefined)
        setApplicationSate(undefined)
    }

    const handleAcceptApplication = async (appId: string | number) => {
        try {
            await acceptApplication(appId)
            const newApplicants = applicants.map(item => {
                if (item.id == appId) {
                    item.state = "ACCEPTED"
                }
                return item;
            })
            setApplicants(newApplicants);
            setApplicationSate("ACCEPTED")
            toast.info("Application accepted")
        } catch (err) {
            console.log(err);
        }
    }

    const handleRejectApplication = async (appId: string | number) => {
        try {
            await rejectApplication(appId)
            const newApplicants = applicants.map(item => {
                if (item.id == appId) {
                    item.state = "REJECTED"
                }
                return item;
            })

            setApplicants(newApplicants);
            setApplicationSate("REJECTED")
            toast.info("Application rejected")
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const sortedApplications = applicants.sort((a, b) => {
            return priorityMap[a.state] - priorityMap[b.state];
        });
        setApplicants(sortedApplications);
    }, [applicants]);

    const handleMessageForward = (receiverId: string) => {
        if (receiverId) {
            setReceiverId(receiverId);
            window.open(`/message/${currentCompanyId}`, "_blank", "noopener,noreferrer");
        }
    }

    const onPageNumberChange = async (page: number, size: number) => {
        await handleGetJobsByCompanyId(currentCompanyId, page - 1);
        handleScroll()
    }

    const getCanPostJob = async () => {
        if (currentCompanyId) {
            try {
                const canPost: boolean = await canPostJob(currentCompanyId)
                if (canPost) {
                    window.location.href= `/employer/job/new`
                } else {
                    openNotification("Bạn đã vượt quá số bài đăng hàng tháng.")
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    const handleScroll=()=>{
        if(scrollRef.current){
            const offset = 100; // Khoảng cách cách top (100px)
            const elementTop = scrollRef.current.getBoundingClientRect().top;
            const scrollPosition = window.pageYOffset + elementTop - offset;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
        }
    }

    return (
        <>
            {contextHolder}
            <div className={`flex flex-col mt-10`}>
                {/*banner*/}
                <div className={`w-full rounded-lg overflow-hidden min-h-[358px] bg-gradient-to-green`}>
                    <div className={`h-[224px] overflow-hidden`}>
                        <img
                            alt={currentCompany?.name}
                            className={`h-full object-cover object-center w-full`}
                            src={currentCompany?.wallpaper}/>

                    </div>
                    <div className={`relative`}>
                        <div
                            className={`items-center justify-center left-10 overflow-hidden absolute -top-14 aspect-square bg-white border rounded-full flex h-[180px]`}>
                            <img
                                alt={currentCompany?.name}
                                src={currentCompany?.logo}
                                className={`h-[80%] object-cover aspect-square`}/>

                        </div>

                    </div>
                    <div className={`items-center flex gap-8 my-6 pl-[252px] pr-10 relative`}>
                        <div className={`flex flex-1 flex-col`}>
                            <div>
                                <p className={`text-white line-clamp-2 font-bold leading-7 mb-4 text-[24px]`}>
                                    {currentCompany?.name}
                                </p>
                            </div>
                            <div className={`flex gap-10`}>
                                <div className={`flex gap-2 items-center `}>
                                    <AiOutlineGlobal size={20} fill={"#fff"}/>
                                    <p className={`text-white`}>{currentCompany?.website}</p>
                                </div>

                                <div className={`flex gap-2 items-center `}>
                                    <PiPhoneLight size={20} fill={"#fff"}/>
                                    <p className={`text-white`}>{currentCompany?.phone}</p>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div ref={scrollRef}/>
                <div className={`flex w-full mb-10  relative mt-10 overflow-y-visible `}>
                    {/*left side*/}
                    <div className={`w-[calc(66%-70px)] pr-5 flex flex-col gap-6`}>
                        <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                            <h2 className={`bg-gradient-to-green flex  py-3 px-5  font-semibold leading-7 m-0`}>
                                <p className={`text-white text-18`}>Tuyển dụng</p>
                                <div className={`flex-1 flex justify-end items-center`}>
                                    <Tooltip title="Thêm công việc">
                                        <IoMdAddCircleOutline
                                            onClick={getCanPostJob}
                                            title={'Thêm '} className={`cursor-pointer hover:scale-105 duration-300`}
                                            color={'white'} size={28}/>
                                    </Tooltip>
                                </div>
                            </h2>
                            <div className={` w-full bg-white min-h-[100px] px-6 pt-4 flex-wrap overflow-hidden`}>
                                {
                                    jobsCards.map((item, index) => (
                                        <div className={`relative`} onClick={() => handelJobCardClick(item.jobId)}>
                                            <JobEmployerView
                                                currentJobId={currentJob?.jobId}
                                                job={item} key={index}/>
                                            <div style={{clipPath: "polygon(0 0, 0 100%, 100% 50%)"}}
                                                 className={`absolute ${item.jobId == currentJob?.jobId ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 top-1/2 h-4 transform w-[6px] left-full bg-green_default  -translate-y-1/2`}>

                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className={`flex justify-center py-3`}>
                                <Pagination
                                    onChange={onPageNumberChange}
                                    current={currentPage}
                                    pageSize={DefaultPageSize}
                                    showSizeChanger={false}
                                    total={totalJobs}/>

                            </div>
                        </div>
                        {/*description*/}
                        <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                            <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                                Giới thiệu công ty
                            </h2>
                            <div className={` w-full bg-white min-h-[100px] px-6 pt-4 flex-wrap overflow-hidden`}>
                                {
                                    currentCompany && currentCompany.description ? (
                                        <ExpandableCard children={
                                            <pre>{currentCompany.description}</pre>
                                        }/>
                                    ) : (
                                        <div className={`flex flex-col gap-4 pb-4 justify-center items-center`}>
                                            <img src={'/public/no-avatar.png'} alt={""}/>
                                            <p className={`font-bold `}>Chưa có mô tả</p>
                                        </div>
                                    )
                                }

                            </div>
                        </div>

                    </div>
                    {/*right side*/}
                    <div className={`pl-5 flex-1 flex flex-col gap-6 h-fit sticky top-24`}>
                        <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                            <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                                {isViewJobSide ? 'Chi tiết công việc' : 'Thông tin liên hệ'}
                            </h2>
                            {
                                isViewJobSide ? (
                                    <div className={`flex transition-all duration-500 flex-col py-4 px-4`}>
                                        <h3>
                                            <p className={`font-[600] hover:text-green_default  text-[18px] text-[#212f3f] leading-6 cursor-pointer`}>
                                                {currentJob?.title}
                                            </p>
                                        </h3>
                                        <ExpandableCard
                                            children={<div className={`pt-4`}>
                                                <p className={`font-semibold`}>Yêu cầu ứng viên</p>
                                                <pre>
                                                {currentJob?.requirements}
                                            </pre>
                                                <a href={`/job/detail/${currentJob?.jobId}`}
                                                   className={`text-green_default italic hover:underline cursor-pointer`}>
                                                    Xem chi tiết công việc
                                                </a>
                                            </div>}
                                            high={60}
                                        />
                                        <div className={``}>
                                            <h2 className="border-l-[6px] mb-4 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                                Ứng viên
                                            </h2>
                                            <div className={`max-h-[300px] bg-gray-50 rounded-lg  overflow-y-auto`}>
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={applicants}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            className={`cursor-pointer`}
                                                            onClick={() => handleApplicantClick(item.userId, item.cvUrl, item.state, item.id)}
                                                        >
                                                            <List.Item.Meta
                                                                className={`border py-2 px-1 rounded-lg ${item.state == 'PENDING' ? 'bg-gray-50' : (item.state == 'ACCEPTED' ? ' bg-green-50' : ' bg-red-50')}`}
                                                                avatar={<Avatar size={"large"}
                                                                                src={item?.userAvatar}/>}
                                                                title={<div>
                                                                    <a href="https://ant.design">{item.userName}</a>
                                                                </div>}
                                                                description={
                                                                    <ExpandableCard
                                                                        expandColor={'from-green-50'}
                                                                        expandStyle={'h-fit opacity-70 text-14'}
                                                                        high={70}
                                                                        children={<p>{item?.referenceLetter}</p>}/>
                                                                }
                                                            />
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                            {/*<div className={`w-full p-2 rounded-lg flex justify-center cursor-pointer`}>*/}
                                            {/*    <Button  className={`w-full bg-blue-400 text-white`} size={"large"} variant="solid">*/}
                                            {/*        Hoàn thành*/}
                                            {/*    </Button>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={` w-full flex flex-col gap-4 bg-white min-h-[100px] px-5 py-4`}>
                                        <div className={`flex flex-col gap-2`}>
                                            <div className={`flex gap-3`}>
                                                <MdLocationPin size={24} fill={"#00b14f"}/>
                                                <p>Địa chỉ công ty</p>
                                            </div>
                                            <p className={`opacity-70 ml-2`}>{currentCompany?.address}</p>
                                        </div>
                                        <div className={`flex gap-3`}>
                                            <IoMdMap size={24} fill={"#00b14f"}/>
                                            <p>Xem bản đồ</p>
                                        </div>
                                        <LocationMap
                                            location={currentCompany?.address}
                                        />

                                    </div>
                                )
                            }
                        </div>
                        <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                            <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                                {isViewJobSide ? 'Địa chỉ công ty' : 'Chia sẻ'}
                            </h2>
                            {
                                isViewJobSide ? (
                                    <div
                                        className={` w-full flex flex-col gap-4 transition-all duration-300 bg-white min-h-[100px] px-5 py-4`}>
                                        <div className={`flex flex-col gap-2`}>
                                            <div className={`flex gap-3`}>
                                                <MdLocationPin size={24} fill={"#00b14f"}/>
                                                <p>Địa chỉ công ty</p>
                                            </div>
                                            <p className={`opacity-70 ml-2`}>{currentCompany?.address}</p>
                                        </div>
                                        <div className={`flex gap-3`}>
                                            <IoMdMap size={24} fill={"#00b14f"}/>
                                            <p>Xem bản đồ</p>
                                        </div>
                                        <LocationMap
                                            location={currentCompany?.address}
                                        />

                                    </div>
                                ) : (
                                    <div className={` w-full flex flex-col gap-4 bg-white min-h-[100px] px-5 py-4`}>
                                        <p>Sao chép đường dẫn</p>
                                        <Input
                                            suffix={<PiCopySimple size={20} onClick={handleCopy}
                                                                  className={`cursor-pointer`}
                                                                  fill={"#00b14f"}/>}
                                            contentEditable={false}
                                            value={window.location.href}
                                            variant={'filled'}
                                            readOnly={true}
                                        />
                                        <div className={`mt-3 flex flex-col gap-3`}>
                                            <p>Chia sẻ qua mạng xã hội</p>
                                            <div className={`flex gap-4`}>
                                                <img
                                                    className={`rounded-full cursor-pointer border w-8 p-1 aspect-square object-cover`}
                                                    alt=""
                                                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/facebook.png"/>
                                                <img
                                                    className={`rounded-full cursor-pointer border w-8 p-1 aspect-square`}
                                                    alt="" data-ll-status="loaded"
                                                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/twitter.png"/>
                                                <img
                                                    className={`rounded-full cursor-pointer border w-8 p-1 aspect-square object-cover`}
                                                    alt="" data-ll-status="loaded"
                                                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/linked.png"/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                {
                    isOpenApplication && (
                        <CustomModal
                            handleModalClicks={() => {
                            }}
                            handleCloseModal={exitApplicantView}
                            handleOutModalClick={() => {
                            }}
                            closeOnIcon={true}
                            notMaxWidth={true}
                            bottom={
                                <div className={`bg-bg_default rounded-b-lg py-4 w-full justify-end px-10 flex gap-6`}>
                                    <button
                                        onClick={() => handleRejectApplication(currentAppId)}
                                        disabled={applicationState != 'PENDING'}
                                        className={`w-fit px-2  mx-3 rounded disabled:opacity-50 disabled:bg-gray-400 transition-all duration-300  min-w-[70px] py-2 text-black opacity-70 hover:bg-gray-100 font-bold`}>
                                        Từ chối
                                    </button>
                                    <button
                                        disabled={applicationState != 'PENDING'}
                                        onClick={() => handleAcceptApplication(currentAppId)}
                                        className={`w-fit px-2 hover:bg-green-600 disabled:opacity-70 disabled:bg-gray-400 mx-3 transition-all duration-300 rounded bg-green_default py-2 text-white font-bold`}>
                                        Chấp nhận
                                    </button>
                                </div>
                            }

                            child={
                                <div className={`flex `}>
                                    <div className={`w-96 bg-gray-200 p-4 border-r-2`}>
                                        <div className={`w-full rounded-lg bg-white  flex p-4  flex-col gap-6`}>
                                            <div className={`flex  gap-4 items-center`}>
                                                <img src={applicant?.avatar} alt='avatar'
                                                     className={`rounded-full object-cover aspect-square h-20 border`}/>
                                                <p className={`font-semibold`}>{applicant?.name}</p>
                                            </div>
                                            <div className={`flex flex-col gap-4`}>
                                                <div className={`flex gap-6 overflow-x-hidden`}>
                                                    <div className={``}>
                                                        <IoMail size={20}
                                                                fill={"#00b14f"}/>
                                                    </div>
                                                    <div className={`flex-1 overflow-x-hidden`}>
                                                        <p className={`max-w-[100%-110px] opacity-70 truncate`}>{applicant?.email}</p>

                                                    </div>
                                                </div>
                                                <div className={`flex gap-6 overflow-x-hidden`}>
                                                    <div className={``}>
                                                        <FaPhoneAlt size={20}
                                                                    fill={"#00b14f"}/>
                                                    </div>
                                                    <div className={`flex-1 overflow-x-hidden`}>
                                                        <p className={`max-w-[100%-110px] opacity-70 truncate`}>{applicant?.phone}</p>

                                                    </div>
                                                </div>
                                                <div className={`flex gap-6 overflow-x-hidden`}>
                                                    <div className={``}>
                                                        <FaLocationDot size={20}
                                                                       fill={"#00b14f"}/>
                                                    </div>
                                                    <div className={`flex-1 overflow-x-hidden`}>
                                                        <p className={`max-w-[100%-110px] opacity-70 truncate`}>{applicant?.address}</p>

                                                    </div>
                                                </div>
                                                <div className={`flex gap-6 overflow-x-hidden`}>
                                                    <div className={``}>
                                                        <PiBuildingOfficeFill size={20}
                                                                              fill={"#00b14f"}/>
                                                    </div>
                                                    <div className={`flex-1 overflow-x-hidden`}>
                                                        <p className={`max-w-[100%-110px] opacity-70 truncate`}>{applicant?.university}</p>

                                                    </div>
                                                </div>

                                            </div>
                                            {
                                                applicationState == "ACCEPTED" && (
                                                    <div className={`flex-1 mt-auto flex flex-col justify-end`}>
                                                        <div className={` flex justify-center gap-6`}>
                                                            <div onClick={() => handleMessageForward(applicant?.id)}
                                                                 className={`w-1/2 bg-gray-50 hover:bg-gray-100 cursor-pointer flex justify-center p-2 rounded-lg border bg-`}>
                                                                <div>
                                                                    <SiImessage size={28}
                                                                                fill={"#00b14f"}/>
                                                                </div>
                                                            </div>
                                                            <a href={`mailto:${applicant?.email}`} target="_blank"
                                                               className={`w-1/2 flex bg-gray-50 justify-center hover:bg-gray-100 p-2 cursor-pointer rounded-lg border bg-`}>
                                                                <div>
                                                                    <ImMail size={28}
                                                                            fill={"#00b14f"}/>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div
                                        className="bg-white flex flex-col overflow-x-hidden gap-3  overflow-y-auto border-b rounded-xl shadow p-5 pt-0 px-0 relative z-10 min-h-4 ">
                                        <FlexStickyLayout
                                            url={applicant?.cv[0]}/>

                                    </div>

                                </div>
                            }

                        />
                    )
                }
            </div>
        </>
    )
}

export default EmployerHome;

type JobEmployerViewProps = {
    job: EmployerJobCard,
    currentJobId: number

}

const JobEmployerView: React.FC<JobEmployerViewProps> = (item) => {
    const [job, setJob] = useState<EmployerJobCard>(item.job)
    const [applications, setApplications] = useState<JobApplication[]>([])
    const currentDate = new Date();
    const [isExpiry, setIsExpiry] = useState<boolean>(false);


    useEffect(() => {
        setJob(item.job)
        setApplications(item.job.applications)
        setIsExpiry(new Date(job?.expireDate) < currentDate)
    }, [item]);
    return (
        <div
            className={`rounded-[8px] relative ${job.jobId == item.currentJobId ? 'border border-solid border-green_default bg-white drop-shadow-lg' : ''} hover:border hover:border-solid ${new Date(job?.expireDate) > currentDate ? ' hover:border-green_default bg-highlight_default' : ' hover:border-red-500 bg-red-50 border'}  w-full   cursor-pointer flex gap-[16px] m-auto mb-[16px] p-[12px] relative transition-colors duration-300`}>
            {/*company logo*/}
            <div
                className={`flex items-center w-[105px] bg-white border-solid border border-[#e9eaec] rounded-[8px] h-[120px] m-auto object-contain p-2 relative `}>
                <a className={` block overflow-hidden bg-white`}
                   target={"_blank"}
                   href={''}>
                    <img
                        src={item.job.logo}
                        className="object-contain align-middle overflow-clip cursor-pointer w-[85px] h-[102px]"
                        alt={job.title}
                        title={job.title}/>
                </a>
            </div>
            {/*card body*/}
            <div className={`flex-1`}>
                <div className={`flex flex-col h-full`}>
                    <div className={`mb-auto`}>
                        <div className={`flex `}>
                            <div
                                className={`flex flex-col w-full max-w-[490px] gap-2 overflow-hidden`}>
                                <h3>

                                    <p className={`font-[600] hover:text-green_default  text-[18px] truncate text-[#212f3f] leading-6 cursor-pointer`}>
                                        {job.title} </p>

                                </h3>
                                <div className={`w-full`}>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/*candidates*/}
                    <div className={`flex gap-1 justify-start items-center`}>
                        <p>Ứng viên: </p>
                        <ul className={`flex m-0 flex-wrap`}>
                            <Avatar.Group
                                max={{
                                    count: 1,
                                    style: {
                                        color: '#f56a00',
                                        backgroundColor: '#fde3cf',
                                        width: '24px',
                                        height: '24px'
                                    },
                                }}
                            >
                                {
                                    applications.map((item, index) => (
                                        <Avatar size={"small"} src={item.userAvatar} key={index}/>
                                    ))
                                }
                            </Avatar.Group>


                        </ul>
                    </div>
                    <div
                        className={`mt-auto flex items-end justify-between py-2`}>
                        <div className={`flex gap-4`}>
                            <div className={`rounded-[5px] bg-white  py-1 px-2 flex items-center justify-center`}>
                                <p className={`text-black text-[14px] truncate `}>Hạn:
                                    <span className={`font-semibold`}> {convertDate(job.expireDate)}</span></p>
                            </div>
                            {/*<div className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>*/}
                            {/*    <p className={`text-black text-[14px] truncate `}>Trạng thái: {job.state}</p>*/}
                            {/*</div>*/}

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}