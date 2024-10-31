import {instance} from "@/axios/Config.ts";

export const getAllConversations = async (id: string) => {
    try {
        return await instance.get(`/chat/all/${id}`)
            .then(response => response.data)
    } catch (error) {
        console.log(error)
    }

}

export const getParticipant = async (id:string) => {

    // eslint-disable-next-line no-useless-catch
    try {
        return await instance.get(`/participant/${id}`)
            .then(response => response.data)
    } catch (error) {
        throw error
    }

}

export const getMessages= async (id: string, page: number) => {
    try {
        return await instance.get(`/message/${id}/${page}`)
            .then(response => response.data)
    } catch (error) {
        console.log(error)
    }
}