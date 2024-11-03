import React, {useEffect, useState} from 'react';

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
        <div className={`flex relative flex-col gap-y-2 my-3`}>
            <div className={`flex `}>
                <p className={`font-bold text-[28px] text-green-500`}>Việc làm tốt nhất</p>

            </div>
            <div className={`w-[100%] flex flex-wrap items-center justify-start `}>
                {
                    Array.from(Array(20).keys()).map((item, index) =>
                        <JobCard index={index} item={exampleJob}/>
                    )
                }

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
export const JobCard: React.FC<ImplicitJobCardProps>=(item )=>{
    const [isHovered, setIsHovered] = useState(false);
    const [showOtherDiv, setShowOtherDiv] = useState(false);

    useEffect(() => {
        let timer;
        if (isHovered) {
            timer = setTimeout(() => {
                setShowOtherDiv(true);
            }, 10000); // 2 seconds
        } else {
            clearTimeout(timer);
            setShowOtherDiv(false);
        }
        return () => clearTimeout(timer);
    }, [isHovered]);

    const job = item.item
    const index = item.index
    return(
        <div className={`w-1/3  relative py-1 px-1`}>
            <a
                href={"/job/detail/1"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`cursor-pointer peer`}>
                <div
                    className={`border-green-500  hover:bg-[#F2FBF6] bg-white border hover:border-green-500 hover:border rounded-xl`}>
                    <div className={`w-full h-full flex items-start gap-x-[10px] p-[12px]`}>
                        <div
                            className={`aspect-[9/14] bg-white m-auto w-[96px]  flex items-center border border-[#dfdfdf] rounded-xl`}>
                            <img className={`h-full w-[80px] object-contain`} src={job.image} alt=""/>
                        </div>
                        <div className={`w-[calc(100%-96px)]  box-border h-full`}>
                            <div className={`border-b border-[#dfdfdf] pb-1`}>
                                <div className={`flex flex-col gap-y-1 `}>
                                    <p className={`text-green-500 font-bold truncate`}>{job.title}</p>
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