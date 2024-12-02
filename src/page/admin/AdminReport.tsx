import React, {useEffect, useState} from "react";
import {Avatar, List, Modal, notification, Select, Table, TableColumnsType, Tooltip} from "antd";
import {banCompany, getJobDetailById, getReportDetails, getReportedJobs} from "@/axios/Request.ts";
import {IoCloseCircleSharp} from "react-icons/io5";
import {JobDetailProps} from "@/info/ApplicationType.ts";
import {toast} from "react-toastify";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {convertDate} from "@/service/ApplicationService.ts";
import {IoMdCloseCircle} from "react-icons/io";
import TextArea from "antd/es/input/TextArea";
import {reportOptions} from "@/info/AppInfo.ts";


interface ReportTableColumns {
    key: number;
    companyId: string;
    title: string;
    company: string;
    count: number;
}

interface Reports {
    jobId: number;
    title: string;
    companyId: string;
    companyName: string;
    companyLogo: string;
    reportCount: number;
}

interface ReportDetails {
    id: string;
    email: string;
    avatar: string;
    description: string;
    type: string;
    jobId: number;
    companyId: string;
    title: string;
}

export const AdminReport = () => {
    const [currentJobReports, setCurrentJobReports] = useState<ReportDetails[]>([])
    const [jobDetail, setJobDetail] = useState<JobDetailProps>()
    const [isBanRequest, setIsBanRequest] = useState<boolean>(false)
    const [isViewDetail, setIsViewDetail] = useState<boolean>(false)
    const [isOtherReason, setIsOtherReason] = useState<boolean>(false)
    const [reason, setReason] = useState<string>('Tin rác')
    const fetchReportDetails = async (jobId: number) => {
        try {
            let details: ReportDetails[] = await getReportDetails(jobId);
            if (details && details.length > 0) {
                details = details.map(item => {
                    const splits = item.description.split("-");
                    const type = splits[0]
                    const description = splits[1]
                    return {...item, description: description, type: type, jobId: jobId}
                })
                setCurrentJobReports(details);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const columns: TableColumnsType<ReportTableColumns> = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            ellipsis: {
                showTitle: false,
            },
            render: (title, record) => (
                <Tooltip placement="topLeft" title={title}>
                    <a onClick={() => fetchReportDetails(record.key)}>{title}</a>
                </Tooltip>

            ),
        },
        {
            title: 'Nhà tuyển dụng',
            dataIndex: 'company',
            key: 'company',
            ellipsis: {
                showTitle: false,
            },
            render: (company) => (
                <Tooltip placement="topLeft" title={company}>
                    <a>{company}</a>
                </Tooltip>
            ),
        },
        {
            title: 'Lượt báo cáo',
            dataIndex: 'count',
            align: "center",
            key: 'count',
            width: 100,
        },
    ];
    const [reportedJobs, setReportedJobs] = useState<ReportTableColumns[]>([]);
    const [api, contextHolder] = notification.useNotification();

    const getJobDetail = async (id: number) => {
        try {
            const jobDetail: JobDetailProps = await getJobDetailById(id)
            if (jobDetail) {
                setJobDetail(jobDetail)
            } else {
                toast.error("Có lỗi xảy ra")
            }
        } catch (e: any) {
            toast.error(e.response.data)
        }
    }
    const onExitView = () => {
        setCurrentJobReports([]);
    }
    const openViewDetails = async (jobId: number) => {
        getJobDetail(jobId)
        setIsViewDetail(true)

    }

    const fetchReports = async () => {
        try {
            const reports: Reports[] = await getReportedJobs();
            if (reports) {
                let reportTableData: ReportTableColumns[] = reports.map(report => {
                    return {
                        key: report.jobId,
                        companyId: report.companyId,
                        title: report.title,
                        company: report.companyName,
                        count: report.reportCount
                    };
                })
                reportTableData = reportTableData.sort((a, b) => b.count - a.count)
                setReportedJobs(reportTableData)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const requestBan = () => {
        setIsBanRequest(true)
    }
    const onCloseDetails = () => {
        setIsBanRequest(false)
        setIsViewDetail(false)

    }

    const onBanCancel = () => {
        setIsViewDetail(false)
    }
    const onBan = async () => {
        if (reason) {
            const banRequest = {
                reason: reason,
                title: jobDetail.title,
                createdAt: new Date(),
            }
            try {
                await banCompany(jobDetail.companyId, banRequest);
                await fetchReports()
                setCurrentJobReports(undefined)
                setIsViewDetail(false)

                openSuccessNotification("Bạn đã khóa tài khoản nhà tuyển dụng thành công")
            } catch (error) {
                openErrorNotification("Có lỗi xảy ra, xin vui lòng thử lại sau.")
                console.log(error)
            }
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

    const onReasonChange = (value: string) => {
        setIsOtherReason(value == 'Lý do khác')
        if (value != "Lý do khác") {
            setReason(value)
        } else {
            setReason('')
        }
    }
    useEffect(() => {
        fetchReports()
    }, [])
    return (
        <>
            {contextHolder}
            <div className={`flex p-6 overflow-hidden h-screen`}>
                <div
                    className={` flex flex-col ${currentJobReports && currentJobReports.length > 0 ? 'w-[calc(50%+80px)]' : 'w-full'} transition-all duration-300 overflow-y-auto overflow-x-auto h-[calc(100vh-50px)] min-h-[500px] gap-0  rounded-lg bg-white`}>
                    <Table<ReportTableColumns>
                        sticky={true}
                        columns={columns}
                        bordered={true}
                        pagination={false}
                        dataSource={reportedJobs}
                    />
                </div>
                <div
                    className={`${currentJobReports && currentJobReports.length > 0 ? 'flex-1 pl-4' : 'w-0'} transition-all duration-300`}>
                    <div
                        className={`w-full ${currentJobReports && currentJobReports.length > 0 && 'p-6'} relative  rounded-lg  overflow-y-hidden bg-white min-h-[500px] h-[calc(100vh-50px)]`}>
                        <div className={`flex w-full bg-white justify-end bg-inherit mb-1`}>
                            <div onClick={onExitView}
                                 className={`bg-inherit cursor-pointer right-1`}>
                                <IoCloseCircleSharp className={`cursor-pointer`}
                                                    size={28} fill={"#00b14f"}/>
                            </div>
                        </div>
                        <div className={`h-[90%] overflow-y-auto`}>
                            <List
                                itemLayout="horizontal"
                                dataSource={currentJobReports}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={`${item.avatar}`}/>}
                                            title={item.email}
                                            description={<p><span
                                                className={`font-bold text-gray-600`}>{item.type}: </span>{item.description}
                                            </p>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                        <div className={`flex w-full justify-end items-center pt-3 bg-gray-100`}>
                            <button
                                onClick={() => openViewDetails(currentJobReports[0].jobId)}
                                className={`w-full hover:bg-green-600  rounded bg-green_default py-2 text-white font-bold`}>
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                </div>
                <Modal
                    destroyOnClose={true}
                    footer={null}
                    title="Chi tiết"
                    style={{top: '10px'}}
                    onCancel={onCloseDetails}
                    width={800}
                    closeIcon={<IoMdCloseCircle size={24}
                                                fill={"#00b14f"}/>}
                    open={isViewDetail}>
                    <div
                        className={`flex-1 relative  min-h-[1px]  flex flex-col items-start overflow-visible pl-2`}>
                        <div className={`w-full block  h-fit rounded-md border-2  border-[#acf2cb]  bg-white p-8 pt-4`}>
                            <div className={`flex items-start`}>
                                <p className={`font-semibold text-[20px] line-clamp-2`}>{jobDetail?.title}</p>
                            </div>
                            <div className={`flex gap-3 mt-4 border-b pb-4`}>
                                <div
                                    className={`rounded-[4px] overflow-x-hidden max-w-[50%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                    <p className={`text-text_color text-[13px] truncate font-[500]`}>{jobDetail?.minSalary} - {jobDetail?.maxSalary} triệu</p>
                                </div>
                                <div
                                    className={`rounded-[4px] overflow-x-hidden max-w-[50%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                    <p className={`text-text_color text-[13px] truncate font-[500]`}>{jobDetail?.province}</p>
                                </div>
                                <div
                                    className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                    <p className={`text-text_color text-[13px] truncate font-[500]`}>{jobDetail?.experience} năm</p>
                                </div>
                                <div
                                    className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                    <p className={`text-text_color text-[13px] truncate font-[500]`}>{jobDetail?.workTime}</p>
                                </div>

                            </div>
                            <div
                                className={`${isBanRequest ? 'h-[150px]' : 'h-[400px]'} bg-white transition-all duration-300 overflow-y-auto pr-2 relative`}>
                                <div className={`flex flex-col py-4 gap-[20px] h-fit `}>
                                    <div className={`flex flex-col gap-[16px] `}>
                                        {/*description*/}
                                        <div className={`job_description_item `}>
                                            <h3 className={'tracking-normal'}>Mô tả công việc</h3>
                                            <pre>{jobDetail?.description}</pre>
                                        </div>
                                        {/*requirement*/}
                                        <div className={`job_description_item `}>
                                            <h3 className={'tracking-normal'}>Yêu cầu ứng viên</h3>
                                            <pre className={`break-words`}>{jobDetail?.requirements}</pre>
                                        </div>
                                        {/*benefit*/}
                                        <div className={`job_description_item `}>
                                            <h3 className={'tracking-normal'}>Quyền lợi</h3>
                                            <pre
                                                className={`break-words whitespace-pre-wrap`}>{jobDetail?.benefits}</pre>
                                        </div>
                                        <div className={`job_description_item `}>
                                            <h3 className={'tracking-normal'}>Địa điểm</h3>
                                            <pre className={`break-words`}>
                                            {jobDetail?.location + ', ' + jobDetail?.province}
                                        </pre>
                                        </div>
                                        <div className={`job_description_item `}>
                                            <p>Hạn nộp hồ sơ: <span
                                                className={`font-semibold`}>{convertDate(jobDetail?.expireDate)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full block ${!isBanRequest && 'hidden'} transition-all duration-300 h-fit rounded-md border-2 mt-5  border-[#acf2cb]  bg-white p-8 pt-4`}>
                            <div className={`w-full flex flex-col gap-4`}>
                                <div className={`w-full flex items-center`}>
                                    <p className={`w-24`}>Hành động: </p>
                                    <Select
                                        defaultValue={'ban'}
                                        style={{width: '250px'}}
                                        options={[{value: 'ban', label: "Khóa tài khoản"}]}/>
                                </div>
                                <div className={`w-full flex items-center`}>
                                    <p className={`w-24`}>Vi phạm: </p>
                                    <Select
                                        onChange={onReasonChange}
                                        defaultValue={'Tin rác'}
                                        style={{width: '250px'}}
                                        options={reportOptions}/>
                                </div>
                                <div
                                    className={`w-full ${isOtherReason ? 'h-[80px]' : 'h-0'} transition-all duration-200`}>
                                    {
                                        isOtherReason && (
                                            <TextArea
                                                allowClear={true}
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                showCount={true}
                                                className={'text-14'}
                                                spellCheck={false}
                                                placeholder={'Hoặc cung cấp chi tiết '}
                                                style={{marginBottom: '0px', resize: 'none', zIndex: '0'}}
                                                size={"large"}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex justify-center`}>
                            <div className={`bg-bg_default rounded-b-lg py-2 w-full justify-end px-2 flex gap-6`}>
                                <button
                                    onClick={onBanCancel}
                                    className={`w-fit px-2  mx-3 rounded disabled:opacity-50 disabled:bg-gray-400 transition-all duration-300  min-w-[70px] py-1 text-black opacity-70 hover:bg-gray-100 font-bold`}>
                                    Xác nhận không có gì bất thường
                                </button>
                                {
                                    isBanRequest ? (
                                        <button
                                            onClick={onBan}
                                            className={`w-fit px-2 hover:bg-green-600 disabled:opacity-70 disabled:bg-gray-400 mx-3 transition-all duration-300 rounded bg-green_default py-1 text-white font-bold`}>
                                            Xác nhận
                                        </button>
                                    ) : (
                                        <button
                                            onClick={requestBan}
                                            className={`w-fit px-2 hover:bg-green-600 disabled:opacity-70 disabled:bg-gray-400 mx-3 transition-all duration-300 rounded bg-green_default py-1 text-white font-bold`}>
                                            Khóa tài khoản
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}