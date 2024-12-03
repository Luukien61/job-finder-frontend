import React, {useEffect, useRef, useState} from "react";
import {JobApplication, JobDetailProps} from "@/info/ApplicationType.ts";
import {
    acceptApplication,
    getApplicationsByJobId,
    getCompanyJobStatistics,
    getJobDetailById,
    getUserBasicInfo, rejectApplication
} from "@/axios/Request.ts";
import {Avatar, List, notification, Table, TableColumnsType, Tag, Tooltip} from "antd";
import {toast} from "react-toastify";
import {format} from "date-fns";
import {IoCloseCircleSharp, IoMail} from "react-icons/io5";
import ExpandableCard from "@/component/ExpandableCard.tsx";
import {CustomModal, UserDto} from "@/page/UserProfile.tsx";
import {FaPhoneAlt} from "react-icons/fa";
import {FaLocationDot} from "react-icons/fa6";
import {PiBuildingOfficeFill} from "react-icons/pi";
import {SiImessage} from "react-icons/si";
import {ImMail} from "react-icons/im";
import FlexStickyLayout from "@/component/AllPagesPDFViewer.tsx";
import {useMessageReceiverState} from "@/zustand/AppState.ts";

interface JobDetailStatistic {
    id: number;
    title: string;
    creatDate: Date;
    expireDate: Date;
    quantity: number;
    applicants: number;
    pending: number
    accepted: number
}


