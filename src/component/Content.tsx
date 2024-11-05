import React, {useState} from 'react';
import {experiences, fields, provinces, salaries} from "../info/AppInfo.ts";
import {CiLocationOn, CiSearch} from "react-icons/ci";
import {IoIosArrowDown} from "react-icons/io";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import CarouselBanner, {Banner} from "@/component/CarouselBanner.tsx";
import JobList from "@/component/JobList.tsx";
import {PiShoppingBagOpen} from "react-icons/pi";
import Footer from "@/component/Footer.tsx";
import {GrNext, GrPrevious} from "react-icons/gr";

const Content = () => {

    return (
        <div className={`flex justify-center `}>
            <div className={`w-full`}>
                <Search/>
                <div className={`flex flex-col mt-4 items-center justify-center `}>
                    <div className={`custom-container px-2 flex flex-col gap-10`}>
                        <JobList/>
                        <CompanyList/>
                    </div>
                    <div className={`bg-impress rounded shadow-2xl custom-container relative w-screen my-10 bg-cover min-h-fit bg-no-repeat `}>
                        <div className={`p-12 items-start justify-center flex flex-col gap-10`}>
                            <svg className={`fill-[#217353]  absolute left-0`} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 984 984" width="500" height="500"
                            >
                                <g>
                                    <path className="st0" d="M968.5,492c0,31.2-3.1,62.4-9.2,93c-6.1,30.6-15.2,60.6-27.2,89.4c-23.9,57.6-59.3,110.4-103.5,154.4
		c-44.1,44.1-96.9,79.4-154.5,103.2c-28.8,11.9-58.8,21-89.3,27c-30.6,6-61.7,9-92.9,9c-31.1,0-62.3-3.1-92.8-9.2
		c-30.5-6.1-60.5-15.2-89.2-27.1c-57.5-23.9-110.2-59.3-154.2-103.3c-44-44.1-79.3-96.8-103-154.3c-11.9-28.8-20.9-58.7-26.9-89.2
		c-6-30.5-9-61.6-9-92.7c0-31.1,3.1-62.2,9.1-92.7C32,368.8,41,338.9,53,310.2c23.8-57.5,59.2-110.1,103.2-154
		c44-43.9,96.7-79.2,154.1-102.9c28.7-11.9,58.6-20.9,89.1-26.9c30.5-6,61.6-9,92.6-9c31.1,0,62.1,3.1,92.6,9.1
		c30.5,6.1,60.3,15.1,89,27c57.4,23.8,109.9,59.1,153.8,103.1c43.9,43.9,79.1,96.5,102.8,153.9c11.9,28.7,20.9,58.5,26.9,89
		c6,30.4,9,61.5,9,92.5H968.5z M966,492c0-31-3.1-62-9.1-92.5c-6-30.4-15.1-60.2-27-88.9c-23.8-57.3-59-109.8-102.9-153.6
		c-43.9-43.8-96.4-79-153.7-102.6c-28.6-11.8-58.5-20.9-88.9-26.8c-30.4-6-61.4-9-92.4-9c-31,0-62,3.1-92.4,9.1
		c-30.4,6-60.2,15.1-88.8,27c-57.2,23.7-109.6,58.9-153.4,102.8C113.7,201.3,78.6,253.8,55,311c-11.8,28.6-20.8,58.4-26.8,88.7
		c-6,30.4-9,61.3-8.9,92.3c0,30.9,3.1,61.9,9.1,92.2c6,30.3,15.1,60.1,26.9,88.7C79,730,114.2,782.4,157.9,826.1
		c43.8,43.7,96.1,78.8,153.3,102.4c28.6,11.8,58.3,20.8,88.6,26.8c30.3,6,61.2,8.9,92.1,8.9c30.9,0,61.8-3.1,92.1-9.1
		c30.3-6,60-15,88.5-26.9c57.1-23.7,109.3-58.8,153-102.5c43.7-43.7,78.6-96,102.2-153.1c11.8-28.5,20.8-58.2,26.7-88.5
		c6-30.3,8.9-61.2,8.9-92H966z"></path>
                                </g>
                            </svg>
                            <div className={`flex items-center justify-center gap-8 w-full`}>
                                <img className={`h-1 w-[246px]`}
                                     src={`https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/mobile-app/decorated_title_green.png`}
                                     alt=""/>
                                <h2 className="text-white font-bold text-[36px]">Con số ấn tượng</h2>
                                <img className={`h-1 w-[246px] -scale-x-100`}
                                     src={`https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/mobile-app/decorated_title_green.png`}
                                     alt=""/>
                            </div>
                            <div className={`flex w-full items-start gap-9 justify-center`}>
                                <div
                                    className={`bg-impress-item bg-no-repeat inline-block w-[497px] relative h-[166px] cursor-pointer bg-cover `}>
                                    <span className="flex flex-col h-full justify-center pt-5 pr-6 pb-4 pl-16 w-full">
                                        <div className="text-white text-3xl font-bold mb-1 ">1000+</div>
                                        <div className="text-[#01d660] text-[16px] font-bold mb-0.5 leading-6">Nhà tuyển dụng uy tín</div>
                                        <div className="text-white">Các nhà tuyển dụng đến từ tất cả các ngành nghề và được xác thực bởi JobFinder</div>
                                    </span>

                                </div>
                                <div
                                    className={`bg-impress-item bg-no-repeat inline-block w-[497px] relative h-[166px] cursor-pointer bg-cover `}>
                                    <span className="flex flex-col h-full justify-center pt-5 pr-6 pb-4 pl-16 w-full">
                                        <div className="text-white text-3xl font-bold mb-1 ">2.000+</div>
                                        <div className="text-[#01d660] text-[16px] font-bold mb-0.5 leading-6">Việc làm đã được kết nối</div>
                                        <div className="text-white">JobFinder đồng hành và kết nối hàng nghìn ứng viên với những cơ hội việc làm hấp dẫn từ các doanh nghiệp uy tín.</div>
                                    </span>

                                </div>
                            </div><div className={`flex w-full items-start gap-9 justify-center`}>
                                <div
                                    className={`bg-impress-item bg-no-repeat inline-block w-[497px] relative h-[166px] cursor-pointer bg-cover `}>
                                    <span className="flex flex-col h-full justify-center pt-5 pr-6 pb-4 pl-16 w-full">
                                        <div className="text-white text-3xl font-bold mb-1 ">100.000+</div>
                                        <div className="text-[#01d660] text-[16px] font-bold mb-0.5 leading-6">Ứng viên hoạt động hàng tháng</div>
                                        <div className="text-white">Các ứng viên tiềm năng từ khắp mọi nơi luôn chọn JobFinder là một người bạn đồng hành</div>
                                    </span>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const Filter = () => {
    const [locationChoose, setLocationChoose] = useState<string>("Location");
    const [locationOpen, setLocationOpen] = useState<boolean>(false)
    const [salary, setSalary] = useState<string>("Salary");
    const [isSalaryOpen, setIsSalaryOpen] = useState<boolean>(false)
    const [salaryRange, setSalaryRange] = useState<number[]>()
    const [experience, setExperience] = useState<string>("Experience")
    const [isExperienceOpen, setIsExperienceOpen] = useState<boolean>(false)
    const [experienceRange, setExperienceRange] = useState<number[]>()


    const handleLocationChoose = (location: string) => {
        setLocationOpen(false)
        setLocationChoose(location)
    }
    const handleOpenLocation = () => {
        setLocationOpen(prevState => !prevState);
        setIsSalaryOpen(false);
        setIsExperienceOpen(false)

    }

    const handleSalaryClick = () => {
        setIsSalaryOpen(prevState => !prevState);
        setIsExperienceOpen(false)
        setLocationOpen(false)
    }
    const handleSalaryChoose = (salary: string, index: number) => {
        setIsSalaryOpen(false)
        setSalary(salary)
        setSalaryRange(salaries[index])
        console.log(salaries[index])
    }

    const handleExperienceClick = () => {
        setIsExperienceOpen(prevState => !prevState);
        setIsSalaryOpen(false);
        setLocationOpen(false)
    }
    const handleExperienceChoose = (experience: string, index: number) => {
        setIsExperienceOpen(false)
        setExperience(experience)
        setExperienceRange(experiences[index])
    }

    const processedSalary = salaries.map((item, index) => {
        if (index == 0) {
            return "Duoi " + item[0]
        } else {
            if (item.length > 1) {
                return "Tu " + item[0] + "-" + item[1] + " trieu"
            } else return "Tu " + item[0] + " trieu"
        }

    })
    const processedExperience = experiences.map((item, index) => {
        if (index == 0) {
            return "Duoi " + item[0] + " nam"
        } else {
            if (item.length > 1) {
                return "Tu " + item[0] + "-" + item[1] + " nam"
            }
            return "Tu " + item[0] + " nam"
        }
    })
    return (
        <div className={`flex-col`}>
            <div className={`border-gray-300 my-2  w-full items-center flex gap-y-2`}>
                <FilterItem items={provinces} isOpen={locationOpen} handleOpen={handleOpenLocation}
                            handleChoose={handleLocationChoose} value={locationChoose}/>
                <FilterItem items={processedSalary} isOpen={isSalaryOpen} handleOpen={handleSalaryClick}
                            handleChoose={handleSalaryChoose} value={salary}/>
                <FilterItem items={processedExperience} isOpen={isExperienceOpen} handleOpen={handleExperienceClick}
                            handleChoose={handleExperienceChoose} value={experience}/>

                <button
                    type={"button"}
                    className={`rounded-xl cursor-pointer hover:bg-gray-100 bg-white text-green-500 border-green-500 border font-bold  px-8  py-1 my-1 h-[40px]`}>
                    View
                </button>
            </div>
            <div className={`flex gap-x-3 mr-3`}>
                <p className={`font-bold`}>Ưu tiên hiển thị theo:</p>
                <RadioGroup className={`flex `} defaultValue="new">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className={`text-green-500 border-green-500`} value="new" id="r1"/>
                        <Label htmlFor="r1" className={`!text-[16px] font-bold`}>Ngay dang</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className={`text-green-500 border-green-500`} value="salary" id="r2"/>
                        <Label htmlFor="r2" className={`!text-[16px] font-bold`}>Luong cao den thap</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className={`text-green-500 border-green-500`} value="urgent" id="r3"/>
                        <Label htmlFor="r3" className={`!text-[16px] font-bold`}>Can tuyen gap</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}
type FilterProps = {
    value: string,
    isOpen: boolean
    handleOpen: () => void,
    handleChoose: (value: string, index?: number) => void,
    items: [] | { [key: number]: string },
    style?: string,
}
const FilterItem: React.FC<FilterProps> = ({value, handleChoose, isOpen, handleOpen, items, style}) => {

    return (
        <div className={`gap-x-2 items-center py-1 rounded flex-col justify-start `}>
            <div
                onClick={handleOpen}
                className={`bg-white h-full hover:bg-gray-50 cursor-pointer rounded-xl  flex justify-center`}>
                <div className={`px-2 max-w-[80%] py-1 flex justify-between gap-x-2 items-center`}>
                    <p className={`truncate `}>{value}</p>
                    <IoIosArrowDown/>
                </div>
            </div>
            <div className={`relative z-[100] w-full `}>
                <div
                    className={`absolute inset-0 top-2 max-h-60 grid overflow-y-auto space-y-3 rounded bg-white h-fit p-2 drop-shadow-2xl w-full ${style && style}  ${isOpen ? 'block' : 'hidden'} `}>
                    {
                        Object.values(items).map((item, index) => (
                            <div
                                onClick={() => handleChoose(item, index)}
                                key={index}
                                className={`rounded hover:text-green-500 flex items-center cursor-pointer py-1 px-1 ${item == value ? 'text-green-500 font-bold' : 'text-black'}`}>
                                <p>{item}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

const carouselBannerItem: Banner = {
    id: 1,
    imageUrl: "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Concentrix_Banner.png",
    title: "abc",
    targetUrl: "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Concentrix_Banner.png"
}
const carouselBannerItem2: Banner = {
    id: 2,
    imageUrl: "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/f88.png",
    title: "abc",
    targetUrl: "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Concentrix_Banner.png"
}
const carouselBannerItem3: Banner = {
    id: 2,
    imageUrl: "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Banner%201.png",
    title: "abc",
    targetUrl: "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/img/Concentrix_Banner.png"
}
const carouselBannerItems = [carouselBannerItem, carouselBannerItem2, carouselBannerItem3]


const Search = () => {
    const [search, setSearch] = useState("");
    const [locationOpen, setLocationOpen] = useState<boolean>(false)
    const [locationChoose, setLocationChoose] = useState<string>('Toàn quốc')
    const [field, setField] = useState<string>("Ngành nghề")
    const [isFieldOpen, setIsFieldOpen] = useState<boolean>(false)
    const handleOpenLocation = () => {
        setLocationOpen(!locationOpen);
    }
    const handleLocationChoose = (locationChoose: string) => {
        setLocationChoose(locationChoose);
    }
    const handleFieldChoose = (field: string) => {
        setSearch(field);
        setIsFieldOpen(false)
    }
    const handleFieldClick = () => {
        setIsFieldOpen(!isFieldOpen);
    }
    return (
        <div className={` relative bg-gradient-to-r from-[#E8F6F9] to-[#D3FFDE] flex justify-center `}>
            <div className={`w-full h-1/3 absolute bottom-0 bg-gradient-to-b from-transparent to-bg_default`}/>
            <div className={`custom-container flex`}>
                <div className={`flex flex-col h-fit gap-5 static pb-4 w-2/3 my-auto`}>
                    <p className={`ml-4 font-bold  text-[32px]`}>Tìm việc phù hợp với bạn</p>
                    <div className={`flex w-full `}>
                        <div className={`rounded-l-2xl bg-white flex items-center flex-1 ml-4 h-14 `}>
                            {/*<FilterItem items={fields} value={field} handleChoose={handleFieldChoose}*/}
                            {/*            handleOpen={handleFieldClick}*/}
                            {/*            isOpen={isFieldOpen} style={"!w-[720px] grid-cols-4 mt-4"}/>*/}
                            {/*<div className={`border h-[60%] bg-black`}>*/}
                            {/*</div>*/}
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                spellCheck={false}
                                className={`bg-transparent shadow-none pl-3  placeholder:font-normal font-bold flex-1 leading-6 p-0 outline-none focus:outline-none mx-3 `}
                                placeholder="Tìm công việc ..."
                            />
                            <div
                                onClick={handleOpenLocation}
                                className={`border-r border-l border-gray-300 my-1 w-40 flex-col gap-y-2`}>
                                <div
                                    className={`mx-2 gap-x-4 items-center py-1 rounded hover:bg-gray-100 cursor-pointer flex justify-center h-full`}>
                                    <CiLocationOn/>
                                    <p>{locationChoose}</p>
                                </div>
                                <div className={` relative  z-[100]`}>
                                    <div
                                        className={`absolute inset-0 max-h-48 overflow-y-auto space-y-3 rounded bg-white h-fit p-2 drop-shadow-2xl ${locationOpen ? 'block' : 'hidden'}`}>
                                        {
                                            Object.values(provinces).map((province, index) => (
                                                <div
                                                    onClick={handleLocationChoose.bind(null, province)}
                                                    key={index}
                                                    className={`rounded hover:bg-gray-100 cursor-pointer py-1 px-1`}>
                                                    <p>{province}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`mr-2 font-bold rounded-r-2xl bg-green_default hover:bg-green-600 text-white px-2 py-1 cursor-pointer flex gap-x-1 items-center`}>
                            <CiSearch/>
                            <p className={`cursor-pointer`}>Tìm kiếm</p>
                        </div>
                    </div>
                    <div className={`flex mt-4 justify-center items-center px-4`}>
                        <CarouselBanner imgSource={carouselBannerItems}/>
                    </div>
                </div>
                <div className={`w-1/3  flex justify-center items-center `}>
                    <img className={`h-3/4 object-contain`} src={'.././public/img_2.png'} alt={"App"}/>
                </div>
            </div>
        </div>
    )
}

const CompanyList = () => {
    return (
        <div className={`drop-shadow `}>
            <div className="bg-company bg-cover rounded flex flex-col gap-4 p-8 relative">
                <h2 className="text-dark text-[24px] font-bold leading-[133%] m-0">
                    Thương hiệu lớn tiêu biểu
                </h2>
                <div className="text-dark text-[16px] font-normal leading-6">
                    Những thương hiệu tuyển dụng đã khẳng định được vị thế trên thị trường.
                </div>
            </div>
            <div className={`bg-white p-6 custom-shadow rounded-b-2xl`}>
                <div className={`grid grid-cols-3 gap-4`}>
                    {
                        Array.from(Array(20).keys()).map((_, i) => (
                            <a className={`border group border-solid hover:border-green_default hover:shadow-2xl duration-300 border-gray-400 rounded-2xl cursor-pointer overflow-hidden `}>
                                <div className={`flex items-start gap-3 p-3 pb-2`}>
                                    {/*logo*/}
                                    <div
                                        className={`border border-solid rounded-2xl flex-shrink-0 h-[82px] p-[5px] w-[82px] `}>
                                        <img
                                            className={`object-contain w-full h-full group-hover:scale-110 duration-300`}
                                            src="https://static.topcv.vn/company_logos/cong-ty-an-ninh-mang-viettel-chi-nhanh-tap-doan-cong-nghiep-vien-thong-quan-doi-6141a58d0c762.jpg"
                                            alt=""/>

                                    </div>
                                    {/*name & field*/}
                                    <div className="flex items-start flex-col gap-1">
                                        <div
                                            className="text-[16px] group-hover:text-green_default font-bold leading-6 overflow-hidden uppercase line-clamp-2 ">
                                            Công ty An ninh mạng Viettel- Chi nhánh Tập đoàn Công nghiệp- Viễn thông
                                            quân đội
                                        </div>
                                        <div className="text-[14px] font-[500] leading-5 overflow-hidden opacity-70">
                                            Thời trang
                                        </div>
                                    </div>

                                </div>
                                {/*jobs count*/}
                                <div
                                    className="items-center group-hover:bg-green-100 flex gap-2 px-2 py-3 bg-[#fff5eb]">
                                    <PiShoppingBagOpen color={"#591e00"} size={20}/>
                                    <p className="text-[#591e00] group-hover:text-green_default leading-4 font-bold">1
                                        việc làm</p>
                                </div>
                            </a>
                        ))
                    }
                </div>
                <div className={`flex items-center gap-4 justify-center mt-6`}>
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

        </div>
    )
}

export default Content;