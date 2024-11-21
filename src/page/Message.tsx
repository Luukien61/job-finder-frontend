/* eslint-disable */
import React, {ChangeEvent, useEffect, useRef, useState} from 'react'
import {
    ConversationRequest,
    createConversation,
    getAllConversations,
    getMessagesByConversationId,
    getParticipant,
    getUserInfo,
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

type QuickMessage = {
    id: string
    recipientId: string
    avatar: string
    text: string
    name: string
    time: Date
    conversationId: string
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
    const [currentConversationId, setCurrentConversationId] = useState<string>()
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
        bottomRef.current?.scrollIntoView({behavior: 'instant'})
    }


    const getAllConversation = async (userId: string) => {
        try {
            const conversations: Conversation[] = await getAllConversations(userId)
            const quickMessagePromises = conversations.map(async (value) => {
                const userIds = value.userIds
                let participantId: string = userIds[1]
                if (userIds[0] !== userId) {
                    participantId = userIds[0]
                }
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
            })
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

            console.log("Updated Messages: ", updatedMessages);

            // Sắp xếp lại mảng và trả về mảng mới
            return updatedMessages.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        });

    }

    const getMessageByConversationId = async (conversationId: string) => {
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
        const rawUser = localStorage.getItem('user')
        const getLogInUser = async (userId: string) => {
            try {
                const user: UserResponse = await getUserInfo(userId)
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
        if (rawUser) {
            const user: UserResponse = JSON.parse(rawUser)
            getLogInUser(user.id)
        } else {
            navigate('/login', {replace: true})
        }
    }, [])

    const handleClickQuickMessage = async (conversationId: string, participantId: string) => {
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
    }, [privateChats])

    const sendMessages = async (message: string | null) => {
        let type: string = 'image'
        if (message == null) {
            message = typingMessage
            type = 'text'
        }

        if (message.trim() !== '' && currentRecipient && loginUser) {
            let conversationId = currentConversationId || ''
            let isConverExist = true
            if (!currentConversationId) {
                conversationId = Date.now().toString()
                const request: ConversationRequest = {
                    id: conversationId, //const uniqueId = uuidv4();
                    message: message,
                    type: type,
                    recipientId: currentRecipient.id,
                    senderId: currentUserId,
                    createdAt: new Date()
                }
                await createNewConversation(request)
                setCurrentConversationId(conversationId)
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

    const createNewConversation = async (request: ConversationRequest) => {
        try {
            setCurrentConversationId(request.id)
            await createConversation(request)
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

    // @ts-ignore
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
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
                    <div className={`w-full flex justify-start mt-4 bg-green_nga px-2 py-2 rounded-lg gap-4 items-center`}>
                        <a className={`flex justify-start gap-4 items-center`}
                            href={homePage}>
                            <img className={`w-14 mx-0 aspect-square`} src={'/public/logo.png'} alt={"logo"}/>
                            <p className={`font-bold text-[24px] text-white font-inter`}>{AppInfo.appName}</p>
                        </a>


                    </div>
                    {/*current user*/}
                    <div className={`border-b shadow sticky bg-white rounded mt-2 inset-0 z-20 bg-inherit pl-3 pb-3`}>
                        <div className={`flex gap-4 pt-4 pl-0 pb-3`}>
                            <div className={`flex gap-4 rounded-full cursor-pointer`}>
                                <img
                                    className={`w-[80px] rounded-full aspect-square object-cover`}
                                    src={loginUser?.avatar}
                                    alt={'avatar'}
                                />
                                <div className={`flex items-center justify-start truncate`}>
                                    <p className={`font-bold text-[18px]`}>{loginUser ? loginUser.name : ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`overflow-y-scroll bg-white `}>
                        {/*item*/}
                        {allQuickMessages.map((value, index) => (
                            <div
                                key={index}
                                onClick={() => handleClickQuickMessage(value.conversationId, value.recipientId)}
                                className={`px-2 mt-1 hover:bg-gray-100 border-t cursor-pointer rounded py-3  flex gap-x-2 ${currentRecipient && currentRecipient.id == value.recipientId ? 'bg-[#E5EFFF]' : 'bg-white'}`}
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
                                <VideoCall
                                    senderName={loginUser ? loginUser.name : ''}
                                    senderAvatar={loginUser ? loginUser.avatar : ''}
                                    userName={currentRecipient.name}
                                    client={client}
                                    userId={currentUserId}
                                    targetUserId={currentRecipient && currentRecipient.id}
                                />
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

export default Message
