export const DefaultPageSize = 5;

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