export const EmployerJobs = () => {
    const [isViewJobSide, setIsViewJobSide] = useState<boolean>(false);
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [currentJob, setCurrentJob] = useState<JobDetailProps>();
    const [applicants, setApplicants] = useState<JobApplication[]>([]);
    const priorityMap = {
        'PENDING': 0,
        'ACCEPTED': 1,
        'REJECTED': 2
    };

    const columns: TableColumnsType<JobDetailStatistic> = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            ellipsis: {
                showTitle: false,
            },
            width: isViewJobSide ? '200px' : '500px',
            render: (title, record) => (
                <Tooltip placement="topLeft" title={title}>
                    <a onClick={() => handelJobCardClick(record.id)}>{title}</a>
                </Tooltip>

            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'creatDate',
            key: 'creatDate',
            ellipsis: {
                showTitle: false,
            },
            hidden: isViewJobSide,
            width: 150,
            render: (date) => (
                <p>{format(date, "dd/MM/yyyy")}</p>
            ),
            sorter: (a, b) => new Date(b.creatDate).getTime() - new Date(a.creatDate).getTime(),
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expireDate',
            align: "center",
            key: 'expireDate',
            hidden: isViewJobSide,
            width: 150,
            render: (date) => (
                <p>{format(date, "dd/MM/yyyy")}</p>
            ),
            sorter: (a, b) => new Date(b.expireDate).getTime() - new Date(a.expireDate).getTime(),

        },
        {
            title: 'Số lượng tuyển',
            dataIndex: 'quantity',
            align: "center",
            key: 'quantity',
            hidden: isViewJobSide,
            width: 100,
        },
        {
            title: 'Đơn ứng tuyển',
            dataIndex: 'applicants',
            align: "center",
            key: 'applicants',
            width: isViewJobSide ? '50px' : '100px',
            render: (text) => (
                <Tag color={'geekblue'}>
                    {text}
                </Tag>
            )
        },
        {
            title: 'Đang chờ',
            dataIndex: 'pending',
            align: "center",
            key: 'pending',
            sorter: (a, b) => b.pending - a.pending,
            width: isViewJobSide ? '50px' : '100px',
            render: (text) => (
                <Tag color={'volcano'}>
                    {text}
                </Tag>
            )
        },

        {
            title: 'Chấp nhận',
            dataIndex: 'accepted',
            align: "center",
            key: 'accepted',
            width: isViewJobSide ? '50px' : '100px',
            render: (text) => (
                <Tag color={'green'}>
                    {text}
                </Tag>
            )
        },
    ];
    const [detailStatisticJob, setDetailStatisticJob] = useState<JobDetailStatistic[]>([]);
    const [api, contextHolder] = notification.useNotification();
    const [isOpenApplication, setIsOpenApplication] = useState<boolean>(false);
    const [applicant, setApplicant] = useState<UserDto>();
    const [applicationState, setApplicationSate] = useState<string>();
    const [currentAppId, setCurrentAppId] = useState<number>();
    const {setReceiverId} = useMessageReceiverState()


    const fetchJobStatistics = async (companyId: string) => {
        try {
            const result: JobDetailStatistic[] = await getCompanyJobStatistics(companyId)
            if (result) {
                setDetailStatisticJob(result)
            }
        } catch (e: any) {
            toast.error(e.response.data)
        }
    }


    const openSuccessNotification = (message: string) => {
        const key = `open${Date.now()}`;
        api.success({
            message: 'Thành công',
            description: message,
            key,
            showProgress: true,
            onClose: () => {
            },
        });
    };

    const openErrorNotification = (message: string) => {
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

    const onExitView = () => {
        setIsViewJobSide(false);
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
            setIsOpenApplication(false)
            setApplicants(newApplicants);
            setApplicationSate("REJECTED")
            toast.info("Application rejected")
        } catch (err) {
            console.log(err);
        }
    }

    const handleMessageForward = (receiverId: string) => {
        if (receiverId) {
            setReceiverId(receiverId);
            window.open(`/message/${currentCompanyId}`, "_blank", "noopener,noreferrer");
        }
    }

    useEffect(() => {
        const company = JSON.parse(localStorage.getItem("company"));
        if (company && company.id) {
            fetchJobStatistics(company.id)
            setCurrentCompanyId(company.id)
        }
    }, [])
    return (
        <>
            {contextHolder}
            <div className={`flex p-6 overflow-hidden h-screen`}>
                <div
                    className={` flex flex-col ${isViewJobSide ? 'w-[calc(50%+80px)]' : 'w-full'} transition-all duration-500 overflow-y-auto overflow-x-auto h-[calc(100vh-50px)] min-h-[500px] gap-0  rounded-lg bg-white`}>
                    <Table<JobDetailStatistic>
                        sticky={true}
                        columns={columns}
                        bordered={true}
                        pagination={false}
                        dataSource={detailStatisticJob}
                    />
                </div>
                <div
                    className={`${isViewJobSide ? 'flex-1 pl-4' : 'w-0'} transition-all duration-500`}>
                    <div
                        className={`w-full ${isViewJobSide && 'p-6'} relative  rounded-lg  overflow-y-hidden bg-white min-h-[500px] h-[calc(100vh-50px)]`}>
                        <div className={`flex w-full flex-col bg-white justify-end bg-inherit mb-1`}>
                            <div className={`w-full flex justify-end `}>
                                <div onClick={onExitView}
                                     className={`bg-inherit cursor-pointer right-1`}>
                                    <IoCloseCircleSharp className={`cursor-pointer`}
                                                        size={28} fill={"#00b14f"}/>
                                </div>
                            </div>

                            <div className={`overflow-hidden`}>
                                <div className={`flex flex-col py-4 px-4 overflow-y-auto h-[calc(100vh-50px)] relative`}>
                                    <h3>
                                        <p className={`font-[600] sticky top-0 hover:text-green_default  text-[18px] text-[#212f3f] leading-6 cursor-pointer`}>
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
                                    <div className={`h-[65%] overflow-y-auto`}>
                                        <h2 className="border-l-[6px] mb-4 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                            Ứng viên
                                        </h2>
                                        <div style={{scrollbarWidth: 'none'}}
                                             className={`h-[90%] overflow-y-auto rounded-lg `}>
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={applicants}
                                                renderItem={(item) => (
                                                    <List.Item
                                                        className={`cursor-pointer`}
                                                        onClick={() => handleApplicantClick(item.userId, item.cvUrl, item.state, item.id)}
                                                    >
                                                        <List.Item.Meta
                                                            className={`border border-solid min-h-20 py-2 px-2 rounded-lg  ${item.state == 'PENDING' ? 'bg-gray-50 border-gray-600' : (item.state == 'ACCEPTED' ? ' bg-green-50 border-green_default' : ' bg-red-50 border-red-600')}`}
                                                            avatar={<Avatar size={"large"}
                                                                            src={item?.userAvatar}/>}
                                                            title={<div>
                                                                <a>{item.userName}</a>
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
                                    </div>
                                </div>
                            </div>
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