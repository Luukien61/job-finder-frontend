import React, {useEffect, useState} from 'react';
import {GrNext, GrPrevious} from "react-icons/gr";
import {getNewJobs, getRecommendedJob} from "@/axios/Request.ts";
import {JobWidthCardProps} from "@/page/JobDetail.tsx";
import {DefaultRecommendationPageSize, PageableResponse} from "@/info/ApplicationType.ts";
import {Tag} from "antd";
const JobList = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [recommendJobs, setRecommendJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [headerName, setHeaderName] = useState<string>("Việc làm có thể bạn quan tâm");
    const [totalPage, setTotalPage] = useState<number>(0);
    const fetchRecommendJobs = async () => {
        if (user && user.id) {
            const job = await getRecommendedJob({userId: user.id})
            setRecommendJobs(job)
            setHeaderName("Việc làm có thể bạn quan tâm")
        } else {
            fetchNewJobs(currentPage)
        }
    }

    const fetchNewJobs = async (page: number) => {
        try {
            setHeaderName("Việc làm mới nhất")
            const jobs: PageableResponse<JobWidthCardProps> = await getNewJobs(page)
            if (jobs) {
                setRecommendJobs(jobs.content)
                const totalJobs = jobs.totalElements
                const totalPages = totalJobs / DefaultRecommendationPageSize
                setTotalPage(totalPages)
            }
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        fetchRecommendJobs();
    }, [])

    useEffect(() => {
        fetchNewJobs(currentPage)
    }, [currentPage]);

    const onPrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    }

    const onNextClick = () => {
        if (currentPage + 1 <= totalPage - 1) {
            setCurrentPage(currentPage + 1)
        }
    }
    return (
        <div className={`flex relative shadow-xl  flex-col bg-white rounded-2xl  my-3`}>
            <div className={`flex pl-8 rounded-t-2xl  items-center bg-gradient-to-r from-white to-[#e6ffee]`}>
                <p className={`font-bold pt-4 text-[28px] text-green-500`}>{headerName}</p>
                <img alt={""} className={`w-12 aspect-square ml-4`} src={'/public/next-logo.png'}/>
                <div className={`flex-1 flex items-center justify-end`}>
                    <img alt={""} className={`w-16 mr-4 aspect-square`} src={'/public/shiring.png'}/>
                </div>
            </div>
            <div className={`w-[100%] p-4 flex flex-wrap items-center justify-start `}>
                {
                    recommendJobs.map((item, index) =>
                        <JobCard index={index} item={item}/>
                    )
                }

            </div>
            <div className={`flex items-center gap-4 justify-center my-4`}>
                <div onClick={onPrevious}
                     className={`aspect-square group w-8 rounded-full flex items-center cursor-pointer hover:bg-green_default justify-center p-1 border border-green_default `}>
                    <GrPrevious className={`group-hover:text-white text-green_default`}/>
                </div>
                <div onClick={onNextClick}
                     className={`aspect-square group w-8 rounded-full flex items-center cursor-pointer hover:bg-green_default justify-center p-1 border border-green_default `}>
                    <GrNext className={`group-hover:text-white text-green_default`}/>
                </div>
            </div>
        </div>
    );
};

export default JobList;

type JobCardProps = {
    title: string;
    company: string;
    image: string;
    location: string;
    experience: number;
    salary: string;
    role: string;
    quantity: number;
    gender: string;
    report: number;


}

type ImplicitJobCardProps = {
    index: number,
    item: JobWidthCardProps;
}
export const JobCard: React.FC<ImplicitJobCardProps> = (item) => {

    // useEffect(() => {
    //     let timer;
    //     if (isHovered) {
    //         timer = setTimeout(() => {
    //             setShowOtherDiv(true);
    //         }, 10000); // 2 seconds
    //     } else {
    //         clearTimeout(timer);
    //         setShowOtherDiv(false);
    //     }
    //     return () => clearTimeout(timer);
    // }, [isHovered]);
    const onCompanyClick = (e, companyId) => {
        e.stopPropagation()
        window.location.href = `/company/${companyId}`;
    }

    const onJobClick = (jobId) => {
        window.location.href = `/job/detail/${jobId}`;
    }

    const job = item.item

    return (
        <div className={`w-1/3 relative px-3 py-2`}>
            <div onClick={() => onJobClick(job.jobId)}
                 className={`border-green-500 bg-highlight_default shadow cursor-pointer group hover:bg-[#F2FBF6] bg-gray-50/5 border hover:border-green-500 hover:border rounded-xl`}>
                <div className={`w-full h-full flex flex-col  items-start gap-x-[10px] p-[12px]`}>
                    <div className={`w-full justify-start flex gap-3 box-border border-b  h-full`}>
                        <div className={`h-full flex items-center`}>
                            <div
                                className={`bg-white overflow-hidden  transition-transform m-auto w-[96px] aspect-square flex items-center border border-[#dfdfdf] rounded-xl`}>
                                <img
                                    className={`aspect-square w-[80px] group-hover:scale-110 duration-300 object-contain`}
                                    src={job.logo} alt=""/>
                            </div>
                        </div>
                        <div className={`border-b w-[calc(100%-96px)] border-[#dfdfdf] pb-1 overflow-hidden`}>
                            <div className={`flex flex-col gap-y-1 overflow-hidden`}>
                                <p className={`text-green-500 h-12 font-bold  line-clamp-2`}>{job.title}</p>
                                <p onClick={(e) => onCompanyClick(e, job.companyId)}
                                   className={`text-gray-500 w-fit hover:underline h-12 line-clamp-2 font-medium`}>{job.companyName}</p>
                                <div>
                                    <Tag className={`text-18`} color={'red'}>{job.minSalary} - {job.maxSalary} triệu</Tag>
                                </div>
                                {/*<p className={`text-green-500 font-bold text-[17px]`}></p>*/}
                            </div>
                        </div>
                    </div>
                    <div className={`flex gap-x-1 items-center w-full justify-start my-2 overflow-hidden`}>
                        <Tag color={'geekblue'}>{job?.province}</Tag>
                        <Tag color={'geekblue'}>{"Kinh nghiệm: " + job.experience + " năm"}</Tag>

                    </div>
                </div>
            </div>
            {/*    <div className={`z-50  shadow-2xl ${showOtherDiv ? 'block' : 'hidden'} top-0 bottom-0 absolute w-full h-48 bg-white rounded border border-green-500 ${(index + 1) % 3 == 0 ? 'right-full' : 'left-full'}`}>*/}
            {/*        <div className={`w-full h-full flex items-start gap-x-[10px] p-[12px]`}>*/}
            {/*            <div className={`flex `}>*/}
            {/*                <div>*/}

            {/*                </div>*/}

            {/*            </div>*/}
            {/*        </div>*/}


            {/*</div>*/}
        </div>
    )
}