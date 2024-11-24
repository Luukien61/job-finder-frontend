import {toast} from "react-toastify";
import {isSavedJob, saveJob} from "@/axios/Request.ts";
import {SelectProps} from "@/page/JobDetail.tsx";

export const handleSaveJob = async (jobId: number|string, userId: string, action : any) : Promise<boolean> => {
    try{
        const saved = await saveJob(jobId, userId)
        action()
        return saved
    }catch(err){
        toast.error("Co loi xay ra, vui long thu lai sau")
    }

}

export const refinePdfName = (items: string[]): SelectProps[] => {
    return items.map((item) => {
        const urlItem = item.split('/')
        const fileName = urlItem[urlItem.length - 1].replace('.pdf', '').replace('%20', ' ')
        return {
            value: item,
            label: fileName
        }
    })
}

export const checkIsJobSaved = async (jobId: string | number, userId: any): Promise<boolean> => {
    try {
        const response = await isSavedJob(jobId, userId);
        return response;
    } catch (error) {
        return false;
    }
};
