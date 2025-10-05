import React, {useEffect, useRef, useState} from 'react';
import Header from "@/component/Header.tsx";
import {Outlet} from "react-router-dom";
import Footer from "@/component/Footer.tsx";
import {Bot, ExternalLink, MessageCircle, Send, User, X} from "lucide-react";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface ChatPopupProps {
    webhookUrl?: string;
    botName?: string;
    primaryColor?: string;
    position?: 'bottom-right' | 'bottom-left';
}

interface MessageRendererProps {
    text: string;
    isUser: boolean;
}

interface ParsedElement {
    type: 'text' | 'link' | 'linebreak';
    content: string;
    url?: string;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ text, isUser }) => {
    const parseMessage = (message: string): ParsedElement[] => {
        const elements: ParsedElement[] = [];
        let remaining = message;

        while (remaining.length > 0) {
            // Check for markdown links [text](url)
            const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

            if (linkMatch) {
                const beforeLink = remaining.substring(0, linkMatch.index);

                // Add text before link if exists
                if (beforeLink) {
                    // Split by line breaks
                    const lines = beforeLink.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i]) {
                            elements.push({ type: 'text', content: lines[i] });
                        }
                        if (i < lines.length - 1) {
                            elements.push({ type: 'linebreak', content: '' });
                        }
                    }
                }

                // Add the link
                elements.push({
                    type: 'link',
                    content: linkMatch[1],
                    url: linkMatch[2]
                });

                // Continue with remaining text
                remaining = remaining.substring((linkMatch.index || 0) + linkMatch[0].length);
            } else {
                // No more links, process remaining text for line breaks
                const lines = remaining.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i]) {
                        elements.push({ type: 'text', content: lines[i] });
                    }
                    if (i < lines.length - 1) {
                        elements.push({ type: 'linebreak', content: '' });
                    }
                }
                break;
            }
        }

        return elements;
    };

    const parsedElements = parseMessage(text);

    return (
        <div className="text-sm">
            {parsedElements.map((element, index) => {
                switch (element.type) {
                    case 'link':
                        return (
                            <a
                                key={index}
                                href={element.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 underline hover:no-underline transition-colors ${
                                    isUser
                                        ? 'text-blue-600 hover:text-blue-800'
                                        : 'text-blue-100 hover:text-white'
                                }`}
                            >
                                {element.content}
                                <ExternalLink size={12} />
                            </a>
                        );
                    case 'linebreak':
                        return <br key={index} />;
                    case 'text':
                    default:
                        return <span key={index}>{element.content}</span>;
                }
            })}
        </div>
    );
};


const ChatPopup: React.FC<ChatPopupProps> = ({
                                                 webhookUrl,
                                                 botName = 'Assistant',
                                                 position = 'bottom-right'
                                             }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Xin chào! Tôi là ${botName}. Tôi có thể giúp gì cho bạn?`,
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputValue,
                    sessionId: 'user-session-' + Date.now(),
                    timestamp: new Date().toISOString()
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            console.log('Response:', data)

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || data.output || 'Xin lỗi, tôi không thể trả lời lúc này.',
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const positionClasses = position === 'bottom-right'
        ? 'bottom-4 right-4'
        : 'bottom-4 left-4';

    return (
        <div className={`fixed ${positionClasses} z-50`}>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full shadow-lg bg-green_default hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-white"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div
                        className="p-4 text-white flex items-center justify-between bg-green_default"
                    >
                        <div className="flex items-center space-x-2">
                            <Bot size={20} />
                            <span className="font-medium">{botName}</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-black hover:bg-opacity-10 p-1 rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start space-x-2 max-w-[75%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        message.isUser
                                            ? 'bg-gray-300 text-gray-600'
                                            : 'text-white'
                                    }`}>
                                        {message.isUser ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <div
                                            className={`p-3 rounded-lg ${
                                                message.isUser
                                                    ? 'bg-gray-200 text-gray-800'
                                                    : 'text-white bg-green_default'
                                            }`}
                                        >
                                            <MessageRenderer text={message.text} isUser={message.isUser} />
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-start space-x-2 max-w-[75%]">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-green_default"
                                    >
                                        <Bot size={16} />
                                    </div>
                                    <div className="p-3 rounded-lg text-white bg-green_default" >
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                                disabled={isLoading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="px-4 py-2 text-white rounded-lg bg-green_default hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
    return (
        <div className={'bg-default'}>
            <Header/>
            <Outlet/>
            <Footer/>
            <ChatPopup webhookUrl={'http://localhost:5678/webhook/d82f7779-bfee-4f01-b819-6b945dca78a0/chat'} />
        </div>
    );
};

export default App;