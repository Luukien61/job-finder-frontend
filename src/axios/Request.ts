import {instance} from "@/axios/Config.ts";
import axios from "axios";
import {companyBackendPath} from "@/info/AppInfo.ts";
import {DefaultPageSize, DefaultRecommendationPageSize} from "@/info/ApplicationType.ts";
import {ChatMessage} from "@/service/WebSocketService.ts";


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

export const loginUser = async (request: any) => {
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
        .get(`/conversation?sender=${user1Id}&receiver=${user2Id}`)
        .then((response) => response.data)
}
export type ConversationRequest = {
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

export const getParticipantById = async (id: string) => {
    return await instance.get(`/message/participant/${id}`).then((response) => response.data)
}

export const getMessagesByConversationId = async (id: number) => {
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
export const updateJob = async (jobId: string, request: any) => {
    return await instance.post(`/job/update`, request).then((response: any) => response.data)
}

export const getCompanyInfo = async (id: string) => {
    return await instance.get(`${companyBackendPath}/${id}`).then((response: any) => response.data)
}
export const isCompanyBanned = async (id: string) => {
    return await instance.get(`${companyBackendPath}/${id}/status`).then((response: any) => response.data)
}

export const updateCompanyInfo = async (companyId: string, request: any) => {
    return await instance.put(`${companyBackendPath}/${companyId}`, request).then((response: any) => response.data)
}
export const getJobDetailById = async (id: string | number) => {
    return await instance.get(`/job/${id}`).then((response: any) => response.data)
}

export const getJobDetailByIdWithHistory = async (id: string | number, headers: any | null) => {
    return await instance.get(`/job/${id}/valid`, headers).then((response: any) => response.data)
}

const applicationPath = '/application'
export const applyJob = async (request: any) => {
    return await instance.post(`${applicationPath}/apply`, request).then((response: any) => response.data)
}

export const isAppliedJob = async (jobId: string, userId: string) => {
    return await instance.get(`${applicationPath}/applied?jobId=${jobId}&userId=${userId}`).then((response: any) => response.data)
}

export const saveJob = async (jobId: string | number, userId: any) => {
    return await instance.post(`/user/${userId}/save?jobId=${jobId}`).then((response: any) => response.data)
}

export const unSaveJob = async (jobId: string | number, userId: any) => {
    return await instance.post(`/user/${userId}/unsave?jobId=${jobId}`).then((response: any) => response.data)
}

export const isSavedJob = async (jobId: string | number, userId: any) => {
    return await instance.get(`/user/${userId}/save?jobId=${jobId}`).then((response: any) => response.data)
}

export const getJobsByCompanyId = async (companyId: string, page: number, size = DefaultPageSize) => {
    return await instance.get(`/job/company/${companyId}?page=${page}&size=${size}`).then((response: any) => response.data)
}

export const getApplicationsByJobId = async (jobId: string | number) => {
    return await instance.get(`${applicationPath}/job/${jobId}`).then((response: any) => response.data)
}

export const getUserBasicInfo = async (userId: string) => {
    return await instance.get(`/user/${userId}/basic`).then((response: any) => response.data)
}
export const acceptApplication = async (appId: any) => {
    return await instance.post(`/application/${appId}/accept`).then((response: any) => response.data)
}

export const rejectApplication = async (appId: any) => {
    return await instance.post(`/application/${appId}/reject`).then((response: any) => response.data)
}
const messagePath = '/message/participant'
export const getCurrentParticipant = async (id: string) => {
    return await instance.get(`${messagePath}/${id}`).then((response: any) => response.data)
}

export const createReport = async (jobId: string, request: any) => {
    return await instance.post(`/api/reports/job?id=${jobId}`, request).then((response: any) => response.data)
}
const companyPath = '/api/companies'
export const canPostJob = async (companyId: string) => {
    return await instance.get(`${companyPath}/${companyId}/possibility/job`).then((response: any) => response.data)
}

export const searchJobs = async (params: string, headers: any | null) => {
    return await instance.get(`/job/search?${params}`, headers).then((response: any) => response.data)
}

export const getRecommendedJob = async (body: any) => {
    return await axios.post(`http://localhost:8000/recommendations`, body, {
        headers: {'Content-Type': 'application/json'}
    }).then((response: any) => response.data)
}

export const getNewJobs = async (page: number) => {
    return await instance.get(`/job/news?page=${page}&size=${DefaultRecommendationPageSize}`).then((response: any) => response.data)
}
const ADMIN_PATH = '/admin'
export const getEmployeesInMonth = async (month, year) => {
    return await instance.get(`${ADMIN_PATH}/user/quantity`, {
        params: {
            month,
            year
        }
    }).then((response: any) => response.data)
}

export const adminLogin=async (body: any) => {
    return await instance.post(`${ADMIN_PATH}/login`, body).then((response: any) => response.data)
}
export const getTotalEmployees = async () => {
    return await instance.get(`${ADMIN_PATH}/user/total`).then((response: any) => response.data)
}
export const getUserStatistics = async (month: number, year: number) => {
    return await instance.get(`${ADMIN_PATH}/user/statistics?month=${month}&year=${year}`).then((response: any) => response.data)
}
export const getCompanyInMonth = async (month: number, year: number) => {
    return await instance.get(`${ADMIN_PATH}/company/quantity`, {
        params: {
            month,
            year
        }
    }).then((response: any) => response.data)
}
export const getJobsIn12Month = async (month: number, year: number) => {
    return await instance.get(`${ADMIN_PATH}/job/quantity`, {
        params: {
            month,
            year
        }
    }).then((response: any) => response.data)
}
export const getJobsAllFields = async (month: number, year: number) => {
    return await instance.get(`${ADMIN_PATH}/jobs/fields`, {
        params: {
            month,
            year
        }
    }).then((response: any) => response.data)
}

export const getJobByCompaniesInMonth = async (month: number, year: number) => {
    return await instance.get(`${ADMIN_PATH}/jobs/company`, {
        params: {
            month,
            year
        }
    }).then((response: any) => response.data)
}

export const getDailyJobs = async (month: number, year: number) => {
    return await instance.get(`${ADMIN_PATH}/job/quantity/day`, {
        params: {
            month,
            year
        }
    }).then((response: any) => response.data)
}
export const getReportedJobs = async () => {
    return await instance.get(`${ADMIN_PATH}/job/reported`).then((response: any) => response.data)
}

export const getReportDetails = async (jobId: number) => {
    return await instance.get(`${ADMIN_PATH}/${jobId}/reason`).then((response: any) => response.data)
}

export const banCompany = async (companyId: string, body) => {
    return await instance.put(`${ADMIN_PATH}/ban/${companyId}`, body).then((response: any) => response.data)
}
const NOTIFICATION = '/notification'
export const updateNotificationStatus = async (id: number, status: string) => {
    return await instance.post(`${NOTIFICATION}/${id}/status/update/${status}`).then((response: any) => response.data)
}
export const getAllNotifications = async (userId: string) => {
    return await instance.get(`${NOTIFICATION}/${userId}/all`).then((response: any) => response.data)
}
export const countAllNotificationDeliveried = async (userId: string) => {
    return await instance.get(`${NOTIFICATION}/${userId}/delivery`).then((response: any) => response.data)
}
export const getCompanyStatistics = async (companyId: string, month: number, year: number) => {
    return await instance.get(`/api/companies/${companyId}/statistics`, {
        params: {
            month,
            year
        }
    }).then((response: any) => response.data)
}

export const getCompanyJobStatistics = async (companyId: string) => {
    return await instance.get(`/api/companies/${companyId}/job/statistics`).then((response: any) => response.data)
}

export const customHeaders = async (): Promise<void> => {
    return await instance.get(`job/customHeaders`, {
        headers: {
            "X-custom-userId": 'userId'
        }
    })
}
const pricePath ='/webhook'
export const getPrices=async () => {
    return await instance.get(`${pricePath}/prices`).then((response: any) => response.data)
}

export const priceCheckOut = async ( body ) => {
    return await instance.post(`${pricePath}/create-checkout-session`, body).then((response: any) => response.data)
}
export const verifySession=async (body: any)=>{
    return await instance.post(`${pricePath}/verify-session`, body).then((response: any) => response.data)
}

export const getCompanyPlan=async (companyId: string) => {
    return await instance.get(`subscription/${companyId}`).then((response: any) => response.data)
}

export const getPlanPriority = async () => {
    return await instance.get(`subscription/plan/priority`).then((response: any) => response.data)
}

export const getUpgradeCheckoutUrl =async (body) => {
    return await instance.get(`subscription/upgrade-session`, body).then((response: any) => response.data)
}

export const rejectBanRequest=async (jobId)=>{
    return await instance.put(`${ADMIN_PATH}/report/rejection/${jobId}`).then((response: any) => response.data)
}

export const upgradeVerify=async (body: any) => {
    return await instance.post(`subscription/update-subscription`, body).then((response: any) => response.data)
}

export const cancelSubscription=async (body: any) => {
    return await instance.post(`subscription/cancel-subscription`, body).then((response: any) => response.data)
}

export const getCompanies = async (page, size) => {
    return await instance.get(`/api/companies?page=${page}&size=${size}&sortBy=name&sortOrder=desc`).then((response: any) => response.data)
}

export const getAudioCaption = async (body) => {
    return await axios.post(`http://localhost:8000/transcribe`, body).then((response) => response.data)
}

export const updateMessage=async (message: ChatMessage) => {
    return await instance.put(`/message`, message).then((response) => response.data)
}

export const sendVoice = async (formData) => {
    return await instance
        .post(`/voice`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => response.data)
}
