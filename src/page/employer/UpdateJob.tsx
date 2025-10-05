import React, {useEffect, useState} from 'react';
import {Collapse, CollapseProps, DatePicker, Form, GetProps, Input, InputNumber, Select, Spin, TimePicker} from "antd";
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
import {BsClock, BsGenderAmbiguous, BsPeople} from "react-icons/bs";
import {dayOfWeek, genderOptions, jobFields, jobPositions, jobTypes, provinces_2} from "@/info/AppInfo.ts";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {getJobDetailById, updateJob} from "@/axios/Request.ts";
import {toast} from "react-toastify";
import {format} from 'date-fns';
import {delay} from "@/page/GoogleCode.tsx";
import {useLocation} from "react-router-dom";
import AutoBulletTextArea from "@/component/AutoBulletTextArea.tsx";
import {JobDetailProps} from "@/info/ApplicationType.ts";
import {checkIsCompanyBanned} from "@/service/ApplicationService.ts";


type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
dayjs.extend(customParseFormat);
const hourFormat = 'HH:mm';

const UpdateJob = () => {
    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [location, setLocation] = useState<string>();
    const [requirement, setRequirement] = useState<string>();
    const [benefit, setBenefit] = useState<string>();
    const [startTimes, setStartTimes] = useState<string>();
    const [endTimes, setEndTimes] = useState<string>();
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [minSalary, setMinSalary] = useState<number>();
    const [maxSalary, setMaxSalary] = useState<number>();
    const [role, setRole] = useState<string>();
    const [gender, setGender] = useState<string>();
    const [type, setType] = useState<string>();
    const [province, setProvince] = useState<string>();
    const [field, setField] = useState<string>();
    const [expireDate, setExpireDate] = useState<Date>();
    const [experience, setExperience] = useState<number>();
    const [form] = Form.useForm();
    const [companyId, setCompanyId] = useState<string>("");
    const [quantity, setQuantity] = useState<number>();
    const path = useLocation().pathname;
    const [isLoading, setIsLoading] = useState(false);
    const [startTime, setStartTime] = useState<dayjs.Dayjs>();
    const [endTime, setEndTime] = useState<dayjs.Dayjs>();
    const [currentJobId, setCurrentJobId] = useState<string>();
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <div className={`flex gap-1 justify-start items-center`}>
                <MdDescription size={24} fill={"#00b14f"}/>
                <p className={`text-18 font-semibold`}>Mô tả công việc</p>
            </div>,
            children: <Form.Item
                name='description'
                rules={[
                    {
                        validator: () => description ? Promise.resolve() : Promise.reject(new Error('Thêm mô tả công việc'))
                    }
                ]}>
                <AutoBulletTextArea
                    defaultValue={description}
                    value={description}
                    placeholder={'Mô tả chi tiết công việc...'}
                    onChange={setDescription} style={''}/>
            </Form.Item>

        },
        {
            key: '2',
            label: <div className={`flex gap-1 justify-start items-center`}>
                <DiRequirejs size={24} fill={"#00b14f"}/>
                <p className={`text-18 font-semibold`}>Yêu cầu ứng viên</p>
            </div>,
            children: <Form.Item
                name='required'
                rules={[
                    {
                        validator: () => requirement ? Promise.resolve() : Promise.reject(new Error('Thêm yêu cầu công việc'))
                    }
                ]}>
                <AutoBulletTextArea
                    defaultValue={requirement}
                    value={requirement}
                    placeholder={'Yêu cầu ứng viên...'}
                    onChange={setRequirement}/>
            </Form.Item>
        },
        {
            key: '3',
            label: <div className={`flex gap-1 justify-start items-center`}>
                <GiReceiveMoney size={24} fill={"#00b14f"}/>
                <p className={`text-18 font-semibold`}>Quyền lợi ứng viên</p>
            </div>,
            children: <Form.Item
                name='benefit'
                rules={[
                    {
                        validator: () => benefit ? Promise.resolve() : Promise.reject(new Error('Thêm quyền lợi ứng viên'))
                    }
                ]}>
                <AutoBulletTextArea
                    defaultValue={benefit}
                    value={benefit}
                    placeholder={'Quyền lợi ứng viên...'}
                    onChange={setBenefit}/>
            </Form.Item>,
        },
    ];
    const [isBanned, setIsBanned] = useState<boolean>(false);
    const checkCompanyStatus = async (id) => {
        try {
            const isBanned: boolean = await checkIsCompanyBanned(id);
            if (isBanned) {
                delay(1000)
                window.location.href = '/employer'
            }
            setIsBanned(isBanned);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        const company = JSON.parse(localStorage.getItem('company'));
        if (company) {
            setCompanyId(company.id)
        }
        const jobId = path.split("/")[3]
        if (jobId) {
            setCurrentJobId(jobId);
            getJobDetail(parseInt(jobId))
            checkCompanyStatus(jobId)

        }
    }, []);

    const getJobDetail = async (id: number) => {
        try {
            const jobDetail: JobDetailProps = await getJobDetailById(id)
            if (jobDetail) {
                setTitle(jobDetail.title)
                setDescription(jobDetail.description)
                setBenefit(jobDetail.benefits)
                setRequirement(jobDetail.requirements)
                setLocation(jobDetail.location)
                const workTime = jobDetail.workTime //08:00-17:00, Thứ hai-Thứ sáu
                const dateTime = workTime.split(',')
                const times = dateTime[0].split('-')
                const dates = dateTime[1].split('-')
                const startTime = dayjs(times[0], 'HH:mm');
                const endTime = dayjs(times[1], 'HH:mm');
                setStartTimes(times[0]);
                setEndTimes(times[1]);
                setStartDate(dates[0])
                setEndDate(dates[1])
                setStartTime(startTime)
                setEndTime(endTime)
                setProvince(jobDetail.province)
                setField(jobDetail.field)
                setType(jobDetail.type)
                setRole(jobDetail.role)
                setGender(jobDetail.gender)
                setRole(jobDetail.role)
                setQuantity(jobDetail.quantity)
                setExperience(jobDetail.experience)
                setMinSalary(jobDetail.minSalary)
                setMaxSalary(jobDetail.maxSalary)
                setExpireDate(jobDetail.expireDate)
            }
            await delay(1000)
            setIsLoading(false);
        } catch (error) {
            console.log(error)
        }
    }


    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().startOf('day');
    };

    const handleWorkTimeChange = (dateString: [string, string]) => {
        setStartTimes(dateString[0])
        setStartTime(dayjs(dateString[0], 'HH:mm'))
        setEndTimes(dateString[1])
        setEndTime(dayjs(dateString[1], 'HH:mm'))
    }

    const handleExpireDateChange = (dateString: string | string[]) => {
        if (typeof dateString === 'string') {
            const [day, month, year] = dateString.split("/").map(Number);
            const rawDate = new Date(year, month - 1, day)
            setExpireDate(rawDate)
        }
    }


    const handleAddJob = async () => {

        const workTime = startTimes + '-' + endTimes + ', ' + startDate.trim() + '-' + endDate;
        const request = {
            jobId: currentJobId,
            companyId: companyId,
            title: title,
            createdAt: new Date(),
            description: description,
            requirements: requirement,
            benefits: benefit,
            workTime: workTime,
            minSalary: minSalary,
            maxSalary: maxSalary,
            gender: gender,
            province: province,
            location: location,
            role: role,
            updateAt: new Date(),
            quantity: quantity,
            experience: experience,
            type: type,
            field: field,
            expireDate: format(expireDate, 'yyyy-MM-dd'),
        }
        try {
            await updateJob(currentJobId, request);
            toast.info("Cập nhật thành công!")
            await delay(1000)
            window.location.href = '/employer/jobs'
        } catch (error) {
            toast.error(error.response.data)
        }
    }
    const handleCancel = () => {
        window.location.href = '/employer/jobs'
    }

    return (
        <>
            {
                isLoading ? (<Spin fullscreen={true} size={"large"} tip="Đang tải"></Spin>) : (
                    <div className={`px-6 relative h-screen`}>
                        <div className={`flex w-full  relative  overflow-y-visible `}>
                            <Form
                                form={form}
                                className={`flex w-full mb-10  relative mt-10 overflow-y-visible`}
                                scrollToFirstError={true}
                            >
                                <div className={`w-2/3 pr-5 flex flex-col gap-6`}>
                                    {/*description*/}
                                    <div
                                        className={`rounded-lg  bg-white border-solid border-[2px] overflow-hidden border-green_default `}>
                                        <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-[20px] font-semibold leading-7 m-0`}>
                                            Chi tiết công việc
                                        </h2>
                                        <div className={`px-6 py-4`}>
                                            <div
                                                className={`w-full flex-col flex gap-10  pt-4 flex-wrap overflow-hidden`}>
                                                <div>
                                                    <Form.Item
                                                        name='title'
                                                        rules={[
                                                            {
                                                                validator: (_) =>
                                                                    title ? Promise.resolve() : Promise.reject(new Error('Tên công việc không thể bỏ trống'))

                                                            }
                                                        ]}
                                                    >
                                                        <CustomInput

                                                            labelIcon={<MdOutlineDriveFileRenameOutline size={24}
                                                                                                        fill={"#00b14f"}/>}
                                                            labelStyle={` text-18 font-semibold`}
                                                            allowClear={true}
                                                            disable={false}
                                                            width={'w-full text-18 font-semibold'}
                                                            type={'text'}
                                                            label={'Tên công việc'}
                                                            prefix={null}
                                                            value={title}
                                                            defaultValue={title}
                                                            onChange={(e) => setTitle(e.target.value)}
                                                            addBefore={null}/>
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className={`mt-10`}>
                                                <Collapse items={items} defaultActiveKey={['1', '2', '3']}/>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {/*right side*/}
                                <div className={` w-1/3 flex flex-col gap-6 h-fit sticky top-[90px]`}>
                                    <div
                                        className={`rounded-lg gap-8 flex flex-col bg-white border-solid border-[2px]  overflow-hidden border-green_default `}>
                                        <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-[20px] font-semibold leading-7 m-0`}>
                                            Thông tin cơ bản
                                        </h2>
                                        <div className={`px-6 pb-4 gap-8 flex flex-col`}>
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
                                                        value={[startTime, endTime]}
                                                        onChange={(_dayjs, dateString) => handleWorkTimeChange(dateString)}
                                                        defaultValue={[startTime, endTime]}
                                                        format={hourFormat}/>
                                                    <div className={`flex gap-3 items-center`}>
                                                        <Select
                                                            value={startDate}
                                                            onChange={(e) => setStartDate(e)}
                                                            defaultValue="Thứ hai"
                                                            style={{width: 120}}
                                                            options={dayOfWeek}
                                                        />
                                                        <p className={`flex-1 text-center`}>đến</p>
                                                        <Select
                                                            value={endDate}
                                                            onChange={(e) => setEndDate(e)}
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
                                                    <InputNumber min={1} max={100} value={minSalary}
                                                                 onChange={(e) => setMinSalary(e)}
                                                                 defaultValue={3}/>
                                                    <p>đến</p>
                                                    <InputNumber min={1} max={100} value={maxSalary}
                                                                 onChange={(e) => setMaxSalary(e)}
                                                                 defaultValue={5}/>
                                                    <p>triệu</p>
                                                </div>
                                            </div>
                                            <div className={` flex flex-col gap-4 `}>
                                                <div className={`flex gap-1 items-center justify-start`}>
                                                    <MdLocationPin size={20}
                                                                   fill={"#00b14f"}/>
                                                    <p className={`font-semibold text-18`}>Địa điểm</p>
                                                </div>
                                                <div className={`flex items-center`}>
                                                    <Form.Item
                                                        name='location'
                                                        rules={[
                                                            {
                                                                validator: () => location ? Promise.resolve() : Promise.reject(new Error('Thêm địa chỉ'))
                                                            }
                                                        ]}>
                                                        <Input
                                                            autoComplete='off'
                                                            value={location}
                                                            defaultValue={location}
                                                            onChange={(e) => setLocation(e.target.value)}
                                                            placeholder={location}
                                                            size={'large'}
                                                            addonAfter={<Form.Item name={'province'}
                                                                                   rules={[
                                                                                       {
                                                                                           validator: () => province ? Promise.resolve() : Promise.reject(new Error('Thêm tỉnh/thành phố'))
                                                                                       }
                                                                                   ]}
                                                                                   style={{
                                                                                       marginBottom: 0,
                                                                                       width: '145px'
                                                                                   }}>
                                                                <Select
                                                                    defaultValue={province}
                                                                    showArrow={false}
                                                                    value={province}
                                                                    onChange={(e) => setProvince(e)}
                                                                    className={`h-[42px]  w-full`}
                                                                    optionFilterProp="label"
                                                                    options={provinces_2}
                                                                />
                                                            </Form.Item>}
                                                            spellCheck={false}
                                                            className={`text-16`}/>

                                                    </Form.Item>


                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`rounded-lg bg-white  overflow-hidden border-2 border-green_default `}>
                                        <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-[20px] font-semibold leading-7 m-0`}>
                                            Thông tin khác
                                        </h2>
                                        <div className={`max-h-[400px] py-2 overflow-y-auto`}>
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
                                                            value={role}
                                                            onChange={(e) => setRole(e)}
                                                            size={'large'}
                                                            defaultValue={role}
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
                                                            <p className={`font-semibold text-18 line-clamp-1 `}>Số
                                                                lượng</p>
                                                        </div>
                                                        <Form.Item name='quantity'
                                                                   rules={[
                                                                       {
                                                                           validator: () => quantity ? Promise.resolve() : Promise.reject(new Error('Thêm số lượng tuyển'))
                                                                       }
                                                                   ]}
                                                                   style={{marginBottom: '0px', width: '50%'}}>
                                                            <InputNumber
                                                                style={{width: '100%'}}
                                                                size={'large'}
                                                                value={quantity}
                                                                onChange={(e) => setQuantity(e)}
                                                                defaultValue={quantity}
                                                                className={`flex-1 text-center`}
                                                                min={1} max={100}/>
                                                        </Form.Item>

                                                    </div>
                                                </div>
                                                {/*kinh nghiem */}
                                                <div>
                                                    <div className={`flex gap-2 items-center justify-start`}>
                                                        <div className={`flex gap-2 w-1/2 items-center  justify-start`}>
                                                            <PiBrainBold size={20}
                                                                         fill={"#00b14f"}/>
                                                            <p className={`font-semibold text-18 line-clamp-1 `}>Kinh
                                                                nghiệm</p>
                                                        </div>
                                                        <Form.Item
                                                            name='experience'
                                                            rules={[
                                                                {
                                                                    validator: () => experience ? Promise.resolve() : Promise.reject(new Error('Thêm kinh nghiệm'))
                                                                }
                                                            ]}
                                                            style={{marginBottom: '0px', width: '50%'}}>
                                                            <InputNumber
                                                                size={'large'}
                                                                addonAfter={'năm'}
                                                                value={experience}
                                                                onChange={(n) => setExperience(n)}
                                                                defaultValue={experience}
                                                                className={`flex-1 text-center text-16`}
                                                                min={0} max={100}/>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                {/*gioi tinh*/}
                                                <div>
                                                    <div className={`flex gap-2 items-center justify-start`}>
                                                        <div className={`flex gap-2 w-1/2 items-center  justify-start`}>
                                                            <BsGenderAmbiguous size={20}
                                                                               fill={"#00b14f"}/>
                                                            <p className={`font-semibold text-18 line-clamp-1 `}>Giới
                                                                tính</p>
                                                        </div>
                                                        <Select
                                                            value={gender}
                                                            onChange={(e) => setGender(e)}
                                                            size={'large'}
                                                            defaultValue={gender}
                                                            className={`flex-1`}
                                                            options={genderOptions}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={`flex gap-2 items-center justify-start`}>
                                                        <div className={`flex gap-2 w-1/2 items-center  justify-start`}>
                                                            <BsClock size={20}
                                                                     fill={"#00b14f"}/>
                                                            <p className={`font-semibold text-18 line-clamp-1 `}>Hình
                                                                thức</p>
                                                        </div>
                                                        <Select
                                                            value={type}
                                                            onChange={(e) => setType(e)}
                                                            size={'large'}
                                                            defaultValue={type}
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
                                                            <p className={`font-semibold text-18 line-clamp-1 `}>Lĩnh
                                                                vực</p>
                                                        </div>
                                                        <Select
                                                            value={field}
                                                            onChange={(e) => setField(e)}
                                                            size={'large'}
                                                            defaultValue={field}
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
                                                            <p className={`font-semibold text-18 line-clamp-1 `}>Hạn
                                                                tuyển</p>
                                                        </div>
                                                        <DatePicker
                                                            onChange={(_, dateString) => handleExpireDateChange(dateString)}
                                                            placeholder={'Chọn thời hạn tuyển'}
                                                            defaultValue={dayjs(expireDate)}
                                                            disabledDate={disabledDate}
                                                            format="DD/MM/YYYY"
                                                            size={'large'}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div
                                            className={`w-full pb-1 pt-3 my-2 flex items-center  justify-end gap-2  border-t-[2px]`}>
                                            <button
                                                onClick={handleCancel}
                                                type={'button'}
                                                className={`w-fit px-2  mx-3 rounded  min-w-[70px] py-2 text-black opacity-70 hover:bg-gray-100 font-bold`}>
                                                Hủy
                                            </button>
                                            <Form.Item style={{marginBottom: '0px'}}>
                                                <button
                                                    onClick={handleAddJob}
                                                    type="submit"
                                                    className={`w-fit px-2 hover:bg-green-600 mx-3 rounded bg-green_default py-2 text-white font-bold`}>
                                                    Hoàn thành
                                                </button>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>

                            </Form>
                            {/*left side*/}

                        </div>

                    </div>
                )
            }
        </>
    );
};

export default UpdateJob;