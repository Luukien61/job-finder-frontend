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

export interface EmpoyerJobCard {
    "jobId": number,
    "title": string,
    "expireDate": Date,
    "state": "PENDING" | "DONE",
    "logo": string,
    "applications": JobApplication[]
}