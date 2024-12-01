import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {LuLayoutDashboard} from "react-icons/lu";
import {FaBookOpen, FaCaretDown, FaCaretUp, FaSortDown, FaSortUp, FaUsers} from "react-icons/fa";
import {DatePicker, Menu, Select, Table, TableProps} from "antd";
import {AiFillMessage} from "react-icons/ai";
import {GrNext, GrPrevious, GrUserNew} from "react-icons/gr";
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
    ConversationRequest,
    createConversation,
    getAllConversations,
    getCompanyInMonth,
    getCurrentParticipant,
    getDailyJobs,
    getEmployeesInMonth,
    getJobByCompaniesInMonth,
    getJobsAllFields,
    getJobsIn12Month,
    getMessagesByConversationId,
    getParticipant,
    getUserStatistics,
    searchConversationByUserIds
} from "@/axios/Request.ts";
import {UserStatistics} from "@/info/ApplicationType.ts";
import {PiBuildingApartmentBold, PiBuildingApartmentFill} from "react-icons/pi";
import {getLast12Months} from "@/service/ApplicationService.ts";
import {Chart} from "react-google-charts";
import {delay, UserResponse} from "@/page/GoogleCode.tsx";
import {
    ChatMessage,
    client,
    connectWebSocket,
    Conversation,
    Participant,
    sendMessage,
    subscribeToTopic
} from "@/service/WebSocketService.ts";
import {useNavigate} from "react-router-dom";
import {useMessageReceiverState} from "@/zustand/AppState.ts";
import {toast, ToastContainer} from "react-toastify";
import {imageUpload} from "@/service/Upload.ts";
import {homePage} from "@/url/Url.ts";
import {AppInfo} from "@/info/AppInfo.ts";
import VideoCall from "@/component/VideoCall.tsx";
import {CiImageOn} from "react-icons/ci";
import {VscSend} from "react-icons/vsc";
import {QuickMessage} from "@/page/Message.tsx";
import {RangePickerProps} from "antd/es/date-picker";
import dayjs from "dayjs";

type UserStatistics12 = {
    "name": string,
    "Ứng viên mới": number
}
type CompanyStatistics12 = {
    "name": string,
    "Nhà tuyển dụng mới": number
}
type JobsStatistics12 = {
    "name": string,
    "Bài đăng": number
}
type JobByFields = {
    name: string,
    quantity: number,
}

interface JobByCompanyMonths {
    key: string;
    logo: string;
    id: string;
    name: string;
    quantity: number;
    previousQuantity: number;
    statistic: number
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
    const options = {
        title: "Bài đăng theo lĩnh vực trong tháng",
        legend: {
            position: "right",
            align: "center",
        },
        sliceVisibilityThreshold: 0.1,
        pieHole: 0.4,
        is3D: false,
    };
    const columns: TableProps<JobByCompanyMonths>['columns'] = [
        {
            width: 60,
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (text: string) => <img className={`rounded-full w-10 aspect-square object-contain`}
                                           src={text}></img>,
        },
        {
            width: 210,
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record) => <a href={`/company/${record.id}`}>{text}</a>,
        },

