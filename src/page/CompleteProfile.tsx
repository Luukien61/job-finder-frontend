import React, {useState} from 'react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const CompleteProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState<Date>();
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    return (
        <div>
            <div className={`w-full`}>
                <img className={`w-full absolute`} src={`https://jobsgo.vn/media/import_cv/background_import_cv.png`}
                     alt={`bg-cv`}/>
                <div className={`relative max-w-[1190px] m-auto  flex justify-center `}>
                    <div className={`w-[75%] mt-36 rounded pb-6 shadow-2xl flex flex-col gap-4 bg-white`}>
                        <div className={``}>

                        </div>
                        <div className={`flex items-center justify-center w-full`}>
                            <img alt={`avatar`} src={`https://jobsgo.vn/uploads/avatar/202411/_20241117111605.png`}
                                 className={`w-[150px] aspect-square rounded-full`}/>
                        </div>
                        {/*name*/}
                        <div className={`flex flex-col gap-3 w-full px-4 *:w-full`}>
                            <div className={`w-full`}>
                                <CustomInput value={name}
                                             width={'w-full'}
                                             onChange={(e) => setName(e.target.value)}
                                             label={'Họ và tên'}/>
                            </div>
                            <div className={`flex `}>
                                <div className={`flex flex-col w-1/2 pr-2`}>
                                    <CustomInput value={email}
                                                 width={'w-full'}
                                                 onChange={(e) => setEmail(e.target.value)}
                                                 label={'Email'}/>
                                </div>
                                <div className={`flex flex-col w-1/2 pl-2`}>
                                    <CustomInput value={phone}
                                                 width={'w-full'}
                                                 onChange={(e) => setPhone(e.target.value)}
                                                 label={'Số điện thoại'}/>
                                </div>
                            </div>
                            <div className={`flex `}>
                                <div className={`flex flex-col w-1/2 pr-2`}>
                                    <p className={`ml-1 mb-1`}>Ngày sinh</p>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon />
                                                {date ? Intl.DateTimeFormat('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                }).format(date) : <span>Ngày sinh</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                fromYear={2000}
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className={`flex flex-col w-1/2 pl-2`}>
                                    <CustomInput value={phone}
                                                 width={'w-full'}
                                                 onChange={(e) => setPhone(e.target.value)}
                                                 label={'Số điện thoại'}/>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};


const CustomInput = ({label, value, onChange, width}) => {
    return (
        <>
            <p className={`ml-1`}>{label}</p>
            <input
                value={value}
                onChange={onChange}
                spellCheck={false}
                className={`p-2 outline-none rounded border mt-1 ${width}`}/>
        </>
    )
}
export default CompleteProfile;