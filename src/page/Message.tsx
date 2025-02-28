/* eslint-disable */
import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import {
    ConversationRequest,
    createConversation,
    getAllConversations,
    getCurrentParticipant,
    getMessagesByConversationId,
    getParticipant,
    searchConversationByUserIds,
} from '@/axios/Request'
import {VscSend} from 'react-icons/vsc'
import {CiImageOn} from 'react-icons/ci'

import {
    ChatMessage,
    client,
    connectWebSocket,
    Conversation,
    Participant,
    sendMessage,
    subscribeToTopic
} from '@/service/WebSocketService'
import {useNavigate} from 'react-router-dom'
import {toast, ToastContainer} from 'react-toastify'
import {imageUpload} from '@/service/Upload'
import VideoCall from '@/component/VideoCall'
import {delay, UserResponse} from "@/page/GoogleCode.tsx";
import {homePage} from "@/url/Url.ts";
import {AppInfo} from "@/info/AppInfo.ts";
import {useMessageReceiverState} from "@/zustand/AppState.ts";
import {checkIsCompanyBanned} from "@/service/ApplicationService.ts";
import {Spin, Watermark} from "antd";
import MessageItem from '@/component/MessageItem'
import VoiceRecorder from "@/component/VoiceRecorder.tsx";

export type QuickMessage = {
    id: number
    recipientId: string
    avatar: string
    text: string
    name: string
    time: Date | string
    conversationId: number
    type: string
}

const Message = () => {
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
    const [isBanned, setIsBanned] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const checkCompanyStatus = async (id) => {
        try {
            const isBanned: boolean = await checkIsCompanyBanned(id);
            setIsBanned(isBanned);
        } catch (e) {
            console.log(e);
        }
    }

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
            if (userId.startsWith("u_") || userId.startsWith('google_')) {
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
            // @ts-ignore
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
                await delay(1000)
                setIsLoading(false)
            } catch (e: any) {
                toast.error(e.response.data)
            }
        }

        const getCompany = async (rawUser) => {
            if (rawUser) checkCompanyStatus(rawUser.id)
            await delay(300)
            if (receiverId) {
                handleGetConversationByUserIds(rawUser.id, receiverId)
            }
        }

        let rawUser = JSON.parse(localStorage.getItem('user'))
        if (!rawUser) {
            rawUser = JSON.parse(localStorage.getItem('company'))
            getCompany(rawUser)
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
        // @ts-ignore
        if (!currentRecipient || currentRecipient.id != participantId) {
            await getMessageByConversationId(conversationId)
        }
        await delay(20)
        handleScroll()
    }

    useEffect(() => {
        handleScroll()
    }, [privateChats.length])

    const sendMessages = async (message: string | null, messageType: string | null) => {
        if (!isBanned) {
            let type: string
            if (messageType) {
                type = messageType
            } else {
                type = 'text'
            }
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
                sendMessage('/app/private-message', messageItem)
                setTypingMessage('')
                setPrivateChats((prevState) => [...prevState, messageItem])
                handleScroll()
                updateAllQuickMessage(messageItem)
                if (!isConverExist) getAllConversation(currentUserId)
            }
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
                            sendMessages(r, 'image')
                        }
                    })
                }
                reader.readAsDataURL(file)
            })
        }
    }

    // @ts-ignore
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                return
            }
            e.preventDefault()
            sendMessages(null, null)
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
                                        className={`w-[48px] h-[48px] rounded-full aspect-square object-cover`}
                                        src={loginUser?.avatar}
                                        alt={'avatar'}
                                    />
                                    <div className={`flex items-center overflow-hidden justify-start`}>
                                        <p className={`font-bold text-[18px] line-clamp-2`}>{loginUser ? loginUser.name : ''}</p>
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
                                                {value.type == 'image' && '[Hình ảnh]'}
                                                {value.type == 'audio' && '[Voice]'}
                                                {value.type == 'text' && value.text}
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
                                {client && !isBanned && (
                                    <VideoCall
                                        senderName={loginUser ? loginUser.name : ''}
                                        senderAvatar={loginUser ? loginUser.avatar : ''}
                                        userName={currentRecipient.name}
                                        userId={currentUserId}
                                        targetUserId={currentRecipient && currentRecipient.id}
                                        display={true}
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
                                                <MessageItem
                                                    currentUserId={currentUserId}
                                                    index={index}
                                                    value={value}
                                                    isGroup={false}/>
                                            ))}
                                    </div>
                                    <div className={`h-[14px] break-words `} ref={bottomRef}></div>
                                </div>
                            </div>
                        </div>
                        {/*type*/}
                        <div className={`flex flex-col bg-white px-3`}>
                            <div className={`flex items-center gap-3 justify-start py-1 border-b w-full`}>
                                <label
                                    className="flex flex-col items-center justify-start w-fit h-full  rounded-lg cursor-pointer  ">
                                    <CiImageOn size={26}/>
                                    <input
                                        disabled={!currentRecipient || isBanned}
                                        onChange={handleImageChange}
                                        id="dropzone-file"
                                        type="file"
                                        accept={'image/*'}
                                        multiple={true}
                                        className="hidden outline-none"
                                    />
                                </label>
                                <VoiceRecorder sendMessages={sendMessages}/>
                            </div>

                            <div className={`bg-white  flex py-2 items-center gap-x-3`}>
                                <textarea
                                    disabled={!currentRecipient || isBanned}
                                    onKeyDown={handleKeyDown}
                                    value={typingMessage}
                                    onChange={(e) => setTypingMessage(e.target.value)}
                                    spellCheck={false}
                                    placeholder={'Nhập tin nhắn...'}
                                    className={`w-full px-3 py-2 outline-none resize-none flex-1 self-center !h-[50px]`}
                                />
                                <div
                                    onClick={() => sendMessages(null, null)}
                                    className={`${currentRecipient ? 'cursor-pointer hover:text-green-500' : 'disabled'}`}
                                >
                                    <VscSend size={28}/>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`flex-1`}>
                        <Watermark
                            content={['JobFinder connector', 'Happy Working']}
                            height={40}
                            width={150}
                            image={'public/logo.png'}
                        >
                        <div className={`h-screen`}/>
                        </Watermark>
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
            {
                isLoading && <Spin size={"large"} fullscreen={true}/>
            }
        </div>
    )
}

export default Message
