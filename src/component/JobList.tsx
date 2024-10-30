import React from 'react';

const JobList = () => {
    return (
        <div className={`w-[100%] flex flex-wrap items-center justify-start gap-y-6`}>
            <JobCard/>
            <JobCard/>
            <JobCard/>
        </div>
    );
};

export default JobList;
type JobDetail={
    description: string,
    requirement: string,
    benefit: string,
    expireTime: string,

}
type JobCardProps = {
    title: string;
    company: string;
    image: string;
    location: string;
    experience: string;
    salary: string;
    role: string;
    quantity: number;
    gender: string;
    report: number
}
export const JobCard=()=>{
    return(
        <div className={`w-1/3`}>

        </div>
    )
}