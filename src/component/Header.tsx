import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserResponse} from "@/page/GoogleCode.tsx";
import {AiFillMessage} from "react-icons/ai";
import {IoNotifications} from "react-icons/io5";
import {
    countAllNotificationDeliveried,
    getAllNotifications,
    getUserInfo,
    updateUserNotificationStatus
} from "@/axios/Request.ts";
import {Dropdown, MenuProps, Modal} from "antd";
import {connectWebSocket, subscribeToTopic} from "@/service/WebSocketService.ts";
import {IoMdCloseCircle} from "react-icons/io";

interface Notification {
    id: number;
    title: string;
    message: string;
    createdAt: Date,
    status: string,
    userId: string
}
const Header = () => {
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState<UserResponse>()
    useEffect(() => {
        let user:UserResponse = JSON.parse(localStorage.getItem("user"));
        const getUser =async ()=> {
            user = await getUserInfo(user.id)
            if(user) {
                setLoginUser(user)
                localStorage.setItem("user", JSON.stringify(user))
            }
        }
        if(user){
            getUser();
        }
    }, [])

    const handleButtonClick = (target: string) => {
        navigate(`${target}`, {replace: false});
    }
    return (
        <div className={`px-4 flex min-h-[74px] bg-white border-none border-b-[1px] border-b-[#e9eaec] sticky top-0 z-50 shadow`}>

            <div className={`flex justify-between w-full`}>
                {/*App logo*/}
                <div>
                    <a
                        href="/"
                        target='_self'
                        className="mr-3 flex-none overflow-hidden w-auto flex items-center gap-2"
                    >
                        <img
                            src="/public/job-finder.jpg"
                            alt="App Home page"
                            className="object-cover w-[70%] max-w-[128px] "
                        />
                        {/*<p className="text-black font-semibold">{AppInfo.appName}</p>*/}
                    </a>
                </div>
                <div
                    className={`flex-1 flex *:text-[18px] justify-start gap-10 *:cursor-pointer  items-center *:font-bold`}>
                    <p className={`hover:text-green-500`}>Việc làm</p>
                    <p className={`hover:text-green-500`}>Hồ sơ & CV</p>
                    <p className={`hover:text-green-500`}>Công ty</p>

                </div>
                {/*Login area*/}
                {loginUser ?
                    <UserSection loginUser={loginUser}/> :
                    <div className={`items-center flex gap-x-4`}>
                        <button
                            onClick={() => handleButtonClick("login")}
                            type={"button"}
                            className={`rounded bg-white border-2 border-primary hover:bg-gray-100 text-primary text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                            Đăng nhập
                        </button>
                        <button
                            onClick={() => handleButtonClick("signup")}
                            type={"button"}
                            className={`rounded hover:bg-green-600 bg-green_default text-white text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                            Đăng ký
                        </button>
                        <button
                            onClick={() => navigate('/employer/entry/login')}
                            type={"button"}
                            className={`rounded bg-black hover:bg-gray-900 text-white text-center whitespace-nowrap cursor-pointer select-none items-center font-medium gap-2 h-[40px] justify-center px-4`}>
                            Nhà tuyển dụng
                        </button>
                    </div>
                }
            </div>


        </div>
    );
};

export default Header;

interface Props {
    loginUser: UserResponse;
}

export const UserSection: React.FC<Props>=({loginUser})=>{
    const [unreadNotification, setUnreadNotification] = useState<number>();
    const [isViewDetail, setIsViewDetail] = useState(false);
    const [currentAcceptNotification, setCurrentAcceptNotification] = useState<any>();
    const [items, setItems] = useState<MenuProps['items']>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(loginUser){
            connectWebSocket(() => {
                subscribeToTopic(`/user/${loginUser.id}/notifications`, onReceiveNotification)
            })
            getCountNotificationCountUnread(loginUser.id)
        }
    }, [])


    const updateNotificationState = async (id: number, status: string) => {
        try {
            if(loginUser){
                await updateUserNotificationStatus(id, status);
                const count: number = await countAllNotificationDeliveried(loginUser.id);
                setUnreadNotification(count);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const openDetailNotification = (data) => {
        setIsViewDetail(true);
        setCurrentAcceptNotification(data)
        updateNotificationState(data.id, "read")
    }
    const fetchAllNotifications = async () => {
        try {
            if(loginUser){
                let notifications: Notification[] = await getAllNotifications(loginUser.id);
                if (notifications && notifications.length > 0) {
                    notifications = notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    const notificationMenuItem: MenuProps['items'] = notifications.map((item) => {
                        const finalMessage = item.message.replace('${title}', item.title)
                        return {
                            key: item.id,
                            label: (<div onClick={() => openDetailNotification(item)}
                                         className={`flex ${item.status != 'READ' ? 'bg-gray-200' : 'bg-inherit'} justify-center px-1 py-1 border-b`}>
                                    <p className={`line-clamp-3 text-text_color opacity-80`}>{finalMessage}</p>
                                </div>
                            ),
                        }
                    })
                    setItems(notificationMenuItem);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onReceiveNotification = useCallback(async (data) => {
        setUnreadNotification(1)
    }, [])

    const getCountNotificationCountUnread = async (id) => {
        const count: number = await countAllNotificationDeliveried(id);
        setUnreadNotification(count);
    }
    const onCloseDetails = () => {
        setIsViewDetail(false);
    }
    const profileClick=()=>{
        if(loginUser){
            navigate(`/me/${loginUser.id}`)
        }
    }
    return (
        <>
            <div className={`items-center flex gap-x-4 mx-2`}>
                <div
                    className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 bg-[#E5F7ED]`}>
                    <Dropdown
                        overlayStyle={{width: '400px'}}
                        menu={{items}}
                        placement="bottomLeft"
                        arrow={{pointAtCenter: true}}
                        trigger={['click']}>
                        <div onClick={fetchAllNotifications}
                             className={`cursor-pointer relative h-fit rounded-full aspect-square flex items-center justify-center w-10 bg-[#E5F7ED]`}>
                            <IoNotifications size={24} fill={"#00B14F"}/>
                            {unreadNotification > 0 && <div
                                className={`w-3 absolute top-[20%] right-[20%] rounded-full aspect-square bg-red-500`}/>}
                        </div>
                    </Dropdown>
                </div>
                <div
                    onClick={() => navigate(`/message/${loginUser.id}`)}
                    className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 p-1 bg-[#E5F7ED]`}>
                    <AiFillMessage size={24} fill={"#00B14F"}/>
                </div>
                <div onClick={profileClick}
                     className={`w-9 cursor-pointer  bg-white  aspect-square rounded-full overflow-y-hidden`}>
                    <img src={loginUser && loginUser.avatar} alt={`avatar`}
                         className="object-cover aspect-square"/>
                </div>
            </div>
            <Modal
                destroyOnClose={true}
                footer={null}
                title="Chi tiết"
                onCancel={onCloseDetails}
                width={500}
                closeIcon={<IoMdCloseCircle size={24}
                                            fill={"#00b14f"}/>}
                open={isViewDetail}>
                <div className={`w-full`}>
                    <DynamicMessage
                        message={currentAcceptNotification && currentAcceptNotification.message}
                        title={currentAcceptNotification && currentAcceptNotification.title}
                    />
                </div>
            </Modal>
        </>
    )
}

interface MessageProps {
    message: string;
    title: string;
    as?: "span" | "a";
}

const DynamicMessage: React.FC<MessageProps> = ({message, title, as = "span"}) => {
    // Split the message around "${title}"
    const parts = message.split("${title}");
    const part0 = parts[0]
    const part1 = parts[1]

    return (
        <div className={`*:leading-8 *:text-18`}>
            <p className={``}>
                {part0}
                <span className={`font-semibold underline`}>{title}</span>
                {part1}
            </p>
        </div>

    );
};