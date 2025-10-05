import React, {useEffect, useState} from 'react';
import {
    Collapse,
    CollapseProps,
    DatePicker,
    Form,
    GetProps,
    Input,
    InputNumber,
    notification,
    Select,
    TimePicker
} from "antd";
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
import {addJob} from "@/axios/Request.ts";
import {toast} from "react-toastify";
import {format} from 'date-fns';
import {delay} from "@/page/GoogleCode.tsx";
import AutoBulletTextArea from "@/component/AutoBulletTextArea.tsx";
import {checkIsCompanyBanned} from "@/service/ApplicationService.ts";


type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
dayjs.extend(customParseFormat);
const hourFormat = 'HH:mm';

const AddJob = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("-");
    const [location, setLocation] = useState<string>("");
    const [requirement, setRequirement] = useState<string>("-");
    const [benefit, setBenefit] = useState<string>("-");
    const [startTimes, setStartTimes] = useState<string>("08:00");
    const [endTimes, setEndTimes] = useState<string>("17:00");
    const [startDate, setStartDate] = useState<string>("Thứ hai");
    const [endDate, setEndDate] = useState<string>("Thứ sáu");
    const [minSalary, setMinSalary] = useState<number>(3);
    const [maxSalary, setMaxSalary] = useState<number>(5);
    const [role, setRole] = useState<string>("Nhân viên");
    const [gender, setGender] = useState<string>('Không yêu cầu');
    const [type, setType] = useState<string>("Full time");
    const [field, setField] = useState<string>("Khác");
    const [expireDate, setExpireDate] = useState<Date>();
    const [form] = Form.useForm();
    const [companyId, setCompanyId] = useState<string>("");
    const [api, contextHolder] = notification.useNotification();

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <div className={`flex gap-1 justify-start items-center`}>
                <MdDescription size={24} fill={"#00b14f"}/>
                <p className={`text-18 font-semibold`}>Mô tả công việc</p>
            </div>,
            children: <Form.Item
                name='description'
                rules={[{required: true, message: 'Thêm chi tiết công việc'}]}>
                <AutoBulletTextArea
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
                rules={[{required: true, message: 'Thêm yêu cầu công việc'}]}>
                <AutoBulletTextArea
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
                rules={[{required: true, message: 'Thêm quyền lợi ứng viên'}]}>
                <AutoBulletTextArea
                    value={benefit}
                    placeholder={'Quyền lợi ứng viên...'}
                    onChange={setBenefit}/>
            </Form.Item>,
        },
    ];
    const startTime = dayjs('08:00', 'HH:mm');
    const endTime = dayjs('17:00', 'HH:mm');
    const [isBanned, setIsBanned] = useState<boolean>(false);
    const checkCompanyStatus = async (id) => {
        try {
            const isBanned: boolean = await checkIsCompanyBanned(id);
            if (isBanned) {
                openNotification("Tài khoản của bạn đã bị vô hiệu hóa")
                delay(2000)
                window.location.href = '/employer'
            }
            setIsBanned(isBanned);
        } catch (e) {
            console.log(e);
        }
    }
    const openNotification = (message: string) => {
        const key = `open${Date.now()}`;
        api.error({
            message: 'Opp!',
            description: message,
            key,
            showProgress: true,
            onClose: () => {
            },
        });
    };

    useEffect(() => {
        const company = JSON.parse(localStorage.getItem('company'));
        if (company) {
            setCompanyId(company.id)
            checkCompanyStatus(company.id)
        }
    }, []);

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().startOf('day');
    };

    const handleWorkTimeChange = (dateString: [string, string]) => {
        setStartTimes(dateString[0])
        setEndTimes(dateString[1])
    }

    const handleExpireDateChange = (dateString: string | string[]) => {
        if (typeof dateString === 'string') {
            const [day, month, year] = dateString.split("/").map(Number);
            const rawDate = new Date(year, month - 1, day)
            setExpireDate(rawDate)
        }
    }

    const handleAddJob = async (values: any) => {

        const workTime = startTimes + '-' + endTimes + ', ' + startDate + '-' + endDate;
        const request = {
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
            province: values.province,
            location: location,
            role: role,
            quantity: values.quantity,
            experience: values.experience,
            type: type,
            field: field,
            expireDate: format(expireDate, 'yyyy-MM-dd'),
        }
        try {
            const response = await addJob(companyId, request)
            if (response) {
                toast.info("Đăng bài thành công!")
                await delay(1500)
                //window.location.href = '/employer/jobs'
                window.location.reload()
            }
        } catch (error) {
            toast.error(error.response.data)
        }
    }
    const handleCancel = () => {
        window.location.href = '/employer/jobs'
    }

    return (
        <>
            {contextHolder}
            <div className={`px-6 `}>
                <div className={`flex w-full   overflow-y-visible `}>
                    <Form
                        onFinish={handleAddJob}
                        initialValues={{quantity: 1, experience: 1}}
                        form={form}
                        className={`flex w-full mb-10   relative mt-10 overflow-y-visible`}
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
                                    <div className={`w-full flex-col flex gap-10  pt-4 flex-wrap overflow-hidden`}>
                                        <div>
                                            <Form.Item
                                                name='title'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng điền tên công việc',
                                                    },
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
                                                rules={
                                                    [
                                                        {
                                                            required: true,
                                                            message: 'Vui lòng điền địa chỉ',
                                                        },
                                                    ]
                                                }>
                                                <Input
                                                    autoComplete='off'
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    placeholder={location}
                                                    size={'large'}
                                                    addonAfter={<Form.Item name={'province'}
                                                                           rules={[{required: true, message: ''}]}
                                                                           style={{marginBottom: 0, width: '145px'}}>
                                                        <Select
                                                            showArrow={false}
                                                            placeholder={'Tỉnh thành phố'}
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
                            <div className={`rounded-lg bg-white  overflow-hidden border-2 border-green_default `}>
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
                                                <Form.Item name='quantity'
                                                           rules={[{required: true, message: 'Chọn số lượng tuyển'}]}
                                                           style={{marginBottom: '0px', width: '50%'}}>
                                                    <InputNumber
                                                        style={{width: '100%'}}
                                                        size={'large'}
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
                                                    <p className={`font-semibold text-18 line-clamp-1 `}>Kinh nghiệm</p>
                                                </div>
                                                <Form.Item
                                                    name='experience'
                                                    rules={[{required: true, message: 'Chọn kinh nghiệm'}]}
                                                    style={{marginBottom: '0px', width: '50%'}}>
                                                    <InputNumber
                                                        size={'large'}
                                                        addonAfter={'năm'}
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
                                                    <p className={`font-semibold text-18 line-clamp-1 `}>Giới tính</p>
                                                </div>
                                                <Select
                                                    value={gender}
                                                    onChange={(e) => setGender(e)}
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
                                                    <BsClock size={20}
                                                             fill={"#00b14f"}/>
                                                    <p className={`font-semibold text-18 line-clamp-1 `}>Hình thức</p>
                                                </div>
                                                <Select
                                                    value={type}
                                                    onChange={(e) => setType(e)}
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
                                                    value={field}
                                                    onChange={(e) => setField(e)}
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
                                                    onChange={(_, dateString) => handleExpireDateChange(dateString)}
                                                    placeholder={'Chọn thời hạn tuyển'}
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
        </>
    );
};

export default AddJob;