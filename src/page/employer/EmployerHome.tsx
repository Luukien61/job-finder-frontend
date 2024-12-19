import React, {useEffect, useRef, useState} from 'react';
import {AiOutlineGlobal} from "react-icons/ai";
import {PiCopySimple, PiPhoneLight} from "react-icons/pi";
import ExpandableCard from "@/component/ExpandableCard.tsx";
import {MdLocationPin} from "react-icons/md";
import LocationMap from "@/component/employer/LocationMap.tsx";
import {IoMdMap} from "react-icons/io";
import {Avatar, Input, notification, Pagination} from "antd";
import {useLocation} from "react-router-dom";
import {getCompanyInfo, getJobsByCompanyId} from "@/axios/Request.ts";
import {
    CompanyPlan, CompanySubscription,
    DefaultPageSize,
    JobApplication,
    JobCardResponse,
    PageableResponse
} from "@/info/ApplicationType.ts";
import {convertDate, fetchCompanyPlan} from "@/service/ApplicationService.ts";
import {JobWidthCard} from "@/page/JobDetail.tsx";


const EmployerHome = () => {
    return (
        <div>
            <div className={`w-full flex justify-center`}>
                <div className={`custom-container`}>
                    <HomeContent/>
                </div>
            </div>
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
    const location = useLocation().pathname;
    const [currentCompanyId, setCurrentCompanyId] = useState<string>('');
    const [currentCompany, setCurrentCompany] = useState<any>();
    const [isViewJobSide, setIsViewJobSide] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalJobs, setTotalJobs] = useState<number>(0);
    const [jobsCards, setJobsCards] = useState<JobCardResponse[]>([]);
    const today = new Date();
    const [companySubscription, setCompanySubscription] = useState<CompanySubscription>();

    const scrollRef = useRef(null);
    const [api, contextHolder] = notification.useNotification();

    const handleGetCompanyPlan = async (id: string) => {
        const plan = await fetchCompanyPlan(id)
        setCompanySubscription(plan)
    }


    const handleGetCompanyInfo = async (id: string) => {
        const response: CompanyInfo = await getCompanyInfo(id);
        setCurrentCompany(response);
    }

    const handleGetJobsByCompanyId = async (id: string, page: number, size = DefaultPageSize) => {
        const response: PageableResponse<JobCardResponse> = await getJobsByCompanyId(id, page, size);
        if (response) {
            setCurrentPage(response.pageable.pageNumber + 1)
            setTotalJobs(response.totalElements)
            setJobsCards(response.content)
        }

    }
    useEffect(() => {
        const paths = location.split('/')
        const companyId = paths[paths.length - 1];
        setCurrentCompanyId(companyId);
        handleGetCompanyInfo(companyId);
        handleGetJobsByCompanyId(companyId, 0, DefaultPageSize)
        handleGetCompanyPlan(companyId)
    }, [location])
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
            console.error("Failed to copy: ", err);

        }
    }


    const onPageNumberChange = async (page: number, size: number) => {
        await handleGetJobsByCompanyId(currentCompanyId, page - 1);
        handleScroll()
    }


    const handleScroll = () => {
        if (scrollRef.current) {
            const offset = 100; // Khoảng cách cách top (100px)
            const elementTop = scrollRef.current.getBoundingClientRect().top;
            const scrollPosition = window.pageYOffset + elementTop - offset;
            window.scrollTo({top: scrollPosition, behavior: "smooth"});
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
                                className={`h-full object-cover aspect-square`}/>
                        </div>

                    </div>
                    <div className={`items-center flex gap-8 my-6 pl-[252px] pr-10 relative`}>
                        <div className={`flex flex-1 flex-col`}>
                            <div className={`flex w-full`}>
                                <p className={`text-white w-[80%] line-clamp-2 font-bold leading-7 mb-4 text-[24px]`}>
                                    {currentCompany?.name}
                                </p>
                                {
                                    (companySubscription && companySubscription.status.toLowerCase()=='active')&&
                                    <div className={`mb-6 flex-1 flex justify-end`}>
                                        <span className={'job-pro-icon drop-shadow hover:scale-105 w-fit cursor-pointer text-14 rounded-md p-2 mr-4'}>{companySubscription?.planName} company</span>
                                    </div>
                                }
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
                                            <p className={`font-bold text-text_color opacity-70`}>Chưa có mô tả</p>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                        {/*jobs*/}
                        <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                            <h2 className={`bg-gradient-to-green flex  py-3 px-5  font-semibold leading-7 m-0`}>
                                <p className={`text-white text-18`}>Tuyển dụng</p>
                            </h2>
                            <div className={` w-full bg-white min-h-[100px] px-6 pt-4 flex-wrap overflow-hidden`}>
                                {
                                    jobsCards.map((value, index) => (
                                        <div className={`relative`}>
                                            <JobWidthCard
                                                createDate={value.createdAt}
                                                key={index}
                                                companyName={value.companyName}
                                                logo={value.logo}
                                                jobId={value.jobId}
                                                companyId={value.companyId}
                                                experience={value.experience}
                                                expireDate={value.expireDate}
                                                province={value.province}
                                                title={value.title}
                                                minSalary={value.minSalary}
                                                maxSalary={value.maxSalary}
                                                quickView={true}
                                            />
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

                    </div>
                    {/*right side*/}
                    <div className={`pl-5 flex-1 flex flex-col gap-6 h-fit sticky top-24`}>
                        <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                            <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                                {isViewJobSide ? 'Chi tiết công việc' : 'Thông tin liên hệ'}
                            </h2>
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
                        </div>
                        <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                            <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                                {isViewJobSide ? 'Địa chỉ công ty' : 'Chia sẻ'}
                            </h2>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EmployerHome;

type JobEmployerViewProps = {
    job: JobCardResponse,
    currentJobId: number

}

const JobEmployerView: React.FC<JobEmployerViewProps> = (item) => {
    const [job, setJob] = useState<JobCardResponse>(item.job)
    const [applications, setApplications] = useState<JobApplication[]>([])
    const currentDate = new Date();
    const [isExpiry, setIsExpiry] = useState<boolean>(false);


    useEffect(() => {
        setJob(item.job)
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