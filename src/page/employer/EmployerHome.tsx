import React, {useCallback, useEffect, useState} from 'react';
import EmployerHeader from "@/component/employer/EmployerHeader.tsx";
import {AiOutlineGlobal} from "react-icons/ai";
import {PiCopySimple, PiPhoneLight} from "react-icons/pi";
import ExpandableCard from "@/component/ExpandableCard.tsx";
import {MdLocationPin} from "react-icons/md";
import LocationMap from "@/component/employer/LocationMap.tsx";
import {IoMdMap} from "react-icons/io";
import Footer from "@/component/Footer.tsx";
import {Avatar, Input, List, Pagination} from "antd";
import {Outlet} from "react-router-dom";
import {getCompanyInfo, getJobsByCompanyId} from "@/axios/Request.ts";
import {TfiMoreAlt} from "react-icons/tfi";
import {DefaultPageSize, EmployerJobCard, JobApplication, PageableResponse} from "@/info/ApplicationType.ts";
import {format} from "date-fns";
import {convertDate} from "@/service/ApplicationService.ts";

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
    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];

    const handleGetCompanyInfo = async (id: string) => {
        const response: CompanyInfo = await getCompanyInfo(id);
        setCurrentCompany(response);
    }

    const handleGetJobsByCompanyId = async (id: string, page: number, size=DefaultPageSize) => {
        const response : PageableResponse<EmployerJobCard>= await getJobsByCompanyId(id, page, size);
        if(response){
            console.log(response);
            setCurrentPage(response.pageable.pageNumber)
            setTotalJobs(response.totalElements)
            setJobsCards(response.content)
        }

    }
    useEffect(() => {
        const companyId = JSON.parse(localStorage.getItem("company")).id;
        setCurrentCompanyId(companyId);
        handleGetCompanyInfo(companyId);
        handleGetJobsByCompanyId(companyId,0,DefaultPageSize)
    }, [])
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
            console.error("Failed to copy: ", err);

        }
    }
    return (
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
            <div className={`flex w-full mb-10  relative mt-10 overflow-y-visible `}>
                {/*left side*/}
                <div className={`w-[calc(66%-70px)] pr-5 flex flex-col gap-6`}>
                    <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                        <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                            Tuyển dụng
                        </h2>
                        <div className={` w-full bg-white min-h-[100px] px-6 pt-4 flex-wrap overflow-hidden`}>
                            {
                                jobsCards.map((item, index) => (
                                    <JobEmployerView job={item} key={index} />
                                ))
                            }
                        </div>
                        <div className={`flex justify-center py-3`}>
                            <Pagination
                                current={1}
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
                            {!isViewJobSide ? 'Chi tiết công việc' : 'Thông tin liên hệ'}
                        </h2>
                        {
                            !isViewJobSide ? (
                                <div className={`flex flex-col py-4 px-4`}>
                                    <h3>
                                        <p className={`font-[600] hover:text-green_default  text-[18px] text-[#212f3f] leading-6 cursor-pointer`}>
                                            Nhân Viên Kế Toán, Thu Nhập 7 - 9
                                            Triệu
                                            (Thanh
                                            Trì - Hà Nội) </p>
                                    </h3>
                                    <ExpandableCard
                                        children={<div className={`pt-4`}>
                                            <p className={`font-semibold`}>Yêu cầu ứng viên</p>
                                            <pre className={`whitespace-pre-wrap break-words`}>
BAO GỒM:

❋ Cà gai leo hỗ trợ điều trị hiệu quả viêm gan A - B - C, tăng cường giải độc gan.

❋ Giảo cổ lam giàu acid amin, vitamin giúp chống oxy hóa, hạ mỡ máu, giảm căng thẳng.

❋ Tỏi đen sản xuất theo công nghệ lên men hiện đại, có khả năng ngăn lão hóa, ngừa ung thư.

❋ Sâm đại quang: Củ sâm đại quang, cây sâm đại quang, cây giống sâm đại quang

❋ Các loại dược liệu khác: Ngưu bàng, thiên nhiên kiện, khôi nhung, khủng khẻng,..


                                            </pre>
                                            <a className={`text-green_default italic hover:underline cursor-pointer`}>
                                                Xem chi tiết công việc
                                            </a>
                                        </div>}
                                        high={60}
                                    />
                                    <div className={``}>
                                        <h2 className="border-l-[6px] mb-4 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                            Ứng viên
                                        </h2>
                                        <div className={`max-h-[300px] overflow-y-auto`}>
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={data}
                                                renderItem={(item, index) => (
                                                    <List.Item>
                                                        <List.Item.Meta
                                                            className={`bg-green-50`}
                                                            avatar={<Avatar size={"large"}
                                                                            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}/>}
                                                            title={<a href="https://ant.design">{item.title}</a>}
                                                            description={
                                                            <ExpandableCard
                                                                expandColor={'from-green-50 h-10 bottom-8'}
                                                                expandStyle={'h-fit opacity-700 text-14'}
                                                                high={120}
                                                                children={<p>Ant Design, a design language for background applications, is refined by Ant UED Team. Ant Design, a design language for background applications, is refined by Ant UED Team</p>}/>
                                                            }
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
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
                            Chia sẻ với bạn bè
                        </h2>
                        <div className={` w-full flex flex-col gap-4 bg-white min-h-[100px] px-5 py-4`}>
                            <p>Sao chép đường dẫn</p>
                            <Input
                                suffix={<PiCopySimple size={20} onClick={handleCopy} className={`cursor-pointer`}
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
                                    <img className={`rounded-full cursor-pointer border w-8 p-1 aspect-square`}
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
            {/*<CustomModal*/}
            {/*    handleModalClicks={() => {*/}
            {/*    }}*/}
            {/*    handleCloseModal={() => {*/}
            {/*    }}*/}
            {/*    handleOutModalClick={() => {*/}
            {/*    }}*/}
            {/*    closeOnIcon={true}*/}
            {/*    notMaxWidth={true}*/}
            {/*    bottom={<div className={`bg-bg_default rounded-b-lg py-4 w-full justify-end px-10 flex gap-6`}>*/}
            {/*        <button*/}
            {/*            className={`w-fit px-2  mx-3 rounded  min-w-[70px] py-2 text-black opacity-70 hover:bg-gray-100 font-bold`}>*/}
            {/*            Từ chối*/}
            {/*        </button>*/}
            {/*        <button*/}
            {/*            className={`w-fit px-2 hover:bg-green-600 mx-3 rounded bg-green_default py-2 text-white font-bold`}>*/}
            {/*            Chấp nhận*/}
            {/*        </button>*/}

            {/*    </div>}*/}
            {/*    child={<div*/}
            {/*        className="bg-white flex flex-col overflow-x-hidden gap-3  overflow-y-auto border-b rounded-xl shadow p-5 pt-0 px-0 relative z-10 min-h-4 ">*/}
            {/*        <FlexStickyLayout*/}
            {/*            url={'https://jobfinder-kienluu.s3.ap-southeast-1.amazonaws.com/Luu-Dinh-Kien--TopCV.vn-291024.172109.pdf'}/>*/}

            {/*    </div>}*/}

            {/*/>*/}
        </div>
    )
}

export default EmployerHome;

type JobEmployerViewProps = {
    job: EmployerJobCard
}

const JobEmployerView :React.FC<JobEmployerViewProps>= (item) => {
    const [job, setJob]= useState<EmployerJobCard>(item.job)
    const [applications, setApplications]=useState<JobApplication[]>([])

    const refineApplications = (items: JobApplication[])=>{
        if(items.length > 0 ){
            items=items.slice(0,3)
            const odd = items[items.length - 1]
            items.push({...odd,
                userName: 'View more',
                userAvatar: 'https://w7.pngwing.com/pngs/602/173/png-transparent-ellipsis-computer-icons-more-miscellaneous-monochrome-black-thumbnail.png'})
        }
        setApplications(items)

    }

    useEffect(() => {
        setJob(item.job)
        refineApplications(item.job.applications)
    }, [item]);
    return (
        <div
            className={`rounded-[8px] hover:border hover:border-solid hover:border-green_default w-full  bg-highlight_default cursor-pointer flex gap-[16px] m-auto mb-[16px] p-[12px] relative transition-transform`}>
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
                            {
                                applications.map((item, index) => (
                                    <li title={item.userName}
                                        className={`h-6 aspect-square`}>
                                        <img
                                            src={item.userAvatar}
                                            className={`h-6 aspect-square object-cover border border-white  rounded-full`} alt=""/>
                                    </li>
                                ))
                            }

                        </ul>
                    </div>
                    <div
                        className={`mt-auto flex items-end justify-between py-2`}>
                        <div className={`flex gap-4`}>
                            <div className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                <p className={`text-black text-[14px] truncate `}>Hạn:
                                    <span className={`font-semibold`}> {convertDate(job.expireDate)}</span></p>
                            </div>
                            <div className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                <p className={`text-black text-[14px] truncate `}>Trạng thái: {job.state}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}