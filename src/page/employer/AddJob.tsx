import React, {useState} from 'react';
import {Collapse, CollapseProps, DatePicker, GetProps, Input, InputNumber, Select, TimePicker} from "antd";
import {
    MdAccessTimeFilled,
    MdAttachMoney,
    MdDescription,
    MdLocationPin,
    MdOutlineDriveFileRenameOutline
} from "react-icons/md";
import {PiBrainBold, PiBuildingOfficeLight} from "react-icons/pi";
import {CustomInput} from "@/page/CompleteProfile.tsx";
import {DiRequirejs} from "react-icons/di";
import {GiOfficeChair, GiReceiveMoney} from "react-icons/gi";
import dayjs from "dayjs";
import {BsGenderAmbiguous, BsPeople} from "react-icons/bs";
import {dayOfWeek, genderOptions, jobFields, jobPositions, jobTypes} from "@/info/AppInfo.ts";
import customParseFormat from 'dayjs/plugin/customParseFormat';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
dayjs.extend(customParseFormat);
const format = 'HH:mm';

const AddJob = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [requirement, setRequirement] = useState<string>("");
    const [benefit, setBenefit] = useState<string>("");
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <div className={`flex gap-1 justify-start items-center`}>
                <MdDescription size={24} fill={"#00b14f"}/>
                <p className={`text-18 font-semibold`}>Mô tả công việc</p>
            </div>,
            children: <DefaultTextArea
                value={description}
                placeholder={'Mô tả chi tiết công việc...'}
                onChange={(e) => setDescription(e.target.value)}/>,
        },
        {
            key: '2',
            label: <div className={`flex gap-1 justify-start items-center`}>
                <DiRequirejs size={24} fill={"#00b14f"}/>
                <p className={`text-18 font-semibold`}>Yêu cầu ứng viên</p>
            </div>,
            children: <DefaultTextArea
                value={requirement}
                placeholder={'Yêu cầu ứng viên...'}
                onChange={(e) => setRequirement(e.target.value)}/>,
        },
        {
            key: '3',
            label: <div className={`flex gap-1 justify-start items-center`}>
                <GiReceiveMoney size={24} fill={"#00b14f"}/>
                <p className={`text-18 font-semibold`}>Quyền lợi ứng viên</p>
            </div>,
            children: <DefaultTextArea
                value={benefit}
                placeholder={'Quyền lợi ứng viên...'}
                onChange={(e) => setBenefit(e.target.value)}/>,
        },
    ];

    const startTime = dayjs('08:00', 'HH:mm');
    const endTime = dayjs('17:00', 'HH:mm');

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().startOf('day');
    };


    return (
        <div className={`flex w-full mb-10  relative mt-10 overflow-y-visible `}>
            {/*left side*/}
            <div className={`w-2/3 pr-5 flex flex-col gap-6`}>
                {/*description*/}
                <div className={`rounded-lg  bg-white border-solid border-[2px] overflow-hidden border-green_default `}>
                    <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-[20px] font-semibold leading-7 m-0`}>
                        Chi tiết công việc
                    </h2>
                    <div className={`px-6 py-4`}>
                        <div className={`w-full flex-col flex gap-10  pt-4 flex-wrap overflow-hidden`}>
                            <div>
                                <CustomInput
                                    labelIcon={<MdOutlineDriveFileRenameOutline size={24} fill={"#00b14f"}/>}
                                    labelStyle={` text-18 font-semibold`}
                                    allowClear={true}
                                    disable={false}
                                    width={'w-full text-18 font-semibold'}
                                    type={'text'}
                                    label={'Tên công việc'}
                                    prefix={null}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    addBefore={null}/>
                            </div>
                        </div>
                        <div className={`mt-10`}>
                            <Collapse items={items} defaultActiveKey={['1', '2', '3']}/>
                        </div>
                    </div>
                </div>

            </div>
            {/*right side*/}
            <div className={`pl-5 w-1/3 flex flex-col gap-6 h-fit sticky top-24`}>
                <div className={`rounded-lg p-6 gap-8 flex flex-col bg-white border-solid border-[2px]  overflow-hidden border-green_default `}>
                    <div className={`flex flex-col gap-4 `}>
                        <div className={`flex gap-1 items-center justify-start`}>
                            <MdAccessTimeFilled size={20}
                                                fill={"#00b14f"}/>
                            <p className={`font-semibold text-18`}>Thời gian làm việc </p>
                        </div>
                        <div className={`flex flex-col gap-4 `}>
                            <TimePicker.RangePicker
                                needConfirm={false}
                                size={"large"}
                                defaultValue={[startTime, endTime]}
                                format={format}/>
                            <div className={`flex gap-3 items-center`}>
                                <Select
                                    defaultValue="Thứ hai"
                                    style={{width: 120}}
                                    options={dayOfWeek}
                                />
                                <p className={`flex-1 text-center`}>đến</p>
                                <Select
                                    defaultValue="Thứ sáu"
                                    style={{width: 120}}
                                    options={dayOfWeek}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-3`}>
                        <div className={`flex gap-1 items-center justify-start`}>
                            <MdAttachMoney size={20}
                                           fill={"#00b14f"}/>
                            <p className={`font-semibold text-18`}>Mức lương</p>
                        </div>
                        <div className={`flex gap-1 items-center justify-between`}>
                            <p className={`ml-1`}>Từ</p>
                            <InputNumber min={1} max={100} defaultValue={3}/>
                            <p>đến</p>
                            <InputNumber min={1} max={100} defaultValue={5}/>
                            <p>triệu</p>
                        </div>
                    </div>
                    <div className={` flex flex-col gap-4 `}>
                        <div className={`flex gap-1 items-center justify-start`}>
                            <MdLocationPin size={20}
                                           fill={"#00b14f"}/>
                            <p className={`font-semibold text-18`}>Địa điểm</p>
                        </div>
                        <div>
                            <Input
                                size={'large'}
                                spellCheck={false}
                                className={`text-16`}/>
                        </div>

                    </div>
                </div>
                <div className={`rounded-lg bg-white overflow-hidden border-2 border-green_default `}>
                    <div className={`p-6 flex flex-col gap-8 `}>
                        {/*vi tri*/}
                        <div>
                            <div className={`flex gap-2 items-center justify-start`}>
                                <div className={`flex gap-2 w-1/2 items-center justify-start `}>
                                    <GiOfficeChair size={20}
                                                   fill={"#00b14f"}/>
                                    <p className={`font-semibold text-18`}>Vị trí</p>
                                </div>
                                <Select
                                    size={'large'}
                                    defaultValue="Nhân viên"
                                    className={`flex-1`}
                                    options={jobPositions}
                                />
                            </div>
                        </div>
                        {/*so luong*/}
                        <div>
                            <div className={`flex gap-2 items-center justify-start`}>
                                <div className={`flex gap-2 w-1/2 items-center  justify-start`}>
                                    <BsPeople size={20}
                                                   fill={"#00b14f"}/>
                                    <p className={`font-semibold text-18 line-clamp-1 `}>Số lượng</p>
                                </div>
                                <InputNumber
                                    size={'large'}
                                    className={`flex-1 text-center`}
                                    min={1} max={100} defaultValue={1}  />
                            </div>
                        </div>
                        {/*kinh nghiem */}
                        <div>
                            <div className={`flex gap-2 items-center justify-start`}>
                                <div className={`flex gap-2 w-1/2 items-center  justify-start`}>
                                    <PiBrainBold size={20}
                                                   fill={"#00b14f"}/>
                                    <p className={`font-semibold text-18 line-clamp-1 `}>Kinh nghiệm</p>
                                </div>
                                <InputNumber
                                    size={'large'}
                                    addonAfter={'năm'}
                                    className={`flex-1 text-center text-16`}
                                    min={0} max={100} defaultValue={1}  />
                            </div>
                        </div>
                        {/*gioi tinh*/}
                        <div>
                            <div className={`flex gap-2 items-center justify-start`}>
                                <div className={`flex gap-2 w-1/2 items-center  justify-start`}>
                                    <BsGenderAmbiguous size={20}
                                                   fill={"#00b14f"}/>
                                    <p className={`font-semibold text-18 line-clamp-1 `}>Giới tính</p>
                                </div>
                                <Select
                                    size={'large'}
                                    defaultValue="Không yêu cầu"
                                    className={`flex-1`}
                                    options={genderOptions}
                                />
                            </div>
                        </div>
                        <div>
                            <div className={`flex gap-2 items-center justify-start`}>
                                <div className={`flex gap-2 w-1/2 items-center  justify-start`}>
                                    <BsGenderAmbiguous size={20}
                                                   fill={"#00b14f"}/>
                                    <p className={`font-semibold text-18 line-clamp-1 `}>Hình thức</p>
                                </div>
                                <Select
                                    size={'large'}
                                    defaultValue="Full time"
                                    className={`flex-1`}
                                    options={jobTypes}
                                />
                            </div>
                        </div>
                        {/*linh vuc*/}
                        <div>
                            <div className={`flex gap-4 flex-col  justify-start`}>
                                <div className={`flex gap-2  items-center  justify-start`}>
                                    <PiBuildingOfficeLight size={20}
                                                   fill={"#00b14f"}/>
                                    <p className={`font-semibold text-18 line-clamp-1 `}>Lĩnh vực</p>
                                </div>
                                <Select
                                    size={'large'}
                                    placeholder={'Chọn lĩnh vực'}
                                    className={`flex-1 text-16`}
                                    options={jobFields}
                                />
                            </div>
                        </div>
                        {/*han tuyen*/}
                        <div>
                            <div className={`flex gap-4 flex-col  justify-start`}>
                                <div className={`flex gap-2  items-center  justify-start`}>
                                    <PiBuildingOfficeLight size={20}
                                                   fill={"#00b14f"}/>
                                    <p className={`font-semibold text-18 line-clamp-1 `}>Hạn tuyển</p>
                                </div>
                                <DatePicker
                                    placeholder={'Chọn thời hạn tuyển'}
                                    disabledDate={disabledDate}
                                    format="DD/MM/YYYY"
                                    size={'large'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
type CustomTextAreaProps = {
    label: string;
    value: string;
    onChange: (e) => void;
    labelStyle?: string;
    minHeight?: number;
    textAreaStyle?: string;
    placeholder?: string;
    gap?: number;
    icon?: any

}
const CustomTextArea: React.FC<CustomTextAreaProps> = (item) => {
    const minHeight = item.minHeight || 100
    const {TextArea} = Input;
    return (
        <div className={`flex flex-col ${item.gap ? `gap-${item.gap}` : 'gap-3'}`}>
            <div className={`flex gap-1 justify-start items-center`}>
                {item.icon}
                <p className={`ml-1 flex-1 text-18 font-semibold ${item.labelStyle}`}>{item.label}</p>
            </div>
            <TextArea style={{height: 300, minHeight: minHeight}} className={`text-16 p-4 ${item.textAreaStyle}`}
                      spellCheck={false}
                      value={item.value}
                      onChange={item.onChange}
                      placeholder={item.placeholder}/>
        </div>
    )
}

const DefaultTextArea = ({minHeight = 100, style = '', value, onChange, placeholder = ''}) => {
    const {TextArea} = Input;
    return (
        <TextArea style={{height: 300, minHeight: minHeight}} className={`text-16 p-4 ${style}`}
                  spellCheck={false}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}/>
    )
}
export default AddJob;