        {
            width: 80,
            sorter: (a, b) => b.previousQuantity - a.previousQuantity,
            title: 'Tháng trước',
            align: 'center',
            key: 'previousQuantity',
            dataIndex: 'previousQuantity',
        },
        {
            width: 80,
            sorter: (a, b) => b.quantity - a.quantity,
            title: 'Tháng này',
            align: 'center',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            width: 73,
            title: 'Tăng trưởng',
            align: 'center',
            key: 'statistic',
            dataIndex: 'statistic',
            render: (value) => (value > 0 ?
                <div className={`w-full flex justify-center`}><FaCaretUp fill={'#1cbb8c'}/></div>
                : <div className={`w-full flex justify-center`}><FaCaretDown fill={'#dc3545'}/></div>)
        },
    ];
    const currentDate = new Date();
    const [userMonths, setUserMonths] = useState<UserStatistics12[]>([]);
    const [companyMonths, setCompanyMonths] = useState<CompanyStatistics12[]>([]);
    const [jobMonths, setJobMonths] = useState<JobsStatistics12[]>([]);
    const [jobByCompanyMonths, setJobByCompanyMonths] = useState<JobByCompanyMonths[]>([]);
    const [jobByFields, setJobsByFields] = useState<(string | number)[][]>();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const [month, setMonth] = useState<number>(currentMonth);
    const [year, setYear] = useState<number>(currentYear);
    const [viewJobBy, setViewJobBy] = useState<string>('month');

    const fetchUserStatistics = async () => {
        try {
            const userStatistics: UserStatistics = await getUserStatistics(currentMonth, currentYear)
            if (userStatistics) {
                setUserStatistic(userStatistics)
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
    const fetchJobByFields = async (month: number, year: number) => {
        try {
            const jobFields: JobByFields[] = await getJobsAllFields(month, year)
            let sortedJobs = jobFields.sort((a, b) => b.quantity - a.quantity)
            if (sortedJobs.length > 5) {
                const top5Fields = jobFields.slice(0, 5)
                const others = sortedJobs.slice(5);
                const otherQuantity = others.reduce((sum, job) => sum + job.quantity, 0);
                if (otherQuantity > 0) {
                    top5Fields.push({name: "Khác", quantity: otherQuantity});
                }
                sortedJobs = top5Fields
            }
            const jobsByFields = sortedJobs.map((item) => {
                return [item.name, item.quantity];
            })
            const newItems = ["Task", "Job per field"];
            const updatedTop5 = [newItems, ...jobsByFields];
            setJobsByFields(updatedTop5);
        } catch (e) {
            console.log(e)
        }
    }
    const fetchJobByCompanies = async (month: number, year: number) => {
        try {
            const data: JobByCompanyMonths[] = await getJobByCompaniesInMonth(month, year)
            if (data) {
                const newData = data.map((item) => {
                    const previous = item.previousQuantity
                    const statistic = (item.quantity - previous)
                    return {...item, statistic: statistic};
                })
                setJobByCompanyMonths(newData);
            }

        } catch (e) {
            console.log(e)
        }
    }
    const fetchDailyJobInMonth = async (month: number, year: number) => {
        try {
            const statistics: number[] = await getDailyJobs(month, year)
            const newStatistics = statistics.map((item, index) => {
                return {"name": `${index + 1}/${month}`, "Bài đăng": item}
            })
            setJobMonths(newStatistics);
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        fetchJobByFields(month, year)
    }, [month, year]);

    const handleMonthNext = () => {
        if (month == 12) {
            setYear(year + 1);
            setMonth(1)
        } else {
            setMonth((prev) => prev + 1);
        }
    }
    const handleMonthPrevious = () => {
        if (month == 1) {
            setYear(year - 1);
            setMonth(12)
        } else {
            setMonth((prev) => prev - 1);
        }
    }
    const handleOnSelectViewType = (value: string) => {
        if (value == 'day') {
            fetchDailyJobInMonth(currentMonth, currentYear)
            setViewJobBy('day')
        } else {
            setViewJobBy('month')
            fetchLast12MonthJobsStatistics()
        }
    }

    const onMonthChange = (date: dayjs.Dayjs, dateString: (string | string[])) => {
        if(!Array.isArray(dateString)) {
            const [month, year] = dateString.split('-');
            fetchDailyJobInMonth(parseInt(month), parseInt(year));
        }
    }

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().endOf('day');
    };

    useEffect(() => {
        fetchUserStatistics()
        fetchLast12MonthUserStatistics()
        fetchLast12MonthCompanyStatistics()
        fetchLast12MonthJobsStatistics()
        fetchJobByFields(currentMonth, currentYear)
        fetchJobByCompanies(currentMonth, currentYear)
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
                                            <Bar dataKey="Nhà tuyển dụng mới" fill="#83a6ed"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        </div>
                        <div className={`flex w-full p-3`}>
                            <div className={`h-[450px] w-full py-3 flex flex-col gap-0  rounded-lg bg-white`}>
                                <div className={`w-full ml-10 pb-5 flex gap-3`}>
                                    <Select
                                        onChange={handleOnSelectViewType}
                                        className={`w-24`} defaultValue={"month"}
                                        options={[{value: "month", label: "Tháng"}, {
                                            value: "day",
                                            label: "Ngày"
                                        }]}/>
                                    <div
                                        className={`${viewJobBy == 'month' ? 'opacity-0 w-0 h-0' : 'opacity-100'} transition-opacity duration-300`}>
                                        <DatePicker onChange={onMonthChange}
                                                    defaultValue={dayjs()}
                                                    style={{width: `${viewJobBy == 'month' ? '0px' : '120px'}`}}
                                                    disabled={viewJobBy == 'month'} format={'MM-YYYY'}
                                                    disabledDate={disabledDate} placeholder={'Chọn tháng'}
                                                    picker="month"/>
                                    </div>
                                </div>
                                <ResponsiveContainer height={350}>
                                    <ComposedChart width={730} height={250} data={jobMonths}
                                                   margin={{top: 5, right: 30, left: 20, bottom: 10}}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                                        <XAxis dataKey="name"
                                               label={{value: `${viewJobBy=='month'? 'Tháng': 'Ngày'}`, position: 'insideBottomRight', offset: -6}}/>
                                        <YAxis allowDecimals={false}
                                               label={{value: 'Bài đăng', angle: -90, position: 'insideLeft'}}/>
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
                        <div className={`flex w-full p-3`}>
                            <div className={`h-fit w-[calc(50%-30px)] py-3 pr-3`}>
                                <div className={` flex flex-col gap-0  rounded-lg bg-white`}>
                                    <Chart
                                        chartType="PieChart"
                                        data={jobByFields}
                                        options={options}
                                        width={"100%"}
                                        height={"350px"}
                                    />
                                    <div>
                                        <div className={`w-full flex justify-center`}>
                                            <p className={`w-fit text-text_color opacity-70`}>{month}-{year}</p>
                                        </div>
                                        <div className={`flex items-center gap-4 justify-center my-4`}>
                                            <div onClick={handleMonthPrevious}
                                                 className={`aspect-square group w-8 rounded-full flex items-center cursor-pointer hover:bg-green_default justify-center p-1 border border-green_default `}>
                                                <GrPrevious className={`group-hover:text-white text-green_default`}/>
                                            </div>
                                            <div onClick={handleMonthNext}
                                                 className={`aspect-square group w-8 rounded-full flex items-center cursor-pointer hover:bg-green_default justify-center p-1 border border-green_default `}>
                                                <GrNext className={`group-hover:text-white text-green_default`}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`flex-1 w-1/2 h-[462px] py-3 pl-3`}>
                                <div
                                    className={` flex flex-col overflow-y-auto overflow-x-auto h-[440px] gap-0  rounded-lg bg-white`}>
                                    <Table<JobByCompanyMonths>
                                        sticky={true}
                                        style={{height: '90%'}}
                                        pagination={false}
                                        columns={columns}
                                        bordered={true}
                                        dataSource={jobByCompanyMonths}/>
                                    <div className={`w-full flex justify-center`}>
                                        <p>Bài đăng của nhà tuyển dụng</p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
                <div className={`ml-[240px]  w-[calc(100vw-240px)]`}>


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
            <div className={`rounded-lg bg-white overflow-hidden p-6 h-[200px]`}>
                <div className={`flex items-start`}>
                    <p className={`text-[#939ba2] uppercase font-semibold line-clamp-2 w-[170px]`}>{item.name}</p>
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
                                className={`min-w-12 flex items-center justify-center ${percentage >= 0 ? 'bg-[#DCEEE9]' : 'bg-[#F5DEE0]'} rounded-md px-1 py-[2px]`}>
                                {
                                    percentage >= 0 ? (
                                        <FaSortUp fill={'#1cbb8c'}/>
                                    ) : (
                                        <FaSortDown fill={'#dc3545'}/>
                                    )
                                }
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

const AdminMessage = () => {
    const [typingMessage, setTypingMessage] = useState<string>('')
    const [loginUser, setLoginUser] = useState<UserResponse | null>(null)
    const [currentUserId, setCurrentUserId] = useState<string>('')
    const [currentRecipient, setCurrentRecipient] = useState<Participant>()
    const [privateChats, setPrivateChats] = useState<ChatMessage[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)
    const [allQuickMessages, setAllQuickMessages] = useState<QuickMessage[]>([])
    const [currentConversationId, setCurrentConversationId] = useState<number>()
    const navigate = useNavigate()
    const {receiverId, setReceiverId} = useMessageReceiverState()


    const onPrivateMessage = (payload: ChatMessage) => {
        updateAllQuickMessage(payload)
        setPrivateChats((prevChats) => {
            const isDup = prevChats.some((item) => item.id === payload.id)

            if (!isDup && prevChats[0] && payload.conversationId === prevChats[0].conversationId) {
                const newChats = [...prevChats, payload]
                handleScroll()
                return newChats
            }
            return prevChats
        })
    }

    const handleScroll = () => {
        if (bottomRef.current) {
            bottomRef.current?.scrollIntoView({behavior: 'instant', block: 'end', inline: 'nearest'})
            window.scrollBy({
                top: 50, // Điều chỉnh số pixel cách bottom
                behavior: 'smooth'
            });
        }
    }

    const getAllConversation = async (userId: string) => {
        try {
            const conversations: Conversation[] = await getAllConversations(userId)
            console.log(conversations)
            let quickMessagePromises: Promise<QuickMessage>[] = []
            const refineQuickMessages = async (value: Conversation, participantId: string) => {
                const participant: Participant = await getParticipant(participantId)
                const quickMessage: QuickMessage = {
                    id: value.id,
                    avatar: participant.avatar,
                    name: participant.name,
                    text: value.lastMessage,
                    recipientId: participantId,
                    conversationId: value.id,
                    time: value.modifiedAt,
                    type: value.type
                }
                return quickMessage
            }
            if (userId.startsWith("u_")) {
                quickMessagePromises = conversations.map(async (value) => {
                    const participantId = value.senderId
                    return refineQuickMessages(value, participantId)
                })
            }
            if (userId.startsWith("company_")) {
                quickMessagePromises = conversations.map(async (value) => {
                    const participantId = value.receiverId
                    return refineQuickMessages(value, participantId)
                })
            }

            const quickMessages = await Promise.all(quickMessagePromises)

            quickMessages.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            setAllQuickMessages(quickMessages)
        } catch (e: any) {
            toast.error(e.response.data)
        }
    }

    const updateAllQuickMessage = (payload: ChatMessage) => {
        setAllQuickMessages((prevState) => {
            // Tạo một bản sao mới của prevState bằng cách map qua từng phần tử
            const updatedMessages = prevState.map((message) => {
                if (message.conversationId === payload.conversationId) {
                    // Trả về một object mới với các thuộc tính đã được cập nhật
                    return {
                        ...message,
                        text: payload.content,
                        time: payload.timestamp,
                        type: payload.type
                    };
                }
                // Trả về phần tử ban đầu nếu không có thay đổi
                return message;
            });


            // Sắp xếp lại mảng và trả về mảng mới
            return updatedMessages.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        });

    }

    const getMessageByConversationId = async (conversationId: number) => {
        try {
            let messages: ChatMessage[] = await getMessagesByConversationId(conversationId)
            if (messages.length > 0) {
                messages = messages.reverse()
                messages = messages.filter(
                    (element, index, self) => index === self.findIndex((e) => e.id === element.id)
                )
            }
            setPrivateChats(messages)
        } catch (e: any) {
            toast.error(e.response.data)
        }
    }


    useEffect(() => {

        const getLogInUser = async (userId: string) => {
            try {
                const user: UserResponse = await getCurrentParticipant(userId)
                setLoginUser(user)
                setCurrentUserId(user.id)
                getAllConversation(user.id)
                connectWebSocket(() => {
                    subscribeToTopic(`/user/${user.id}/private`, onPrivateMessage)
                })
            } catch (e: any) {
                toast.error(e.response.data)
            }
        }

        let rawUser = JSON.parse(localStorage.getItem('user'))
        if (!rawUser) {
            rawUser = JSON.parse(localStorage.getItem('company'))
            if (receiverId) {
                handleGetConversationByUserIds(rawUser.id, receiverId)
            }
        }
        if (rawUser) {
            getLogInUser(rawUser.id)
        } else {
            navigate('/login', {replace: true})
        }

        return setReceiverId(undefined)

    }, [])

    const handleClickQuickMessage = async (conversationId: number, participantId: string) => {
        const participant: Participant = await getParticipant(participantId)
        setCurrentRecipient(participant)
        setCurrentConversationId(conversationId)

        if (!currentRecipient || currentRecipient.id != participantId) {
            await getMessageByConversationId(conversationId)
        }
        await delay(20)
        handleScroll()
    }

    useEffect(() => {
        handleScroll()
    }, [privateChats.length])

    const sendMessages = async (message: string | null) => {
        let type: string = 'image'
        if (message == null) {
            message = typingMessage
            type = 'text'
        }

        if (message.trim() !== '' && currentRecipient && loginUser) {
            let conversationId = currentConversationId
            let isConverExist = true
            if (!currentConversationId) {
                const request: ConversationRequest = {
                    message: message,
                    type: type,
                    recipientId: currentRecipient.id,
                    senderId: currentUserId,
                    createdAt: new Date()
                }
                const createdConversation = await createNewConversation(request)
                conversationId = createdConversation.id
                isConverExist = false
            }
            const messageItem: ChatMessage = {
                id: new Date().getTime().toString(),
                content: message,
                timestamp: new Date(),
                recipientId: currentRecipient.id,
                senderId: loginUser.id,
                conversationId: conversationId,
                type: type
            }
            console.log(messageItem)
            sendMessage('/app/private-message', messageItem)
            setTypingMessage('')
            setPrivateChats((prevState) => [...prevState, messageItem])
            handleScroll()
            updateAllQuickMessage(messageItem)
            if (!isConverExist) getAllConversation(currentUserId)
        }
    }

    const createNewConversation = async (request: ConversationRequest) => {
        try {
            const createdConversation = await createConversation(request)
            setCurrentConversationId(createdConversation.id)
            return createdConversation
        } catch (e: any) {
            toast.error(e.response.data)
        }
    }
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    imageUpload({image: reader.result as string}).then((r) => {
                        if (r) {
                            sendMessages(r)
                        }
                    })
                }
                reader.readAsDataURL(file)
            })
        }
    }


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return
            }
            e.preventDefault()
            sendMessages(null)
        }
    }

    const handleGetConversationByUserIds = async (senderId: string, receiverId: string) => {
        try {
            const conversation: Conversation = await searchConversationByUserIds(senderId, receiverId)
            if (conversation) {
                setCurrentConversationId(conversation.id)
                getMessageByConversationId(conversation.id)
            } else {
                setCurrentConversationId(undefined)
            }

        } catch (err) {
            toast.error(err)
            setCurrentConversationId(undefined)
        }
        const participant: Participant = await getParticipant(receiverId)
        setCurrentRecipient(participant)

    }


    return (
        <div className={`overflow-hidden `}>
            <div className={`flex text-[16px] overflow-hidden`}>
                {/*nav*/}
                <div
                    className={`w-[25%] px-3 min-w-[300px] h-screen flex flex-col relative min-h-screen  z-10 bg-white border-r border-r-gray-400 border-gray  overflow-hidden `}
                >
                    <div className={`rounded-lg bg-green-50 border p-3 mb-2`}>
                        <div
                            className={`w-full flex justify-start bg-green_nga px-2 py-2 rounded-lg gap-4 items-center`}>
                            <a className={`flex justify-start gap-4 items-center`}
                               href={homePage}>
                                <img className={`w-8 mx-0 aspect-square`} src={'/public/logo.png'} alt={"logo"}/>
                                <p className={`font-bold text-[24px] text-white font-inter`}>{AppInfo.appName}</p>
                            </a>

                        </div>
                        {/*current user*/}
                        <div
                            className={` rounded  bg-inherit pl-2 `}>
                            <div className={`flex gap-4 pt-4 pl-0 `}>
                                <div className={`flex gap-4 rounded-full cursor-pointer`}>
                                    <img
                                        className={`w-[48px] rounded-full aspect-square object-cover`}
                                        src={loginUser?.avatar}
                                        alt={'avatar'}
                                    />
                                    <div className={`flex items-center justify-start truncate`}>
                                        <p className={`font-bold text-[18px]`}>{loginUser ? loginUser.name : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`overflow-y-scroll bg-white py-2`}>
                        {/*item*/}
                        {allQuickMessages.map((value, index) => (
                            <div
                                key={index}
                                onClick={() => handleClickQuickMessage(value.conversationId, value.recipientId)}
                                className={`px-2 mt-1 hover:bg-gray-100 border-t cursor-pointer rounded py-3  flex gap-x-2 ${currentRecipient && currentRecipient.id == value.recipientId ? 'bg-[#E5EFFF]' : 'bg-gray-50'}`}
                            >
                                <div className={` flex items-center gap-x-3 w-[90%]`}>
                                    <img
                                        alt={'user'}
                                        className={`h-[48px] aspect-square object-cover rounded-[100%]`}
                                        src={value.avatar}
                                    />
                                    <div className={`h-full w-full max-w-full overflow-hidden`}>
                                        <div className={`flex`}>
                                            <p className={`truncate max-w-full text-[#081C36]`}>{value.name}</p>
                                            <p className={`flex-1 text-gray-600 flex justify-end items-start`}>
                                                {new Date(value.time).getHours().toString().padStart(2, '0') +
                                                    ':' +
                                                    new Date(value.time).getMinutes().toString().padStart(2, '0')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`truncate max-w-[90%] text-gray-500`}>
                                                {value.type == 'image' ? '[Hình ảnh]' : value.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {currentRecipient ? (
                    // content
                    <div className={`flex-1 bg-[#EEF0F1] flex flex-col`}>
                        {/*header*/}
                        <div
                            className={`bg-white border-b  transition-transform duration-300 px-3 py-2 flex gap-x-2 items-start`}
                        >
                            <img
                                alt={'user'}
                                className={`h-[48px] aspect-square object-cover rounded-[100%]`}
                                src={currentRecipient.avatar}
                            />
                            <p className={`font-bold`}>{currentRecipient.name}</p>
                            <div className={`flex-1 flex justify-end`}>
                                {client && (
                                    <VideoCall
                                        senderName={loginUser ? loginUser.name : ''}
                                        senderAvatar={loginUser ? loginUser.avatar : ''}
                                        userName={currentRecipient.name}
                                        client={client}
                                        userId={currentUserId}
                                        targetUserId={currentRecipient && currentRecipient.id}
                                    />
                                )}
                            </div>
                        </div>
                        {/*content*/}
                        <div className={`flex-1 overflow-hidden relative h-full w-full`}>
                            <div className={`absolute inset-0 overflow-y-scroll overflow-x-hidden ml-3 pr-3`}>
                                <div className={`min-h-[100%] flex pb-[28px] flex-col  justify-end`}>
                                    <div className={`min-h-full flex pb-[48px] gap-y-4 flex-col justify-end `}>
                                        {/*message card*/}
                                        {privateChats.length > 0 &&
                                            privateChats.map((value, index) => (
                                                <div
                                                    key={index}
                                                    className={`m-x-[16px] w-full flex ${value.senderId != loginUser?.id ? 'justify-start' : 'justify-end'}`}
                                                >
                                                    <div
                                                        className={`w-fit min-w-[80px]  max-w-[50%]  drop-shadow relative block p-[12px] rounded-[8px] ${value.senderId != currentUserId ? 'bg-white' : 'bg-chat_me'}`}
                                                    >
                                                        {value.type == 'text' ? (
                                                            <pre className={`break-words  py-1 font-sans text-wrap`}>
                                                                {value.content}
                                                            </pre>
                                                        ) : (
                                                            <div>
                                                                <img
                                                                    className={`object-contain rounded`}
                                                                    src={value.content}
                                                                    alt={value.content}
                                                                />
                                                            </div>
                                                        )}

                                                        <p className={`text-[#476285] text-[12px]`}>
                                                            {new Date(value.timestamp).getHours().toString().padStart(2, '0') +
                                                                ':' +
                                                                new Date(value.timestamp).getMinutes().toString().padStart(2, '0')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <div className={`h-[14px] break-words `} ref={bottomRef}></div>
                                </div>
                            </div>
                        </div>
                        {/*type*/}
                        <div className={`flex flex-col bg-white px-3`}>
                            <div className={`flex items-center justify-start py-1 border-b w-full`}>
                                <label
                                    className="flex flex-col items-center justify-start w-fit h-full  rounded-lg cursor-pointer  ">
                                    <CiImageOn size={26}/>
                                    <input
                                        disabled={!currentRecipient}
                                        onChange={handleImageChange}
                                        id="dropzone-file"
                                        type="file"
                                        accept={'image/*'}
                                        multiple={true}
                                        className="hidden outline-none"
                                    />
                                </label>
                            </div>

                            <div className={`bg-white  flex py-2 items-center gap-x-3`}>
              <textarea
                  disabled={!currentRecipient}
                  onKeyDown={handleKeyDown}
                  value={typingMessage}
                  onChange={(e) => setTypingMessage(e.target.value)}
                  spellCheck={false}
                  placeholder={'Nhập tin nhắn...'}
                  className={`w-full px-3 py-2 outline-none resize-none flex-1 self-center !h-[50px]`}
              />
                                <div
                                    onClick={() => sendMessages(null)}
                                    className={`${currentRecipient ? 'cursor-pointer hover:text-green-500' : 'disabled'}`}
                                >
                                    <VscSend size={28}/>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>

                    </div>
                )}

                <ToastContainer
                    position="top-center"
                    autoClose={1000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                />
            </div>
        </div>
    )
}