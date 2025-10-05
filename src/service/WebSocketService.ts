// WebSocketService.ts
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'

export type Participant = {
  id: string
  name: string
  avatar: string
}


export type ChatMessage = {
  id: string
  senderId: string
  recipientId: string
  conversationId: number
  content: string
  timestamp: Date|string,
  type: string,
  caption?: string,
  // status: 'SENT'| "RECEIVED" | "DELIVERED"
}
export type Conversation = {
  id: number
  senderId: string
  receiverId: string
  modifiedAt: Date
  lastMessage: string,
  type: string
}

export let client: Client | null = null
const backendIP= import.meta.env.VITE_BACKEND_IP
// Hàm kết nối WebSocket
export const connectWebSocket = (onConnected: () => void): void => {
  client = new Client({
    brokerURL: `ws://${backendIP}:8088/ws`,
    onConnect: onConnected,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 40000
  })

  client.onWebSocketError = (error) => {
    console.error('Error with websocket', error)
  }

  client.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message'])
    console.error('Additional details: ' + frame.body)
  }

  client.activate() // Kích hoạt kết nối
}

// Hàm ngắt kết nối WebSocket
export const disconnectWebSocket = (): void => {
  if (client) {
    client.deactivate()
  }
}

// Hàm gửi tin nhắn đến server
export const sendMessage = (destination: string, message: ChatMessage): void => {
  if (client && client.connected) {
    client.publish({
      destination: destination,
      body: JSON.stringify(message),
      skipContentLengthHeader: true
    })
  }
}

// types/webrtc.ts
export interface RTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate' | 'call-rejected';
  targetUserId: string;
  senderUserId: string;
  senderName: string;
  senderAvatar: string;
  payload: RTCSessionDescriptionInit | RTCIceCandidateInit | null;
}

export interface VideoCallProps {
  userId: string;
  userName: string;
  targetUserId: string;
  senderName: string;
  senderAvatar: string;
  client: Client |null;  // từ @stomp/stompjs
}


// Hàm đăng ký nhận tin nhắn từ một endpoint cụ thể
export const subscribeToTopic = (
  destination: string,
  callback: (message: any) => void
): StompSubscription | undefined => {
  if (client && client.connected) {
    return client.subscribe(destination, (message: IMessage) => {
      callback(JSON.parse(message.body))
    })
  }
  return undefined
}




