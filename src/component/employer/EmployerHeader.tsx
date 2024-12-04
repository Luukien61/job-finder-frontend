import React, {useCallback, useEffect, useState} from 'react';
import {IoNotifications} from "react-icons/io5";
import {connectWebSocket, subscribeToTopic} from "@/service/WebSocketService.ts";
import {Dropdown, MenuProps, Modal} from "antd";
import {
    countAllNotificationDeliveried,
    getAllNotifications,
    getCompanyInfo,
    updateNotificationStatus
} from "@/axios/Request.ts";
import {IoMdCloseCircle} from "react-icons/io";
import {AiFillMessage} from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import {CompanyInfo} from "@/page/employer/EmployerHome.tsx";
import {checkIsCompanyBanned} from "@/service/ApplicationService.ts";
import {useIsCompanyBannedState} from "@/zustand/AppState.ts";

interface BanProps {
    id: number;
    title: string;
    reason: string;
    message: string;
    userId: string
}

interface Notification {
    id: number;
    title: string;
    reason: string;
    message: string;
    createdAt: Date,
    status: string,
    userId: string
}
export const EmployerHeader = () => {
    const [currentEmployerId, setCurrentEmployerId] = useState<string | null>(null);
    const [unreadNotification, setUnreadNotification] = useState<number>();
    const [items, setItems] = useState<MenuProps['items']>([]);
    const [isViewDetail, setIsViewDetail] = useState(false);
    const [currentBanNotification, setCurrentBanNotification] = useState< BanProps>();
    const navigate = useNavigate();
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>();
    const [currentNav, setCurrentNav] = useState<string>();
    const getNavLocation =()=>{
        const paths = location.pathname.split("/");
        let current = paths[paths.length - 1];
        if(current == 'employer'){
            current =''
        }
        setCurrentNav(current);
    }
    const {setIsCompanyBanned}=useIsCompanyBannedState()
    const [isBanned, setIsBanned] = useState<boolean>(false);
    const checkCompanyStatus = async (id) => {
        try {
            const isBanned: boolean = await checkIsCompanyBanned(id);
            setIsBanned(isBanned);
            setIsCompanyBanned(isBanned);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        getNavLocation()
    }, [location]);

    const updateNotificationState=async (id:number, status: string)=>{
        try{
            await updateNotificationStatus(id, status);
            const count :number = await countAllNotificationDeliveried(currentEmployerId);
            setUnreadNotification(count);
        }catch(error){
            console.log(error);
        }
    }
    const openDetailNotification = (data:BanProps)=>{
        setIsViewDetail(true);
        setCurrentBanNotification(data)
        updateNotificationState(data.id,"read")
    }
    const fetchAllNotifications = async () => {
        try{
            let notifications : Notification[]= await getAllNotifications(currentEmployerId);

            if(notifications && notifications.length > 0){
                notifications=notifications.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                const notificationMenuItem : MenuProps['items'] = notifications.map((item)=>{
                    const finalMessage = item.message.replace('${title}', item.title).replace('${reason}', item.reason);
                    return {
                        key: item.id,
                        label: (<div onClick={()=>openDetailNotification(item)} className={`flex ${item.status!='READ' ? 'bg-gray-200': 'bg-inherit'} justify-center px-1 py-1 border-b`}>
                                <p className={`line-clamp-3 text-text_color opacity-80`}>{finalMessage}</p>
                            </div>
                        ),
                    }
                })
                setItems(notificationMenuItem);
            }
        }catch(error){
            console.log(error);
        }
    }

    const onReceiveNotification = useCallback(async (data: BanProps)=>{
        setUnreadNotification(1)
    },[])

    const getCountNotificationCountUnread = async (id) => {
        const count :number = await countAllNotificationDeliveried(id);
        setUnreadNotification(count);
    }
    const onCloseDetails=()=>{
        setIsViewDetail(false);
    }
    const fetchCompanyInfo=async (id)=>{
        try{
            const info : CompanyInfo= await getCompanyInfo(id)
            setCompanyInfo(info)
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        const employer = JSON.parse(localStorage.getItem("company"));
        if (employer && employer.id) {
            const id = employer.id;
            setCurrentEmployerId(id);
            connectWebSocket(() => {
                subscribeToTopic(`/user/${id}/notifications`, onReceiveNotification)
            })
            getCountNotificationCountUnread(id)
            fetchCompanyInfo(id)
            checkCompanyStatus(id)
        }

    }, []);
    const handleMenuItemChange = (item: any) => {
        navigate(`${item}`)
        setCurrentNav(item)
    }
    const openLocation=(location: string, isBlank: boolean)=>{
        if(isBlank){
            window.open(location, '_blank')
        }else {
            window.location.href=location
        }

    }

    return (
        <div
            className={`px-4 flex min-h-[74px] bg-white border-none border-b-[1px] border-b-[#e9eaec] sticky top-0 z-50 shadow`}>

            <div className={`flex justify-between items-center w-full`}>
                {/*App logo*/}
                <div>
                    <a
                        href="/employer"
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
                    className={`flex-1 flex  *:font-[600] *:text-16 *:cursor-pointer ml-6 justify-start gap-10   items-center`}>
                    <p onClick={() => handleMenuItemChange('')}
                       className={`hover:underline ${currentNav == '' && 'text-green_default underline'}`}>Trang chủ</p>
                    <p onClick={() => handleMenuItemChange('jobs')}
                       className={`hover:underline  ${currentNav == 'jobs' && 'text-green_default underline'}`}>Bài
                        đăng</p>
                </div>


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
                <div className={`flex gap-3 ml-3`}>
                    <div
                        onClick={()=>openLocation(`/message/${companyInfo?.id}`,true)}
                        className={`cursor-pointer rounded-full aspect-square flex items-center justify-center w-10 p-1 bg-[#E5F7ED]`}>
                        <button className={`disabled:opacity-50`} disabled={isBanned}>
                            <AiFillMessage size={24} fill={"#00B14F"}/>
                        </button>
                    </div>
                    <div onClick={()=>openLocation('/employer/profile',false)}
                         className={`w-9 cursor-pointer  bg-white  aspect-square rounded-full overflow-y-hidden`}>
                        <img src={companyInfo?.logo} alt={`avatar`}
                             className="object-cover aspect-square"/>
                    </div>
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
                        reason={currentBanNotification?.reason}
                        message={currentBanNotification?.message}
                        title={currentBanNotification?.title}
                    />
                </div>
            </Modal>


        </div>

    );
};

export default EmployerHeader;

interface MessageProps {
    message: string;
    title: string;
    reason: string;
    as?: "span" | "a";
    href?: string;
}

const DynamicMessage: React.FC<MessageProps> = ({ message, title, as = "span", href, reason }) => {
    // Split the message around "${title}"
    const parts = message.split("${title}");
    const part0= parts[0]
    const part1 = parts[1]
    const part2 = part1.split('${reason}.')

    return (
        <div className={`*:leading-8 *:text-18`}>
            <p className={``}>
                {part0}
                {as === "a" ? (
                    <a href={href || "#"}>{title}</a>
                ) : (
                    <span className={`font-semibold underline`}>{title}</span>
                )}
                {part2[0]}
                <span className={`font-semibold underline`}>{reason}</span>
            </p>
            <p>{part2[1]}</p>
        </div>

    );
};