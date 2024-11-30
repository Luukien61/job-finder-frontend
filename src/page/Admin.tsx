import React from 'react';
import {LuLayoutDashboard} from "react-icons/lu";
import {FaBookOpen} from "react-icons/fa";
import {Menu} from "antd";
import {AiFillMessage} from "react-icons/ai";
import {GrUserNew} from "react-icons/gr";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line, Area, AreaChart, ComposedChart
} from "recharts";


const Admin = () => {
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
                            <div className={`p-3 w-1/4`}>
                                <div className={`rounded-lg bg-white p-6`}>
                                    <div className={`flex items-start`}>
                                        <p className={`text-[#939ba2] uppercase font-semibold w-[120px]`}>Ứng viên mới
                                            trong tháng</p>
                                        <div className={`flex-1 flex justify-end`}>
                                            <div
                                                className={`p-3 rounded-full bg-[#d3e2f7] flex items-center justify-center`}>
                                                <GrUserNew size={20} color={'#3B7DDD'}/>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={`overflow-hidden w-full mt-5`}>
                                        <p className={`text-[35px] font-[400] leading-8  ml-1 mb-5 `}>47482</p>

                                    </div>
                                    <div className={`flex w-full gap-2`}>
                                        <div className={`bg-[#DCEEE9] rounded-md px-1 py-[2px]`}>
                                            <p className={`text-[#1cbb8c]`}>3.65%</p>

                                        </div>
                                        <p className={`text-[#939ba2]`}>so với tháng trước</p>

                                    </div>
                                </div>
                            </div>
                            <div className={`p-3 w-1/4`}>
                                <div className={`rounded-lg bg-white p-6`}>
                                    <div className={`flex items-start`}>
                                        <p className={`text-[#939ba2] uppercase font-semibold w-[120px]`}>Ứng viên mới
                                            trong tháng</p>
                                        <div className={`flex-1 flex justify-end`}>
                                            <div
                                                className={`p-3 rounded-full bg-[#d3e2f7] flex items-center justify-center`}>
                                                <GrUserNew size={20} color={'#3B7DDD'}/>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={`overflow-hidden w-full mt-5`}>
                                        <p className={`text-[35px] font-[400] leading-8  ml-1 mb-5 `}>47482</p>

                                    </div>
                                    <div className={`flex w-full gap-2`}>
                                        <div className={`bg-[#DCEEE9] rounded-md px-1 py-[2px]`}>
                                            <p className={`text-[#1cbb8c]`}>3.65%</p>

                                        </div>
                                        <p className={`text-[#939ba2]`}>so với tháng trước</p>

                                    </div>
                                </div>
                            </div>
                            <div className={`p-3 w-1/4`}>
                                <div className={`rounded-lg bg-white p-6`}>
                                    <div className={`flex items-start`}>
                                        <p className={`text-[#939ba2] uppercase font-semibold w-[120px]`}>Ứng viên mới
                                            trong tháng</p>
                                        <div className={`flex-1 flex justify-end`}>
                                            <div
                                                className={`p-3 rounded-full bg-[#d3e2f7] flex items-center justify-center`}>
                                                <GrUserNew size={20} color={'#3B7DDD'}/>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={`overflow-hidden w-full mt-5`}>
                                        <p className={`text-[35px] font-[400] leading-8  ml-1 mb-5 `}>47482</p>

                                    </div>
                                    <div className={`flex w-full gap-2`}>
                                        <div className={`bg-[#DCEEE9] rounded-md px-1 py-[2px]`}>
                                            <p className={`text-[#1cbb8c]`}>3.65%</p>

                                        </div>
                                        <p className={`text-[#939ba2]`}>so với tháng trước</p>

                                    </div>
                                </div>
                            </div>
                            <div className={`p-3 w-1/4`}>
                                <div className={`rounded-lg bg-white p-6`}>
                                    <div className={`flex items-start`}>
                                        <p className={`text-[#939ba2] uppercase font-semibold w-[120px]`}>Ứng viên mới
                                            trong tháng</p>
                                        <div className={`flex-1 flex justify-end`}>
                                            <div
                                                className={`p-3 rounded-full bg-[#d3e2f7] flex items-center justify-center`}>
                                                <GrUserNew size={20} color={'#3B7DDD'}/>
                                            </div>

                                        </div>
                                    </div>
                                    <div className={`overflow-hidden w-full mt-5`}>
                                        <p className={`text-[35px] font-[400] leading-8  ml-1 mb-5 `}>47482</p>

                                    </div>
                                    <div className={`flex w-full gap-2`}>
                                        <div className={`bg-[#DCEEE9] rounded-md px-1 py-[2px]`}>
                                            <p className={`text-[#1cbb8c]`}>3.65%</p>
                                        </div>
                                        <p className={`text-[#939ba2]`}>so với tháng trước</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`flex w-full p-3 `}>
                            <div className={`w-1/2 py-3 px-3 pl-0`}>
                                <div className={`h-[280px] pr-3 py-3 bg-white rounded-lg`}>
                                    <ResponsiveContainer>
                                        <BarChart width={530} height={250} data={employeeData}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis/>
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
                                        <BarChart width={530} height={250} data={employeeData}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                                            <XAxis dataKey="name"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Bar dataKey="Ứng viên mới" fill="#82ca9d"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        </div>
                        <div className={`flex w-full p-3`}>
                            <div className={`h-[350px] w-full py-3  rounded-lg bg-white`}>
                                <ResponsiveContainer>
                                    <ComposedChart width={730} height={250} data={jobTotalYear}
                                               margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.5}/>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
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
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;