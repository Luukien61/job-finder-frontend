import React, {useEffect, useState} from "react";
import {JobDetailProps} from "@/info/ApplicationType.ts";
import {getCompanyJobStatistics, getJobDetailById} from "@/axios/Request.ts";
import {notification, Table, TableColumnsType, Tooltip} from "antd";
import {toast} from "react-toastify";

interface JobDetailStatistic {
    id: number;
    title: string;
    creatDate: Date;
    expireDate: Date;
    quantity: number;
    applicants: number;
    accepted: number
}




export const EmployerJobs = () => {

    const [jobDetail, setJobDetail] = useState<JobDetailProps>()
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);


    const columns: TableColumnsType<JobDetailStatistic> = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            ellipsis: {
                showTitle: false,
            },
            render: (title, record) => (
                <Tooltip placement="topLeft" title={title}>
                    <a >{title}</a>
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
            width: 150,
            sorter: (a, b) => new Date(b.creatDate).getTime() - new Date(a.creatDate).getTime(),
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expireDate',
            align: "center",
            key: 'expireDate',
            width: 150,
            sorter: (a, b) => new Date(b.expireDate).getTime() - new Date(a.expireDate).getTime(),

        },
        {
            title: 'Số lượng tuyển',
            dataIndex: 'quantity',
            align: "center",
            key: 'quantity',
            width: 100,
        },
        {
            title: 'Đơn ứng tuyển',
            dataIndex: 'applicants',
            align: "center",
            key: 'applicants',
            width: 100,
        },
        {
            title: 'Chấp nhận',
            dataIndex: 'accepted',
            align: "center",
            key: 'accepted',
            width: 100,
        },
    ];
    const [detailStatisticJob, setDetailStatisticJob] = useState<JobDetailStatistic[]>([]);
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

    const openViewDetails = async (jobId: number) => {
        getJobDetail(jobId)

    }

    const fetchJobStatistics = async (companyId: string) => {
        try{
            const result : JobDetailStatistic[] = await getCompanyJobStatistics(companyId)
            if(result){
                setDetailStatisticJob(result)
            }
        }catch (e: any) {
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
                    className={` flex flex-col  transition-all duration-300 overflow-y-auto overflow-x-auto h-[calc(100vh-50px)] min-h-[500px] gap-0  rounded-lg bg-white`}>
                    <Table<JobDetailStatistic>
                        sticky={true}
                        columns={columns}
                        bordered={true}
                        pagination={false}
                        dataSource={detailStatisticJob}
                    />
                </div>

            </div>
        </>
    )
}