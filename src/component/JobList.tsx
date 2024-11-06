import React, {useEffect, useState} from 'react';
import {GrNext, GrPrevious} from "react-icons/gr";

const exampleJob : JobCardProps ={
    title: "Java Backend Developer (Banking Project) - Offer Upto 30M ",
    company: "Viettel",
    experience: 2,
    gender: "Nam",
    location: "Hà Nội",
    role : "Nhan vien",
    image: "https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/vnksUvAUJEzIxB7un4tTZrQ0cNWK6MAt_1719996933____3c701bdf079634d0e15cebed0655ae9d.png",
    quantity: 2,
    salary: "2-4 triệu",
    report: 0
}
const JobList = () => {
    return (
        <div className={`flex relative shadow-xl  flex-col bg-white rounded-2xl  my-3`}>
            <div className={`flex pl-8 rounded-t-2xl items-center bg-gradient-to-r from-white to-[#e6ffee]`}>
                <p className={`font-bold pt-4 text-[28px] text-green-500`}>Việc làm tốt nhất</p>
                <img alt={""} className={`w-12 aspect-square ml-4`} src={'/public/next-logo.png'}/>
                <div className={`flex-1 flex items-center justify-end`}>
                    <img alt={""} className={`w-16 mr-4 aspect-square`} src={'/public/shiring.png'}/>
                </div>
            </div>
            <div className={`w-[100%] p-4 flex flex-wrap items-center justify-start `}>
                {
                    Array.from(Array(20).keys()).map((item, index) =>
                        <JobCard index={index} item={exampleJob}/>
                    )
                }

            </div>
            <div className={`flex items-center gap-4 justify-center my-4`}>
                <div
                    className={`aspect-square group w-8 rounded-full flex items-center cursor-pointer hover:bg-green_default justify-center p-1 border border-green_default `}>
                    <GrPrevious className={`group-hover:text-white text-green_default`}/>
                </div>
                <div
                    className={`aspect-square group w-8 rounded-full flex items-center cursor-pointer hover:bg-green_default justify-center p-1 border border-green_default `}>
                    <GrNext className={`group-hover:text-white text-green_default`}/>
                </div>
            </div>
        </div>
    );
};

export default JobList;
type JobDetail = {
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
    experience: number;
    salary: string;
    role: string;
    quantity: number;
    gender: string;
    report: number;


}

type ImplicitJobCardProps = {
    index: number,
    item: JobCardProps;
}
export const JobCard: React.FC<ImplicitJobCardProps> = (item) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showOtherDiv, setShowOtherDiv] = useState(false);

    // useEffect(() => {
    //     let timer;
    //     if (isHovered) {
    //         timer = setTimeout(() => {
    //             setShowOtherDiv(true);
    //         }, 10000); // 2 seconds
    //     } else {
    //         clearTimeout(timer);
    //         setShowOtherDiv(false);
    //     }
    //     return () => clearTimeout(timer);
    // }, [isHovered]);

    const job = item.item
    const index = item.index
    return(
        <div className={`w-1/3 relative px-3 py-2`}>
            <a
                href={"/job/detail/1"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`cursor-pointer peer`}>
                <div
                    className={`border-green-500 shadow  hover:bg-[#F2FBF6] bg-gray-50/5 border hover:border-green-500 hover:border rounded-xl`}>
                    <div className={`w-full h-full flex items-start gap-x-[10px] p-[12px]`}>
                        <div
                            className={`aspect-[9/14] bg-white m-auto w-[96px]  flex items-center border border-[#dfdfdf] rounded-xl`}>
                            <img className={`h-full w-[80px] object-contain`} src={job.image} alt=""/>
                        </div>
                        <div className={`w-[calc(100%-96px)]  box-border h-full`}>
                            <div className={`border-b border-[#dfdfdf] pb-1`}>
                                <div className={`flex flex-col gap-y-1 `}>
                                    <p className={`text-green-500 h-12 font-bold line-clamp-2`}>{job.title}</p>
                                    <p className={`text-gray-500 font-medium`}>{job.company}</p>
                                    <p className={`text-green-500 font-bold text-[17px]`}>{job.salary}</p>
                                </div>
                            </div>
                            <div className={`flex gap-x-1 items-center justify-start my-2`}>
                                <div
                                    className={`rounded-[8px] bg-bg_default py-1 px-2 flex items-center justify-center`}>
                                    <p className={`text-black text-[14px] truncate `}>{job.location}</p>
                                </div>
                                <div
                                    className={`rounded-[8px] bg-bg_default py-1 px-2 flex items-center justify-center`}>
                                    <p className={`text-black text-[14px] truncate `}>{"Kinh nghiệm: "+job.experience + " năm"}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </a>
            <div className={`z-50  shadow-2xl ${showOtherDiv ? 'block' : 'hidden'} top-0 bottom-0 absolute w-full h-48 bg-white rounded border border-green-500 ${(index + 1) % 3 == 0 ? 'right-full' : 'left-full'}`}>
                <div className={`w-full h-full flex items-start gap-x-[10px] p-[12px]`}>
                    <div className={`flex `}>
                        <div>

                        </div>

                    </div>
                </div>


        </div>
</div>
)
}