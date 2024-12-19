import {toast} from "react-toastify";
import {getCompanyPlan, isCompanyBanned, isSavedJob, saveJob, unSaveJob} from "@/axios/Request.ts";
import {SelectProps} from "@/page/JobDetail.tsx";
import {format} from "date-fns";
import {CompanyPlan, CompanySubscription, Price, SearchProps} from "@/info/ApplicationType.ts";

export const handleSaveJob = async (jobId: number | string, userId: string, action: any): Promise<boolean> => {
    try {
        const saved = await saveJob(jobId, userId)
        action()
        return saved
    } catch (err) {
        toast.error("Co loi xay ra, vui long thu lai sau")
    }

}

export const unSaveJobHandler = async (jobId: number | string, userId: any, action: any) => {
    try {
        const isSave = await unSaveJob(jobId, userId)
        action()
        return isSave
    } catch (err) {
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

export const convertDate = (date: Date) => {
    if (date) {
        return format(date, 'dd/MM/yyyy').toString()
    }
    return ""
}

export const checkIsJobSaved = async (jobId: string | number, userId: any): Promise<boolean> => {
    try {
        const response = await isSavedJob(jobId, userId);
        return response;
    } catch (error) {
        return false;
    }
};

export const formatDate = (date: Date) => {
    return new Date(
        date.toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'})
    );
}

export const createSearchParams = (params: SearchProps): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value || value === 0) {
            searchParams.append(key, String(value));
        }
    });
    return searchParams.toString();
}

export const getLast12Months = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1); // Lùi từng tháng
        const month = date.getMonth() + 1; // Lấy tháng (1-12)
        const year = date.getFullYear(); // Lấy năm
        months.push({month, year});
    }

    return months.reverse();
}

export const checkIsCompanyBanned = async (id): Promise<boolean> => {
    try {
        return await isCompanyBanned(id);

    } catch (err) {
        console.log(err)
    }
}

export const fetchCompanyPlan = async (companyId) => {
    try {
        const plan: CompanySubscription = await getCompanyPlan(companyId);
        return plan;
    } catch (err) {
        console.log(err)
    }
}

export interface LimitProps {
    isLimit: boolean,
    limit?: number,
}
export const BASIC_LIMIT=30
export const DEFAULT_LIMIT=15

export const getLimitPost = (plan: string): LimitProps => {
    switch (plan) {
        case 'Ultimate':
            return {isLimit: false};
        case 'Pro':
            return {isLimit: false};
        case 'Basic':
            return {isLimit: true, limit: BASIC_LIMIT};
        default:
            return {isLimit: true, limit: DEFAULT_LIMIT};
    }
}

export const moveToMiddle = (id: string , items : Price[]): Price[] => {
    const targetItem = items.find((item) => item.product === id);
    if (!targetItem) return;
    const remainingItems = items.filter((item) => item.product !== id);
    const middleIndex = Math.floor(remainingItems.length / 2);
    return [
        ...remainingItems.slice(0, middleIndex),
        targetItem,
        ...remainingItems.slice(middleIndex),
    ];
};

