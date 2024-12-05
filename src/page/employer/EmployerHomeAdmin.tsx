import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {
    ConversationRequest,
    createConversation,
    getAllConversations,
    getCompanyStatistics,
    getCurrentParticipant,
    getMessagesByConversationId,
    getParticipant,
    getParticipantById
} from "@/axios/Request.ts";
import {delay, UserResponse} from "@/page/GoogleCode.tsx";
import {
    ChatMessage,
    connectWebSocket,
    Conversation,
    Participant,
    sendMessage,
    subscribeToTopic
} from "@/service/WebSocketService.ts";
import {Outlet, useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {imageUpload} from "@/service/Upload.ts";
import {CiImageOn} from "react-icons/ci";
import {VscSend} from "react-icons/vsc";
import {QuickMessage} from "@/page/Message.tsx";
import {BsFileEarmarkPersonFill} from "react-icons/bs";
import {MdKeyboardDoubleArrowRight, MdPersonPin} from "react-icons/md";
import {HiNewspaper} from "react-icons/hi";
import {SiPaperlessngx} from "react-icons/si";
import PulsatingSphere from "@/component/PulsatingSphere.tsx";
import EmployerHeader from "@/component/employer/EmployerHeader.tsx";


const EmployerHomeAdmin = () => {
    return (
        <div className={`relative`}>
            <EmployerHeader/>
            <div className={`w-full flex justify-center`}>
                <div className={`w-[1250px]`}>
                    <Outlet/>
                </div>

            </div>
        </div>
    );
};

export default EmployerHomeAdmin;

interface MonthlyJobs {
    year: number;
    month: number;
    jobCount: number;
}

interface AdminProps {
    newApplicants: number;
    newJobs: number;
    applicants: number;
    monthlyJobs: MonthlyJobs[]
}

type BarProps = {
    "name": string,
    "Bài đăng": number,
}

export const EmployerDashboard = () => {
    const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
    const [companyStatistics, setCompanyStatistics] = useState<AdminProps>()
    const [monthlyJobs, setMonthlyJobs] = useState<BarProps[]>()
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    const fetchCompanyStatistics = async (id: string, month: number, year: number) => {
        try {
            const result: AdminProps = await getCompanyStatistics(id, month, year)
            if (result) {
                setCompanyStatistics(result)
                const sorted = result.monthlyJobs.sort((a, b) => {
                    if (a.year !== b.year) {
                        return a.year - b.year;
                    }
                    return a.month - b.month;
                })
                const monthlyJobs: BarProps[] = sorted.map(item => {
                    return {
                        'name': 'T' + item.month,
                        "Bài đăng": item.jobCount
                    }
                })
                setMonthlyJobs(monthlyJobs)

            }
        } catch (error) {
            console.log(error)
        }
    }

    const navigateTo = (id: string) => {
        window.location.href=`/employer/${id}`;
    }

    useEffect(() => {
        const company = JSON.parse(localStorage.getItem("company"));
        if (company && company.id) {
            fetchCompanyStatistics(company.id, currentMonth, currentYear);
            setCurrentCompanyId(company.id)
        }
    }, []);

    return (
        <div className={`px-[60px] py-10 `}>
            <div>
                <p className={`w-fit font-bold text-[26px] pl-3`}> <span
                    className={`font-normal text-[26px]`}>Dashboard</span></p>
            </div>
            <div className={`flex w-full`}>
                <CompanyStatisticCard
                    style={'text-green_default'}
                    animate={false}
                    bottom={
                        <PulsatingSphere color={'bg-[#DCEEE9]'}
                                         style={'right-1 w-9 bottom-[80%]'}>
                            <div className={`absolute right-2 bottom-[100%]`}>
                                <MdKeyboardDoubleArrowRight
                                    onClick={()=>navigateTo("jobs")}
                                    className={`cursor-pointer`}
                                    size={28}
                                    fill={"#00b14f"}/></div>
                        </PulsatingSphere>
                    }
                    statistic={companyStatistics?.newApplicants}
                    name={'Ứng viên đang chờ trong tháng'}
                    icon={<BsFileEarmarkPersonFill size={20} color={'#3B7DDD'}/>}
                />
                <CompanyStatisticCard
                    statistic={companyStatistics?.applicants}
                    name={'Ứng viên trong tháng'}
                    icon={<MdPersonPin size={20} color={'#3B7DDD'}/>}
                />
                <CompanyStatisticCard
                    statistic={companyStatistics?.newJobs}
                    name={'Bài đăng trong tháng'}
                    icon={<HiNewspaper size={20} color={'#3B7DDD'}/>}
                />
                <CompanyStatisticCard
                    style={'text-[#dc3545]'}
                    statistic={15 - companyStatistics?.newJobs}
                    name={'Bài đăng còn lại trong tháng'}
                    icon={<SiPaperlessngx size={20} color={'#3B7DDD'}/>}
                />
            </div>
            <div className={`flex w-full p-3 `}>
                <div className={`w-full py-3 px-3 pl-0`}>
                    <div className={`h-[300px] pr-3 py-3 bg-white rounded-lg`}>
                        <ResponsiveContainer>
                            <BarChart data={monthlyJobs} width={530} height={250}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name" label={{
                                    value: `Tháng`,
                                    position: 'insideBottomRight',
                                    offset: -6
                                }}/>
                                <YAxis allowDecimals={false}/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="Bài đăng" fill="#8884d8"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}


