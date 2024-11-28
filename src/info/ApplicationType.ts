export const DefaultPageSize = 10;

export interface JobApplication {
    "id": number,
    "userId": string,
    "userName": string,
    "userAvatar": string,
    "jobId": number,
    "cvUrl": string,
    "state": "PENDING" | "ACCEPTED" | "REJECTED",
    "referenceLetter": string,
    "createdDate": Date
}

export interface EmployerJobCard {
    "jobId": number,
    "title": string,
    "expireDate": Date,
    "state": "PENDING" | "DONE",
    "logo": string,
    "applications": JobApplication[]
}

export interface PageableResponse<T> {
    content: T[],
    pageable: {
        pageNumber: number,
        pageSize: number,
    },
    last: boolean,
    totalPages: number,
    totalElements: number,
    first: boolean,
    size: number,
    number: number,
    numberOfElements: number,
    empty: boolean,

}

export type JobDetailProps = {
    jobId: number; // Long -> number
    companyId: string;
    companyName: string;
    title: string;
    location: string;
    province: string;
    description: string;
    requirements: string;
    benefits: string;
    workTime: string;
    role: string;
    minSalary: number;
    maxSalary: number;
    experience: number;
    quantity: number;
    createdAt: Date; // LocalDate -> string (ISO 8601 format: YYYY-MM-DD)
    updateAt: Date; // LocalDate -> string
    expireDate: Date; // LocalDate -> string
    gender: string;
    type: string;
    field: string;
};

export type SearchProps={
    keyword: string,
    location?: string,
    minSalary?: number,
    maxSalary?: number,
    experience?: number,
    page?: number,
    size?: number,
}
export type JobSearchResult={
    "id": number,
    "title": string,
    "location": string,
    "companyName": string,
    "companyId": string,
    "logo": string,
    "experience": number,
    "minSalary": number,
    "maxSalary": number,
    "expiryDate": Date,
    "createDate": Date
}