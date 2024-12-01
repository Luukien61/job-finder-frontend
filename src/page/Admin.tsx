import React, {useEffect, useState} from 'react';
import {LuLayoutDashboard} from "react-icons/lu";
import {FaBookOpen, FaUsers} from "react-icons/fa";
import {Menu} from "antd";
import {AiFillMessage} from "react-icons/ai";
import {GrUserNew} from "react-icons/gr";
import {
    Area,
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {
    getCompanyInMonth,
    getEmployeesInMonth,
    getJobsAllFields,
    getJobsIn12Month,
    getUserStatistics
} from "@/axios/Request.ts";
import {UserStatistics} from "@/info/ApplicationType.ts";
import {PiBuildingApartmentBold, PiBuildingApartmentFill} from "react-icons/pi";
import {getLast12Months} from "@/service/ApplicationService.ts";
type UserStatistics12 ={
    "name": string,
    "Ứng viên mới": number
}
type CompanyStatistics12 ={
    "name": string,
    "Nhà tuyển dụng mới": number
}
type JobsStatistics12 ={
    "name": string,
    "Bài đăng": number
}
type JobByFields={
    name: string,
    quantity: number,
}

const Admin = () => {
    const [userStatistic, setUserStatistic] = useState<UserStatistics>();

    const menuItems = [
        {
            key: '1',
            icon: <LuLayoutDashboard size={16} color={'white'}/>,
            label: 'Trang chủ',
        },
        {
            key: '2',
            icon: <FaBookOpen size={16} fill={'white'}/>,
            label: 'Phản ánh',
        },
        {
            key: '3',
            icon: <AiFillMessage size={16} fill={'white'}/>,
            label: 'Tin nhắn',
        },
    ]
    const employeeData = [
        {
            "name": "T1",
            "Ứng viên mới": 2400
        },
        {
            "name": "T2",
            "Ứng viên mới": 1398
        },
        {
            "name": "T3",
            "Ứng viên mới": 9800
        },
        {
            "name": "T4",
            "Ứng viên mới": 3908
        },
        {
            "name": "T5",
            "Ứng viên mới": 4800
        },
        {
            "name": "T6",
            "Ứng viên mới": 3800
        },
        {
            "name": "T7",
            "Ứng viên mới": 4300
        },
        {
            "name": "T8",
            "Ứng viên mới": 4300
        },
        {
            "name": "T9",
            "Ứng viên mới": 4300
        },
        {
            "name": "T10",
            "Ứng viên mới": 4300
        },
        {
            "name": "T11",
            "Ứng viên mới": 4300
        },
        {
            "name": "T12",
            "Ứng viên mới": 4300
        },
    ]
    const jobTotalYear = [
        {
            "name": "T1",
            "Bài đăng": 2400,
        },
        {
            "name": "T2",
            "Bài đăng": 1398,

        },
        {
            "name": "T3",
            "Bài đăng": 9800,
        },
        {
            "name": "T4",
            "Bài đăng": 3908,
        },
        {
            "name": "T5",
            "Bài đăng": 4800,
        },
        {
            "name": "T6",
            "Bài đăng": 3800,
        },
        {
            "name": "T7",
            "Bài đăng": 4300,
        },
        {
            "name": "T8",
            "Bài đăng": 4300,
        },
        {
            "name": "T9",
            "Bài đăng": 4300,
        },
        {
            "name": "T10",
            "Bài đăng": 4300,
        },
        {
            "name": "T11",
            "Bài đăng": 4300,
        },
        {
            "name": "T12",
            "Bài đăng": 4300,
        },
    ]
    const data = [
        {
            "name": "Page A",
            "uv": 4000,
            "pv": 2400,
            "amt": 2400
        },
        {
            "name": "Page B",
            "uv": 3000,
            "pv": 1398,
            "amt": 2210
        },
        {
            "name": "Page C",
            "uv": 2000,
            "pv": 9800,
            "amt": 2290
        },
        {
            "name": "Page D",
            "uv": 2780,
            "pv": 3908,
            "amt": 2000
        },
        {
            "name": "Page E",
            "uv": 1890,
            "pv": 4800,
            "amt": 2181
        },
        {
            "name": "Page F",
            "uv": 2390,
            "pv": 3800,
            "amt": 2500
        },
        {
            "name": "Page G",
            "uv": 3490,
            "pv": 4300,
            "amt": 2100
        }
    ]
    const currentDate = new Date();
    const [userMonths, setUserMonths] = useState<UserStatistics12[]>([]);
    const [companyMonths, setCompanyMonths] = useState<CompanyStatistics12[]>([]);
    const [jobMonths, setJobMonths] = useState<JobsStatistics12[]>([]);
    const [jobByFields, setJobsByFields] = useState<JobByFields[]>([]);
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const fetchUserStatistics = async () => {
        try {
            const userStatistics: UserStatistics = await getUserStatistics(currentMonth, currentYear)
            if (userStatistics) {
                setUserStatistic(userStatistics)
                console.log(userStatistics)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const fetchLast12MonthUserStatistics = async () => {
        const months = getLast12Months();
        try {
            const userMonths = await Promise.all(
                months.map(async (item) => {
                    let month = await getEmployeesInMonth(item.month, item.year)
                    if (!month) {
                        month = 0
                    }
                    return {
                        'name': `T${item.month}`,
                        'Ứng viên mới': month
                    }
                })
            );
            setUserMonths(userMonths);
        } catch (e) {
            console.log(e)
        }
    }
    const fetchLast12MonthCompanyStatistics = async () => {
        const months = getLast12Months();
        try {
            const companyMonths = await Promise.all(
                months.map(async (item) => {
                    let month = await getCompanyInMonth(item.month, item.year)
                    if (!month) {
                        month = 0
                    }
                    return {
                        'name': `T${item.month}`,
                        'Nhà tuyển dụng mới': month
                    }
                })
            );
            setCompanyMonths(companyMonths);
        } catch (e) {
            console.log(e)
        }
    }
    const fetchLast12MonthJobsStatistics = async () => {
        const months = getLast12Months();
        try {
            const jobMonths = await Promise.all(
                months.map(async (item) => {
                    let month = await getJobsIn12Month(item.month, item.year)
                    if (!month) {
                        month = 0
                    }
                    return {
                        'name': `T${item.month}`,
                        'Bài đăng': month
                    }
                })
            );
            setJobMonths(jobMonths);
        } catch (e) {
            console.log(e)
        }
    }
    const fetchJobByFields=async ()=>{
        try{
            const jobFields :JobByFields[]= await getJobsAllFields(11,currentYear)
            setJobsByFields(jobFields);
            console.log(jobFields)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() => {
        fetchUserStatistics()
        fetchLast12MonthUserStatistics()
        fetchLast12MonthCompanyStatistics()
        fetchLast12MonthJobsStatistics()
        fetchJobByFields()
    }, []);


    return (
        <div>
            <div className={` flex`}>
                <div className={`h-fit text-white fixed min-h-screen py-4 px-4 w-[240px] bg-[#222e3c]`}>
                    <div className={`mt-4`}>
                        <div className={`flex justify-start`}>
                            <p className={`font-bold text-[24px]`}>JobFinder</p>
                        </div>
                        <div
                            className={` rounded  bg-inherit pl-2 `}>
                            <div className={`flex gap-4 pt-4 pl-0 `}>
                                <div className={`flex gap-4 rounded-full cursor-pointer`}>
                                    <img
                                        className={`w-[48px] rounded-full aspect-square object-cover`}
                                        src={"https://res.cloudinary.com/dmi3xizxq/image/upload/v1732423764/yp4elkx2acqdx5e4xjci.jpg"}
                                        alt={'avatar'}
                                    />
                                    <div className={`flex flex-col items-start justify-start truncate`}>
                                        <p className={`font-bold text-[18px]`}>Luu Dinh Kien</p>
                                        <p className={`text-[#adb5bd]`}>Admin</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`mt-10`}>
                        <Menu
                            theme="dark"
                            style={{backgroundColor: '#222e3c'}}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            items={menuItems}
                        />
                    </div>
                </div>
                <div className={`ml-[240px]  w-[calc(100vw-240px)]`}>
                    <div className={`w-full px-[60px] py-10`}>
                        <div>
                            <p className={`w-fit font-bold text-[26px] pl-3`}>JobFinder <span
                                className={`font-normal text-[26px]`}>Dashboard</span></p>
                        </div>
                        <div className={`flex w-full`}>
                            <UserStatisticCard statistic={userStatistic?.newMonthUsers}
                                               name={'Ứng viên mới trong tháng'}
                                               icon={<GrUserNew size={20} color={'#3B7DDD'}/>}
                                               previousStatistics={userStatistic?.lastMonthUsers}/>
                            <UserStatisticCard statistic={userStatistic?.totalUsers}
                                               name={'Tổng số ứng viên'}
                                               bottom={"toàn hệ thống"}
                                               icon={<FaUsers size={20} color={'#3B7DDD'}/>}
                            />
                            <UserStatisticCard statistic={userStatistic?.newCompanyUsers}
                                               name={'Nhà tuyển dụng mới trong tháng'}
                                               previousStatistics={userStatistic?.lastCompanyUsers}
                                               icon={<PiBuildingApartmentBold size={20} color={'#3B7DDD'}/>}
                            />
                            <UserStatisticCard statistic={userStatistic?.totalCompanyUsers}
                                               name={'Nhà tuyển dụng '}
                                               bottom={"toàn hệ thống"}
                                               icon={<PiBuildingApartmentFill size={20} color={'#3B7DDD'}/>}
                            />

                        </div>
                        <div className={`flex w-full p-3 `}>
                            <div className={`w-1/2 py-3 px-3 pl-0`}>
                                <div className={`h-[280px] pr-3 py-3 bg-white rounded-lg`}>
                                    <ResponsiveContainer>
                                        <BarChart width={530} height={250} data={userMonths}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis allowDecimals={false}/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Bar dataKey="Ứng viên mới" fill="#8884d8"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                            <div className={`w-1/2 py-3 px-3 pr-0`}>
                                <div className={`h-[280px] py-3 pr-3 bg-white rounded-lg`}>
                                    <ResponsiveContainer>
                                        <BarChart width={530} height={250} data={companyMonths}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                                            <XAxis dataKey="name"/>
                                            <YAxis allowDecimals={false}/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Bar dataKey="Nhà tuyển dụng mới" fill="#82ca9d"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        </div>
                        <div className={`flex w-full p-3`}>
                            <div className={`h-[390px] w-full py-3 flex flex-col gap-0  rounded-lg bg-white`}>
                                <ResponsiveContainer height={350} >
                                    <ComposedChart width={730} height={250} data={jobMonths}
                                                   margin={{top: 5, right: 30, left: 20, bottom: 10}}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                                        <XAxis dataKey="name" label={{ value: 'Tháng', position: 'insideBottomRight', offset: -5 }}/>
                                        <YAxis allowDecimals={false} label={{ value: 'Bài đăng', angle: -90, position: 'insideLeft'}}/>
                                        <Tooltip/>
                                        <defs>
                                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="Bài đăng"
                                            stroke="#82ca9d"
                                            fillOpacity={1}
                                            fill="url(#colorPv)"
                                        />
                                        <Line type="monotone" dataKey="Bài đăng"
                                              strokeWidth={4} stroke="#82ca9d"/>
                                    </ComposedChart>

                                </ResponsiveContainer>
                                <div className={`w-full flex justify-center  items-center`}>
                                    <div className="recharts-legend-item legend-item-0">
                                        <svg className="recharts-surface inline-block mr-3" width="14" height="14"
                                             viewBox="0 0 32 32">
                                            <title></title>
                                            <desc></desc>
                                            <path stroke-width="4" fill="none" stroke="#82ca9d" d="M0,16h10.666666666666666
                                                A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
                                                H32M21.333333333333332,16
                                                A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
                                                  className="recharts-legend-icon"></path>
                                        </svg>
                                        <span className="recharts-legend-item-text text-[#82ca9d]">Bài đăng</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
type UserStatisticsProps = {
    name: string;
    icon: any,
    statistic: number,
    previousStatistics?: number,
    bottom?: any
}

const UserStatisticCard: React.FC<UserStatisticsProps> = (item) => {
    const [percentage, setPercentage] = useState<number>();
    useEffect(() => {
        const previous = item.previousStatistics
        if (previous) {
            const odd = item.statistic - previous;
            const percentage = ((odd / previous) * 100).toFixed(2)
            setPercentage(parseInt(percentage))
        }
    }, [item]);
    return (
        <div className={`p-3 w-1/4`}>
            <div className={`rounded-lg bg-white p-6 h-[200px]`}>
                <div className={`flex items-start`}>
                    <p className={`text-[#939ba2] uppercase font-semibold w-[170px]`}>{item.name}</p>
                    <div className={`flex-1 flex justify-end`}>
                        <div
                            className={`p-3 rounded-full bg-[#d3e2f7] flex items-center justify-center`}>
                            {item.icon}
                        </div>

                    </div>
                </div>
                <div className={`overflow-hidden w-full mt-5`}>
                    <p className={`text-[35px] font-[400] leading-8  ml-1 mb-5 `}>{item.statistic?.toLocaleString('vi-VN')}</p>

                </div>
                {
                    item.previousStatistics ? (
                        <div className={`flex w-full gap-2`}>
                            <div
                                className={`min-w-12 flex justify-center ${percentage >= 0 ? 'bg-[#DCEEE9]' : 'bg-[#F5DEE0]'} rounded-md px-1 py-[2px]`}>
                                <p className={` ${percentage >= 0 ? 'text-[#1cbb8c]' : 'text-[#dc3545]'}`}>{percentage}%</p>

                            </div>
                            <p className={`text-[#939ba2]`}>so với tháng trước</p>

                        </div>
                    ) : (
                        <div className={`flex w-full gap-2 pt-[3px]`}>
                            <p className={`text-[#939ba2]`}>{item.bottom}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}