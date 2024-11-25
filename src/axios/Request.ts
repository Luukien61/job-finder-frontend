import {instance} from "@/axios/Config.ts";
import axios from "axios";
import {companyBackendPath} from "@/info/AppInfo.ts";
import {DefaultPageSize} from "@/info/ApplicationType.ts";


export const getMessages = async (id: string, page: number) => {
    try {
        return await instance.get(`/message/${id}`)
            .then(response => response.data)
    } catch (error) {
        console.log(error)
    }
}

export const loginWithGoogle = async (code: string) => {
    return instance.post("/google/login", {code: code}).then((response: any) => response.data)
}

export const signupWithGoogle = async (code: string) => {
    return instance.post("/google/signup", {code: code}).then((response: any) => response.data)
}

export const signUpUser = async (request: any) => {
    return await instance.post(`/user/signup`, request).then((response: any) => response.data)
}

export const loginUser=async (request: any) => {
    return await instance.post(`/user/login`, request).then((response: any) => response.data)
}

export const getSignupCode = async (template: any) => {
    return await instance.post(`/signup/code`, template).then((response: any) => response.data)
}

export const getUserDto = async (id: string) => {
    return await instance.get(`/user/${id}`).then((response: any) => response.data)
}

export const getUserInfo = async (id: string) => {
    return await instance.get(`user/info/${id}`).then((response: any) => response.data)
}

export const searchUserByEmail = async (email: string) => {
    return await instance.get(`/user/search?email=${email}`).then((response) => response.data)
}

export const searchConversationByUserIds = async (user1Id: string, user2Id: string) => {
    return await instance
        .get(`/conversation?user1=${user1Id}&user2=${user2Id}`)
        .then((response) => response.data)
}
export type ConversationRequest = {
    id: string,
    senderId: string,
    recipientId: string,
    type: string,
    message: string,
    createdAt: Date,
}

export const createConversation = async (request: ConversationRequest) => {
    return await instance.post(`/conversation/private`, request).then((response) => response.data)
}

export const getAllConversations = async (id: string) => {
    return await instance.get(`/chat/all/${id}`).then((response) => response.data)
}

export const getParticipant = async (id: string) => {
    return await instance.get(`/participant/${id}`).then((response) => response.data)
}

export const getMessagesByConversationId = async (id: string) => {
    return await instance.get(`/message/${id}`).then((response) => response.data)
}

export const completeProfile = async (body) => {
    return await instance.post(`/user/complete`, body).then((response: any) => response.data)
}

export const uploadCvToAWS = async (body) => {
    return await axios.post('http://localhost:8000/cv', body).then((response: any) => response.data)
}

export const uploadCvToAWSSpring = async (id, body) => {
    return await axios.post(`http://localhost:8088/user/${id}/cv`, body, {
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response: any) => response.data)
}

export const updateCv = async (id: string, body) => {
    return await instance.post(`/user/${id}/cv`, body).then((response: any) => response.data)
}

export const deleteCvById = async (userId, url) => {
    return await instance.delete(`/user/${userId}/cv`, {
        data: {
            value: url
        }
    }).then((response: any) => response.data)
}

export const getAllSavedJobsByUserId = async (id: string) => {
    return await instance.get(`/user/${id}/saved`).then((response: any) => response.data)
}
export const getAppliedJobsByUserId = async (id: string) => {
    return await instance.get(`/user/${id}/applied`).then((response: any) => response.data)
}

export const sendAccountVerification = async (request) => {
    return await instance.post(`/user/account/verification`, request).then((response: any) => response.data)
}
export const updateAccount = async (request: any) => {
    return await instance.post(`/user/account/update`, request).then((response: any) => response.data)
}
export const updateProfile = async (request: any) => {
    return await instance.put(`/user/profile`, request).then((response: any) => response.data)
}

export const getVerificationCode = async (template: any) => {
    return await instance.post(`/code`, template).then((response: any) => response.data)
}

export const employerSignUp = async (request: any) => {
    return await instance.post(`/api/companies`, request).then((response: any) => response.data)
}

export const employerLogin = async (request: any) => {
    return await instance.post(`/api/companies/login`, request).then((response: any) => response.data)
}

export const addJob = async (companyId, request: any) => {
    return await instance.post(`/job/${companyId}`, request).then((response: any) => response.data)
}

export const getCompanyInfo = async (id: string) => {
    return await instance.get(`${companyBackendPath}/${id}`).then((response: any) => response.data)
}

export const getJobDetailById = async (id: string | number) => {
    return await instance.get(`/job/${id}`).then((response: any) => response.data)
}
const applicationPath='/application'
export const applyJob = async ( request: any) => {
    return await instance.post(`${applicationPath}/apply`, request).then((response: any) => response.data)
}

export const isAppliedJob = async (jobId: string, userId: string) => {
    return await instance.get(`${applicationPath}/applied?jobId=${jobId}&userId=${userId}`).then((response: any) => response.data)
}

export const saveJob = async (jobId: string|number, userId: any) => {
    return await instance.post(`/user/${userId}/save?jobId=${jobId}`).then((response: any) => response.data)
}

export const unSaveJob = async (jobId: string|number, userId: any) => {
    return await instance.post(`/user/${userId}/unsave?jobId=${jobId}`).then((response: any) => response.data)
}

export const isSavedJob = async (jobId: string|number, userId: any) => {
    return await instance.get(`/user/${userId}/save?jobId=${jobId}`).then((response: any) => response.data)
}

export const getJobsByCompanyId = async (companyId: string, page: number, size=DefaultPageSize ) => {
    return await instance.get(`/job/company/${companyId}?page=${page}&size=${size}`).then((response: any) => response.data)
}