import React, {useEffect, useState} from 'react';
import {SearchBar} from "@/component/Content.tsx";
import {Pagination, Select} from "antd";
import {experienceFilter, provinces_2, salaryFilters, sortFilter} from "@/info/AppInfo.ts";
import {CiFilter} from "react-icons/ci";
import {LiaSortAlphaDownSolid} from "react-icons/lia";
import {JobWidthCard, JobWidthCardProps} from "@/page/JobDetail.tsx";
import {BsFillQuestionCircleFill} from "react-icons/bs";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import Autoplay from "embla-carousel-autoplay";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {note, WarningNote} from "@/page/UserProfile.tsx";
import {
    DefaultPageSize, DefaultRecommendationPageSize,
    JobDetailProps,
    JobSearchResult,
    PageableResponse,
    SearchProps
} from "@/info/ApplicationType.ts";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {IoCloseCircleSharp} from "react-icons/io5";
import {useLocation, useNavigate} from "react-router-dom";
import {getJobDetailById, getNewJobs, getRecommendedJob, searchJobs} from "@/axios/Request.ts";
import {convertDate, createSearchParams} from "@/service/ApplicationService.ts";
import {toast} from "react-toastify";
import {FaBrain} from "react-icons/fa";

const JobSearch = () => {

    const [isQuickView, setIsQuickView] = useState<boolean>(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [job, setJob] = useState<JobDetailProps>()
    const [recommendJobs, setRecommendJobs] = useState([]);
    const [headerName, setHeaderName] = useState<string>("Gợi ý từ Finder AI");

    const [keyword, setKeyword] = useState<string | null>(queryParams.get('keyword'));
    const [locationParam, setLocationParam] = useState<string | null>(queryParams.get('location'));
    const [minSalary, setMinSalary] = useState<number | null>(queryParams.has('minSalary') ? parseInt(queryParams.get('minSalary')!) : null);
    const [maxSalary, setMaxSalary] = useState<number | null>(queryParams.has('maxSalary') ? parseInt(queryParams.get('maxSalary')!) : null);
    const [experience, setExperience] = useState<number | null>(queryParams.has('experience') ? parseInt(queryParams.get('experience')!) : null);
    const [page, setPage] = useState<number | null>(queryParams.has('page') ? parseInt(queryParams.get('page')!) : 0);
    const [size, setSize] = useState<number | null>(queryParams.has('size') ? parseInt(queryParams.get('size')!) : DefaultPageSize);
    const [sort, setSort] = useState<string | null>(queryParams.get('sort') || 'create-date')
    const [order, setOrder] = useState<string | null>(queryParams.get('order') || 'desc')
    const [jobResult, setJobResult] = useState<JobSearchResult[]>([])
    const [pageableResult, setPageableResult] = useState<PageableResponse<JobSearchResult>>()
    const navigate = useNavigate();
    const [totalElements, setTotalElements] = useState<number>(undefined)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const user = JSON.parse(localStorage.getItem("user"));


    const fetchJobs = async (userId: string | null) => {
        try {
            const searchParams: string = handleCreateParamUrl()
            let headers = null
            if (userId) {
                headers = {
                    headers: {
                        "X-custom-userId": userId
                    }
                }
            }
            const jobSearchResult: PageableResponse<JobSearchResult> = await searchJobs(searchParams, headers);
            setJobResult(jobSearchResult.content)
            setPageableResult(jobSearchResult)
            setTotalElements(jobSearchResult.totalElements)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setKeyword(queryParams.get('keyword'));
        setLocationParam(queryParams.get('location'));
        setMinSalary(queryParams.has('minSalary') ? parseInt(queryParams.get('minSalary')!) : null);
        setMaxSalary(queryParams.has('maxSalary') ? parseInt(queryParams.get('maxSalary')!) : null);
        setExperience(queryParams.has('experience') ? parseInt(queryParams.get('experience')!) : null);
        setPage(queryParams.has('page') ? parseInt(queryParams.get('page')!) : 0)
        setSize(queryParams.has('size') ? parseInt(queryParams.get('size')!) : DefaultPageSize);
        setSort(queryParams.get('sort') || 'create-date');
        setOrder(queryParams.get('order') || 'desc');
        let userId = null
        if (user && user.id) {
            userId = user.id;
        }
        fetchJobs(userId);
        fetchRecommendJobs()
    }, [location.search]);

    const fetchRecommendJobs = async () => {
        if (user && user.id) {
            const job = await getRecommendedJob({userId: user.id})
            setRecommendJobs(job)
            setHeaderName("Gợi ý từ Finder AI")
        } else {
            fetchNewJobs(0)
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
            }
        } catch (e) {
            console.log(e)
        }

    }


    const handleCreateParamUrl = (): string => {
        const params: SearchProps = {
            keyword: keyword,
            location: locationParam,
            page: page,
            size: size,
            minSalary: minSalary,
            maxSalary: maxSalary,
            experience: experience,
            sort: sort,
            order: order,
        }
        return createSearchParams(params);
    }

    useEffect(() => {
        const searchParam: string = handleCreateParamUrl()
        navigate(`/search?${searchParam}`)
    }, [page, size, keyword, locationParam, experience, maxSalary, minSalary, sort, order]);


    const warningItem: WarningNote[] = []
    for (let i = 1; i < 7; i++) {
        const item: WarningNote = {
            img: `/public/warning/${i}.webp`,
            note: note[i - 1],
        }
        warningItem.push(item)
    }

    useEffect(() => {
        if (jobResult.length == 0) {
            handleExitQuickView()
        }
    }, [jobResult.length]);

    const handleQuickViewClick = (event: React.MouseEvent, id: number) => {
        event.stopPropagation()
        getJobDetail(id)
        setIsQuickView(true);
    }
    const handleExitQuickView = () => {
        setIsQuickView(false);
    }
    const onPageNumberChange = (page: any) => {
        setPage(page - 1)
    }

    const getJobDetail = async (id: number) => {
        try {
            const jobDetail: JobDetailProps = await getJobDetailById(id)
            if (jobDetail) {
                setJob(jobDetail)
            } else {
                toast.error("Có lỗi xảy ra")
            }
        } catch (e: any) {
            toast.error(e.response.data)
        }
    }

    const handleGoJobDetail = (id: number) => {
        window.location.href = `/job/detail/${id}`
    }
    const handleLocationChange = (value: string) => {
        setLocationParam(value)
    }

    const handleSalaryChange = (_value: any, option: ({ value: number, range: number[], label: string } | {
        value: number,
        range: number[],
        label: string
    }[])) => {
        if (!Array.isArray(option)) {
            const minSalary: number = option.range[0]
            let maxSalary: number = undefined
            if (option.range.length == 2) {
                maxSalary = option.range[1]
            }
            setMinSalary(minSalary)
            setMaxSalary(maxSalary)
        }
    }

    const clearSalary = () => {
        setMaxSalary(undefined)
        setMinSalary(undefined)
    }

    const handleExperienceChange = (value: any, option: ({ year: number, label: string, value: string } | {
        year: number,
        label: string,
        value: string
    }[])) => {
        if (!Array.isArray(option)) {
            setExperience(option.year)
        }
    }

    const clearExperience = () => {
        setExperience(undefined)
    }

    const handleSortChange = (
        _value: any, option: ({ value: string, label: string, sort: string, order: string } | {
            value: string,
            label: string,
            sort: string,
            order: string
        }[])
    ) => {
        if (!Array.isArray(option)) {
            setSort(option.sort)
            setOrder(option.order)
        }
    }

    const handleClearFilter = () => {
        setSort(undefined)
        setOrder(undefined)
    }

    const defaultSortValue = () => {
        return sortFilter.filter(item => {
            return item.value == `${sort}:${order}`
        })
    }

    const defaultSalaryRange = () => {
        return salaryFilters.filter(item => {
            return item.value == minSalary
        })
    }

    return (
        <div>
            <div className={`w-full relative flex justify-center mb-4 bg-[#19734E]`}>
                <div className={`custom-container py-2 sticky top-0`}>
                    <SearchBar/>
                </div>
            </div>
            <div className={`flex justify-center`}>
                <div className={`w-[1170px] `}>
                    <div className={`w-full flex flex-col gap-3`}>
                        <div className={`flex w-full gap-4`}>
                            <div className={` flex justify-start gap-1 items-center px-4 p-1`}>

                                <p className={`font-semibold line-clamp-1`}>Bộ lọc</p>
                                <CiFilter size={20}
                                          fill={"#00b14f"}/>
                            </div>
                            <div className={` flex gap-3 `}>
                                <div>
                                    <Select
                                        style={{width: '160px'}}
                                        defaultValue={locationParam || 'Toàn quốc'}
                                        className={`w-fit`}
                                        size={"large"}
                                        onChange={handleLocationChange}
                                        options={provinces_2}
                                    />
                                </div>
                                <div>
                                    <Select
                                        allowClear={true}
                                        defaultValue={defaultSalaryRange}
                                        onClear={clearSalary}
                                        onChange={handleSalaryChange}
                                        style={{width: '160px'}}
                                        placeholder={'Mức lương'}
                                        className={`w-fit`}
                                        size={"large"}
                                        options={salaryFilters}
                                    />
                                </div>
                                <div>
                                    <Select
                                        onChange={handleExperienceChange}
                                        onClear={clearExperience}
                                        allowClear={true}
                                        style={{width: '160px'}}
                                        placeholder={'Kinh nghiệm'}
                                        defaultValue={experience && (experience < 6 ? `${experience} năm` : 'Trên 5 năm')}
                                        className={`w-fit`}
                                        size={"large"}
                                        options={experienceFilter}
                                    />
                                </div>
                            </div>
                            <div className={`border-l border-black pl-6 flex `}>
                                <div className={`flex gap-4`}>
                                    <div className={`flex items-center gap-1`}>
                                        <p className={`font-semibold line-clamp-1`}>Hiển thị theo</p>
                                        <LiaSortAlphaDownSolid size={20}
                                                               fill={"#00b14f"}/>
                                    </div>
                                    <div>
                                        <Select
                                            allowClear={true}
                                            onChange={handleSortChange}
                                            onClear={handleClearFilter}
                                            style={{width: '180px'}}
                                            defaultValue={defaultSortValue}
                                            placeholder={'Sắp xếp'}
                                            className={`w-fit`}
                                            size={"large"}
                                            options={sortFilter}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex pb-10 transition-transform duration-300`}>
                            {
                                isQuickView ? (
                                    <div className={`w-full flex mt-3`}>
                                        {/*left*/}
                                        <div className={`w-[438px] pr-4  flex-shrink-0 relative`}>
                                            <div>
                                                {
                                                    jobResult.map((value, index) => (
                                                        <SideViewJobCard
                                                            createDate={value.createDate}
                                                            onQuickViewClick={handleQuickViewClick}
                                                            key={index}
                                                            companyName={value.companyName}
                                                            logo={value.logo}
                                                            jobId={value.id}
                                                            companyId={value.companyId}
                                                            experience={value.experience}
                                                            expireDate={value.expiryDate}
                                                            province={value.location}
                                                            title={value.title}
                                                            minSalary={value.minSalary}
                                                            maxSalary={value.maxSalary}
                                                            currentJobSelectedId={job?.jobId}
                                                            index={index}
                                                            quickView={false}
                                                            handleQuickViewClick={(e) => handleQuickViewClick(e, value.id)}
                                                        />
                                                    ))
                                                }
                                            </div>
                                            <div className={`mt-4 rounded-md bg-white py-4 px-3`}>
                                                <div className={`flex gap-4 pt-4 items-center mb-6`}>
                                                    <p className={`font-bold text-[20px] text-green-500`}>{headerName}</p>
                                                    <FaBrain size={24} fill={"#00b14f"}/>
                                                </div>
                                                {
                                                    recommendJobs.map((value, index) => (
                                                        <SideViewJobCard
                                                            createDate={value.createDate}
                                                            onQuickViewClick={handleQuickViewClick}
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
                                                            currentJobSelectedId={job?.jobId}
                                                            index={index}
                                                            quickView={false}
                                                            handleQuickViewClick={(e) => handleQuickViewClick(e, value.jobId)}
                                                        />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        {/*right*/}
                                        <div
                                            className={`flex-1 relative  min-h-[1px]  flex items-start overflow-visible pl-2`}>
                                            <div
                                                className={`w-full block sticky top-[100px] h-fit rounded-md border-2  border-[#acf2cb]  bg-white p-8 pt-4`}>
                                                <div className={`flex items-start`}>
                                                    <p className={`font-semibold text-[20px] line-clamp-2`}>{job?.title}</p>
                                                    <div className={`flex-1 flex justify-end`}>
                                                        <IoCloseCircleSharp onClick={handleExitQuickView}
                                                                            className={`cursor-pointer`} size={28}
                                                                            fill={"#00b14f"}/>
                                                    </div>
                                                </div>
                                                <div className={`flex gap-3 mt-4 border-b pb-4`}>
                                                    <div
                                                        className={`rounded-[4px] overflow-x-hidden max-w-[50%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                        <p className={`text-text_color text-[13px] truncate font-[500]`}>{job?.minSalary} - {job?.maxSalary} triệu</p>
                                                    </div>
                                                    <div
                                                        className={`rounded-[4px] overflow-x-hidden max-w-[50%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                        <p className={`text-text_color text-[13px] truncate font-[500]`}>{job?.province}</p>
                                                    </div>
                                                    <div
                                                        className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                        <p className={`text-text_color text-[13px] truncate font-[500]`}>{job?.experience} năm</p>
                                                    </div>
                                                    <div
                                                        className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                        <p className={`text-text_color text-[13px] truncate font-[500]`}>{job?.workTime}</p>
                                                    </div>
                                                    <div onClick={() => handleGoJobDetail(job?.jobId)}
                                                         className={`flex flex-1 justify-end items-center cursor-pointer`}>
                                                        <p className={`text-green_default hover:underline font-semibold`}>Xem
                                                            chi tiết</p>
                                                        <MdKeyboardDoubleArrowRight className={`cursor-pointer`}
                                                                                    size={28}
                                                                                    fill={"#00b14f"}/>
                                                    </div>
                                                </div>
                                                <div className={`h-[438px] bg-white overflow-y-auto pr-2 relative`}>
                                                    <div className={`flex flex-col py-4 gap-[20px] h-fit `}>
                                                        <div className={`flex flex-col gap-[16px] `}>
                                                            {/*description*/}
                                                            <div className={`job_description_item `}>
                                                                <h3 className={'tracking-normal'}>Mô tả công việc</h3>
                                                                <pre>{job?.description}</pre>
                                                            </div>
                                                            {/*requirement*/}
                                                            <div className={`job_description_item `}>
                                                                <h3 className={'tracking-normal'}>Yêu cầu ứng viên</h3>
                                                                <pre className={`break-words`}>{job?.requirements}</pre>
                                                            </div>
                                                            {/*benefit*/}
                                                            <div className={`job_description_item `}>
                                                                <h3 className={'tracking-normal'}>Quyền lợi</h3>
                                                                <pre
                                                                    className={`break-words whitespace-pre-wrap`}>{job?.benefits}</pre>
                                                            </div>
                                                            <div className={`job_description_item `}>
                                                                <h3 className={'tracking-normal'}>Địa điểm</h3>
                                                                <pre className={`break-words`}>
                                                                    {job?.province}
                                                                </pre>
                                                            </div>
                                                            <div className={`job_description_item `}>
                                                                <p>Hạn nộp hồ sơ: <span
                                                                    className={`font-semibold`}>{convertDate(job?.expireDate)}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <div className={`w-full flex`}>
                                        <div className={`w-[70%] pr-4 relative`}>
                                            <div className={`py-2 flex flex-col gap-3`}>
                                                <div className={`flex w-full flex-col bg-white px-6 py-6 rounded-md`}>
                                                    {
                                                        jobResult.length > 0 ? (
                                                            <div>
                                                                <div>
                                                                    {jobResult.map((value, index) => (
                                                                        <JobWidthCard
                                                                            createDate={value.createDate}
                                                                            onQuickViewClick={handleQuickViewClick}
                                                                            key={index}
                                                                            companyName={value.companyName}
                                                                            logo={value.logo}
                                                                            jobId={value.id}
                                                                            companyId={value.companyId}
                                                                            experience={value.experience}
                                                                            expireDate={value.expiryDate}
                                                                            province={value.location}
                                                                            title={value.title}
                                                                            minSalary={value.minSalary}
                                                                            maxSalary={value.maxSalary}
                                                                            quickView={true}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <div
                                                                    className={`w-full flex justify-center items-center`}>
                                                                    <Pagination
                                                                        onChange={onPageNumberChange}
                                                                        current={page + 1}
                                                                        pageSize={DefaultPageSize}
                                                                        showSizeChanger={false}
                                                                        total={totalElements}/>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className={`flex items-center justify-center`}>
                                                                    <img alt={"No result found"} className={`h-52`}
                                                                         src={'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/job-list/none-result.png'}/>
                                                                </div>
                                                                <div
                                                                    className={`w-full flex justify-center items-center`}>
                                                                    <p className={`opacity-70 text-text_color text-14`}>Chưa
                                                                        tìm thấy việc làm phù hợp với yêu cầu của
                                                                        bạn</p>

                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className={`py-2 flex flex-col gap-3`}>
                                                <div className={`flex w-full flex-col bg-white px-6 py-6 rounded-md`}>
                                                    <div className={`flex gap-4 pt-4 items-center mb-6`}>
                                                        <p className={`font-bold text-[20px] text-green-500`}>{headerName}</p>
                                                        <FaBrain size={24} fill={"#00b14f"}/>
                                                    </div>
                                                    {
                                                        recommendJobs.length > 0 ? (
                                                            <div>
                                                                <div>
                                                                    {recommendJobs.map((value, index) => (
                                                                        <JobWidthCard
                                                                            createDate={value.createDate}
                                                                            onQuickViewClick={handleQuickViewClick}
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
                                                                    ))}
                                                                </div>
                                                                {/*<div*/}
                                                                {/*    className={`w-full flex justify-center items-center`}>*/}
                                                                {/*    <Pagination*/}
                                                                {/*        onChange={onPageNumberChange}*/}
                                                                {/*        current={page + 1}*/}
                                                                {/*        pageSize={DefaultPageSize}*/}
                                                                {/*        showSizeChanger={false}*/}
                                                                {/*        total={totalElements}/>*/}
                                                                {/*</div>*/}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div className={`flex items-center justify-center`}>
                                                                    <img alt={"No result found"} className={`h-52`}
                                                                         src={'https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/job-list/none-result.png'}/>
                                                                </div>
                                                                <div
                                                                    className={`w-full flex justify-center items-center`}>
                                                                    <p className={`opacity-70 text-text_color text-14`}>Chưa
                                                                        tìm thấy việc làm phù hợp với yêu cầu của
                                                                        bạn</p>

                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {/*right side*/}
                                        <div
                                            className={`w-[30%] relative min-h-[1px] py-2 flex items-start overflow-visible pl-2`}>
                                            <div className={`block sticky top-[90px] w-full h-fit`}>
                                                <div
                                                    className={`w-full bg-white rounded-xl border border-green_default p-5`}>
                                                    <div className={`flex flex-col gap-4 w-full p-4`}>
                                                        <div className={`w-full flex gap-4 items-center justify-start`}>
                                                            <BsFillQuestionCircleFill size={24} fill={"green"}/>
                                                            <p className={`font-bold text-[16px]`}>Bí kíp tìm việc an
                                                                toàn</p>
                                                        </div>
                                                        <div>
                                                            <p className={`text-[14px] opacity-70`}>Dưới đây là những
                                                                dấu hiệu
                                                                của
                                                                các tổ chức, cá
                                                                nhân
                                                                tuyển dụng không minh bạch:
                                                            </p>
                                                        </div>
                                                        <div className={`flex flex-col`}>
                                                            <p className={`text-green_default font-bold`}>1. Dấu hiệu
                                                                phổ
                                                                biến:</p>
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
                                                                                        <img
                                                                                            className={`w-[183px] h-[174px]`}
                                                                                            src={item.img}
                                                                                            alt={""}/>
                                                                                        <div
                                                                                            className={`flex items-center justify-center absolute bottom-0 w-[80%]`}>
                                                                                            <p className={`text-center text-[12px] opacity-70`}>{item.note}</p>
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
                                                        <div className={`flex flex-col gap-3 *:text-14`}>
                                                            <p className={`text-green_default font-bold !text-16`}>2.
                                                                Cần làm gì
                                                                khi gặp việc
                                                                làm, công ty
                                                                không
                                                                minh bạch:</p>
                                                            <p>- Kiểm tra thông tin về công ty, việc làm trước khi ứng
                                                                tuyển</p>
                                                            <p>- Báo cáo tin tuyển dụng với JobFinder thông qua
                                                                nút <span
                                                                    className={`text-green_default text-14`}>Báo cáo tin tuyển dụng</span> để
                                                                được hỗ trợ và
                                                                giúp
                                                                các ứng viên khác tránh được rủi ro</p>
                                                            <p>- Hoặc liên hệ với JobFinder thông qua kênh hỗ trợ ứng
                                                                viên của
                                                                JobFinder:<br/>
                                                                Email: <span
                                                                    className={`text-green_default`}>hotro@jobfinder.vn</span><br/>
                                                                Hotline: <span
                                                                    className={`text-green_default`}>(024) 6680 5588</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

type SideCardJobProps = JobWidthCardProps & {
    index: number;
    currentJobSelectedId: number;
    handleQuickViewClick: (e) => void
}

const SideViewJobCard: React.FC<SideCardJobProps> = (value) => {
    return (
        <div key={value.index}
             className={`rounded-[8px] ${value.jobId == value.currentJobSelectedId ? 'bg-highlight_default' : 'bg-white'} transition-colors duration-300 group mb-4 outline outline-2 outline-[#acf2cb] group hover:outline-none hover:border relative hover:border-solid hover:border-green_default   w-full cursor-pointer flex items-start gap-[16px] m-auto p-[12px]`}>
            {/*company logo*/}
            <div
                className={`flex items-start w-[105px] bg-white border-solid border border-[#e9eaec] rounded-[8px] h-[120px]  object-contain p-2 relative `}>
                <a className={` block overflow-hidden bg-white`}
                   target={"_blank"}
                   href={`/company/${value.companyId}`}>
                    <img
                        src={value.logo}
                        className="object-contain align-middle overflow-clip cursor-pointer w-[85px] h-[102px]"
                        alt={value.companyName}
                        title={value.companyName}/>
                </a>
            </div>
            {/*card body*/}
            <div className={`w-[calc(100%-120px)] `}>
                <div className={`flex flex-col h-full`}>
                    <div className={`mb-auto`}>
                        <div className={`flex `}>
                            <div
                                className={`flex flex-col w-full  gap-2`}>
                                <h3>
                                    <a
                                        target="_self"
                                        href={`/job/detail/${value.jobId}`}>
                                        <p className={`font-[600] hover:text-green_default text-[16px] line-clamp-2  text-[#212f3f] leading-6 cursor-pointer`}>
                                            {value.title}
                                        </p>
                                    </a>
                                </h3>
                                <div className={`w-fit`}>
                                    <a href={`/company/${value.companyId}`}
                                       target="_blank">
                                        <p className={`break-words max-w-full  text-[14px] opacity-70 hover:underline truncate`}>
                                            {value.companyName}
                                        </p>
                                    </a>
                                </div>
                            </div>
                            {/*<div className={`w-1/4 flex justify-end pr-2`}>*/}
                            {/*    <p className={`text-green_default font-bold`}>10 - 15 triệu</p>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className={`w-full flex  pr-2 mt-4 `}>
                        <p className={`text-green_default font-bold`}>{value.minSalary} - {value.maxSalary} triệu</p>
                        <div
                            className={`flex-1 flex justify-end items-center`}>
                            <div
                                onClick={value.handleQuickViewClick}
                                className={`rounded-full flex p-1 border group-hover:opacity-100 opacity-0 transition-opacity duration-300  bg-[#e3faed] items-center  text-[#15bf61]`}>
                                <p className={`text-[12px]`}>Xem</p>
                                <MdKeyboardDoubleArrowRight/>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`mt-auto flex items-end justify-between py-2 w-full`}>
                        <div
                            className={`flex gap-4 overflow-hidden w-full`}>
                            <div
                                className={`rounded-[5px] overflow-x-hidden max-w-[50%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                <p className={`text-black text-[14px] truncate `}>{value.province}</p>
                            </div>
                            <div
                                className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                <p className={`text-black text-[14px] truncate `}>{value.experience} năm</p>
                            </div>

                        </div>
                        {/*<div*/}
                        {/*    className={`bg-white p-1 rounded-full hover:bg-green-300 `}>*/}
                        {/*    <FaRegHeart color={"green"}/>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
            <div style={{clipPath: "polygon(0 0, 0 100%, 100% 50%)"}}
                 className={`absolute ${value.jobId == value.currentJobSelectedId ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 top-1/2 h-4 transform w-[6px] left-full bg-green_default  -translate-y-1/2`}>

            </div>
        </div>
    )
}

export default JobSearch;