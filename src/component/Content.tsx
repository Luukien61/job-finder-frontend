import React, {useState} from 'react';
import {experiences, fields, provinces, salaries} from "../info/AppInfo.ts";
import {CiLocationOn, CiSearch} from "react-icons/ci";
import {IoIosArrowDown} from "react-icons/io";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import JobList from "@/component/JobList.tsx";

const Content = () => {

    return (
        <div className={`flex justify-center rounded`}>
            <div className={`custom-container mt-2 `}>
                <Search/>
                <Filter/>
                <JobList/>
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

    const handleSalaryClick = ()  => {
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

    const handleExperienceClick =() => {
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
            <div className={`border-gray-300 my-2  w-full flex gap-y-2`}>
                <FilterItem items={provinces} isOpen={locationOpen} handleOpen={handleOpenLocation}
                            handleChoose={handleLocationChoose} value={locationChoose}/>
                <FilterItem items={processedSalary} isOpen={isSalaryOpen} handleOpen={handleSalaryClick}
                            handleChoose={handleSalaryChoose}  value={salary}/>
                <FilterItem items={processedExperience} isOpen={isExperienceOpen} handleOpen={handleExperienceClick}
                            handleChoose={handleExperienceChoose}  value={experience}/>

                <button
                    type={"button"}
                    className={`rounded-xl cursor-pointer hover:bg-white hover:text-green-500 hover:border-green-500 hover:border hover:font-bold bg-primary px-8  py-1 my-1 h-[40px] text-white`}>
                    View
                </button>
            </div>
            <div className={`flex gap-x-3 mx-3`}>
                <p className={`font-bold`}>Ưu tiên hiển thị theo:</p>
                <RadioGroup className={`flex`} defaultValue="new" >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className={`text-green-500 border-green-500`}  value="new" id="r1" />
                        <Label htmlFor="r1">Ngay dang</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className={`text-green-500 border-green-500`} value="salary" id="r2" />
                        <Label htmlFor="r2">Luong cao den thap</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem className={`text-green-500 border-green-500`} value="urgent" id="r3" />
                        <Label htmlFor="r3">Can tuyen gap</Label>
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
        <div className={`mx-3 gap-x-2 items-center py-1 rounded flex-col justify-start `}>
            <div
                onClick={handleOpen}
                className={`bg-white h-full hover:bg-gray-50 cursor-pointer rounded-xl w-40 flex justify-center`}>
                <div className={`px-2 max-w-[80%] py-1 flex justify-between gap-x-2 items-center`}>
                    <p className={`truncate `}>{value}</p>
                    <IoIosArrowDown/>
                </div>
            </div>
            <div className={`relative z-[100] w-full `}>
                <div
                    className={`absolute inset-0 max-h-52 grid overflow-y-auto space-y-3 rounded bg-white h-fit p-2 drop-shadow-2xl w-full ${style && style }  ${ isOpen ? 'block' : 'hidden'} `}>
                    {
                        Object.values(items).map((item, index) => (
                            <div
                                onClick={() => handleChoose(item, index)}
                                key={index}
                                className={`rounded hover:text-green-300 flex items-center cursor-pointer py-1 px-1 ${item == value ? 'text-green-300' : 'text-black'}`}>
                                <p>{item}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
const Search = () => {
    const [search, setSearch] = useState("");
    const [locationOpen, setLocationOpen] = useState<boolean>(false)
    const [locationChoose, setLocationChoose] = useState<string>('Toàn quốc')
    const [field, setField] = useState<string>("Field")
    const [isFieldOpen, setIsFieldOpen] = useState<boolean>(false)
    const handleOpenLocation = () => {
        setLocationOpen(!locationOpen);
    }
    const handleLocationChoose = (locationChoose: string) => {
        setLocationChoose(locationChoose);
    }
    const handleFieldChoose=(field: string)=>{
        setSearch(field);
        setIsFieldOpen(false)
    }
    const handleFieldClick=()=>{
        setIsFieldOpen(!isFieldOpen);
    }
    return (
        <div className={`block bg-gradient-to-r from-primary to-green-400 h-24 static py-4 rounded-t-md`}>
            <div className={`rounded-2xl bg-white flex items-center mx-4 h-12 `}>
                <FilterItem items={fields} value={field} handleChoose={handleFieldChoose} handleOpen={handleFieldClick}
                            isOpen={isFieldOpen}  style={"!w-[1200px] grid-cols-4 mt-4"}/>
                <div className={`border h-[60%] bg-black`}>

                </div>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    spellCheck={false}
                    className={`bg-transparent shadow-none font-medium flex-1 leading-6 p-0 outline-none focus:outline-none mx-3 `}
                    placeholder="Search your jobs here..."
                />
                <div
                    onClick={handleOpenLocation}
                    className={`border-r border-l border-gray-300 my-2  w-40 flex-col gap-y-2`}>
                    <div
                        className={`mx-1 gap-x-2 items-center py-1 rounded hover:bg-gray-100 cursor-pointer flex justify-center h-full`}>
                        <CiLocationOn/>
                        <p>{locationChoose}</p>
                    </div>
                    <div className={` relative  z-[100]`}>
                        <div
                            className={`absolute inset-0 max-h-32 overflow-y-auto space-y-3 rounded bg-white h-fit p-2 drop-shadow-2xl ${locationOpen ? 'block' : 'hidden'}`}>
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
                <div className={`mx-2 my-2`}>
                    <div
                        className={`bg-primary rounded-2xl hover:bg-green-600 text-white font-medium px-2 py-1 cursor-pointer flex gap-x-1 items-center`}>
                        <CiSearch/>
                        <p className={`cursor-pointer`}>Search</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Content;