type CompanyStatisticsProps = {
    name: string;
    icon: any,
    statistic: number,
    previousStatistics?: number,
    bottom?: any,
    style?: any,
    animate?: boolean
}


const CompanyStatisticCard: React.FC<CompanyStatisticsProps> = (item) => {
    return (
        <div className={`p-3 w-1/4`}>
            <div className={`rounded-lg bg-white relative   border-green-600 border overflow-hidden p-6 h-[170px]`}>
                <div className={`flex items-start`}>
                    <div className={`w-full mt-0 overflow-visible`}>
                        <p className={`text-[35px] mt-2 font-[400] leading-8 ${item.style}  ml-1 mb-5 `}>{item.statistic?.toLocaleString('vi-VN')}</p>
                    </div>
                    <div className={`flex-1 flex justify-end`}>
                        <div
                            className={`p-3 rounded-full bg-[#d3e2f7] flex items-center justify-center`}>
                            {item.icon}
                        </div>

                    </div>
                </div>

                <p className={`text-[#939ba2] ${item.style} uppercase font-semibold line-clamp-2 w-[170px]`}>{item.name}</p>
                {item.bottom}
            </div>
        </div>
    )
}


export const EmployerMessage = () => {
    const [typingMessage, setTypingMessage] = useState<string>('')
    const [loginUser, setLoginUser] = useState<UserResponse | null>(null)
    const [currentUserId, setCurrentUserId] = useState<string>('')
    const [currentRecipient, setCurrentRecipient] = useState<Participant>()
    const [privateChats, setPrivateChats] = useState<ChatMessage[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)
    const [allQuickMessages, setAllQuickMessages] = useState<QuickMessage[]>([])
    const [currentConversationId, setCurrentConversationId] = useState<number>()
    const navigate = useNavigate()


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
            let quickMessagePromises: Promise<QuickMessage>[] = []
            const refineQuickMessages = async (value: Conversation, participantId: string) => {
                const participant: Participant = await getParticipantById(participantId)
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
            quickMessagePromises = conversations.map(async (value) => {
                const participantId = value.senderId
                return refineQuickMessages(value, participantId)
            })

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

        // const rawUser = JSON.parse(localStorage.getItem('user'))
        // if (rawUser) {
        //     getLogInUser(rawUser.id)
        // } else {
        //     navigate('/login', {replace: true})
        // }


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

    return (
        <div className={`overflow-hidden `}>
            <div className={`flex text-[16px] overflow-hidden`}>
                {/*nav*/}
                <div
                    className={`w-[25%] px-3 min-w-[300px] h-screen flex flex-col relative min-h-screen  z-10 bg-white border-r border-r-gray-400 border-gray  overflow-hidden `}
                >
                    <div className={`overflow-y-auto bg-white py-2`}>
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

