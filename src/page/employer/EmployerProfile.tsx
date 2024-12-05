import React, {useEffect, useState} from 'react';
import {CustomInput} from "@/page/CompleteProfile.tsx";
import {GoOrganization} from "react-icons/go";
import {HiPhone} from "react-icons/hi";
import {GetProp, Spin, UploadFile, UploadProps} from 'antd';
import {Form, Image, Select, Tooltip, Upload} from "antd";
import {BiEdit, BiSolidCity} from "react-icons/bi";
import {fullProvinces} from "@/info/AppInfo.ts";
import {ProvinceProps} from "@/page/employer/EmployerSignup.tsx";
import TextArea from "antd/es/input/TextArea";
import {IoPersonCircleSharp} from "react-icons/io5";
import {RiLockPasswordFill} from "react-icons/ri";
import {getCompanyInfo, updateCompanyInfo} from "@/axios/Request.ts";
import {CompanyInfo} from "@/page/employer/EmployerHome.tsx";
import {PlusOutlined} from '@ant-design/icons';
import {checkIsCompanyBanned} from "@/service/ApplicationService.ts";
import {MdCancel} from "react-icons/md";
import imageUpload from "@/axios/ImageUpload.ts";
import {delay} from "@/page/GoogleCode.tsx";
import {toast} from "react-toastify";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const EmployerProfile = () => {
    const [companyName, setCompanyName] = useState<string>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePass, setRetypePass] = useState('');
    const [currentCompany, setCurrentCompany] = useState<CompanyInfo>();
    const [currentCompanyId, setCurrentCompanyId] = useState<string>('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [province, setProvince] = useState<string>('');
    const [district, setDistrict] = useState<string>();
    const [provincesName, setProvincesName] = useState<ProvinceProps[]>([])
    const [districtsName, setDistrictsName] = useState<{ value: string, label: string }[]>([])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: '0',
            name: 'logo.png',
            status: 'done',
            url: currentCompany?.logo,
        }
    ]);
    const [description, setDescription] = useState<string>('');
    const [isBanned, setIsBanned] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isEditAccount, setIsEditAccount] = useState<boolean>(false);
    const checkCompanyStatus = async (id) => {
        try {
            const isBanned: boolean = await checkIsCompanyBanned(id);
            setIsBanned(isBanned);
        } catch (e) {
            console.log(e);
        }
    }
    const getDistrictsByProvinceCode = (_value: any, option: ProvinceProps[] | ProvinceProps) => {
        setDistrict(null)
        if (!Array.isArray(option)) {
            setProvince(option.value);
            const province = fullProvinces.find(p => p.code === option.code);
            const district = province.districts.map(value => (
                {value: value.name, label: value.name}
            ))
            setDistrictsName(district)
        }
    }

    const handleGetCompanyInfo = async (id: string) => {
        const response: CompanyInfo = await getCompanyInfo(id);
        setCurrentCompany(response);
        resetInfo(response);
        await delay(600)
        setIsLoading(false);
    }
    const handleUpload = async () => {
        const file = fileList[0]
        const thumbUrl = file.thumbUrl
        return await imageUpload({image: thumbUrl})
    };

    const props: UploadProps = {
        style: {width: '100%'},
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) => {
        setFileList(newFileList);
    }
    const handleCancelEditProfile = () => {
        resetInfo(currentCompany)
        setIsEdit(false);
    }

    const resetInfo = (response: CompanyInfo) => {
        setFileList([{
            uid: '0',
            name: 'logo.png',
            status: 'done',
            url: response.logo,
        }])
        setCompanyName(response.name);
        setWebsite(response.website);
        setPhone(response.phone);
        const locations = response.address.split(',');
        const provinceName = locations[1].trim()
        setProvince(provinceName);
        setDistrict(locations[0].trim());
        const province = fullProvinces.find(p => p.name === provinceName);
        const district = province.districts.map(value => (
            {value: value.name, label: value.name}
        ))
        setDistrictsName(district)
        setDescription(response.description);
        setEmail(response.email);
    }
    const updateInfo = async () => {
        setIsLoading(true)
        let url = currentCompany?.logo;
        if (fileList && fileList.length == 1) {
            const thumbUrl = fileList[0].thumbUrl
            if (thumbUrl) {
                url = await imageUpload({image: thumbUrl});
            }
        }
        let fullAddress = province
        if (district) {
            fullAddress = district + ', ' + province
        }
        const request = {
            name: companyName,
            phone: phone,
            website: website,
            logo: url,
            description: description,
            address: fullAddress,
        }
        await updateCompanyInfo(currentCompanyId, request);
        window.location.reload();
    }


    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Tải lên</div>
        </button>
    );
    useEffect(() => {
        const companyId = JSON.parse(localStorage.getItem("company")).id;
        setCurrentCompanyId(companyId);
        handleGetCompanyInfo(companyId);
        checkCompanyStatus(companyId);
        const rawProvinces = fullProvinces.map(value => (
            {value: value.name, label: value.name, code: value.code}
        ))
        setProvincesName(rawProvinces)
    }, []);

    const onDistrictSelected = (value: any) => {
        setDistrict(value)
    }
    return (
        <div className={`flex justify-center`}>

            {
                isLoading ? <Spin style={{color: 'green'}} fullscreen={true} size={"large"} tip="Đang tải"></Spin>
                    : (
                        <div className={`bg-white rounded-lg my-6 py-10 px-6 w-[1170px]`}>
                            <div className={`flex items-start  pr-6 w-full gap-6 justify-start`}>
                                <h2 className="border-l-[6px] mb-6 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                    Hồ sơ nhà tuyển dụng
                                </h2>
                                <div>
                                    {
                                        !isEdit ? (
                                            <Tooltip placement={'top'} title={`${!isBanned ? 'Chỉnh sửa' : ''}`}>
                                                <button
                                                    onClick={() => setIsEdit(true)}
                                                    className={`${!isBanned && 'cursor-pointer'} disabled:opacity-50`}
                                                    disabled={isBanned}>
                                                    <BiEdit size={24}
                                                            fill={"#00b14f"}/>
                                                </button>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip placement={'top'} title={`Hủy`}>
                                                <button
                                                    onClick={() => setIsEdit(false)}
                                                    className={`${!isBanned && 'cursor-pointer'} disabled:opacity-50`}
                                                    disabled={isBanned}>
                                                    <MdCancel size={24}
                                                              fill={"#00b14f"}/>
                                                </button>
                                            </Tooltip>
                                        )
                                    }


                                </div>
                            </div>
                            <div className={`w-full rounded-lg relative overflow-hidden min-h-[358px]`}>
                                <div className={`h-[224px] overflow-hidden`}>
                                    <img
                                        alt={currentCompany?.name}
                                        className={`h-full object-cover object-center w-full`}
                                        src={currentCompany?.wallpaper}/>

                                </div>
                                <div className={``}>
                                    <div
                                        className={`items-center justify-center  overflow-hidden absolute  bottom-[10%]  aspect-square bg-white border rounded-full flex h-[180px]`}>
                                        {
                                            isEdit ? (
                                                <Upload {...props}
                                                        listType="picture-circle"
                                                        fileList={fileList}
                                                        onPreview={handlePreview}
                                                        onChange={handleChange}
                                                >
                                                    {fileList.length >= 1 ? null : uploadButton}
                                                </Upload>

                                            ) : (
                                                <img
                                                    alt={currentCompany?.name}
                                                    src={currentCompany?.logo}
                                                    className={`h-[180px] object-cover aspect-square`}/>
                                            )
                                        }
                                        {previewImage && (
                                            <Image
                                                wrapperStyle={{display: 'none'}}
                                                preview={{
                                                    visible: previewOpen,
                                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                                }}
                                                src={previewImage}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Form
                                onFinish={updateInfo}
                                name={'info'}
                                scrollToFirstError={true}
                            >
                                <div className={`flex flex-col pr-6 w-full gap-6 justify-start`}>
                                    <h2 className="border-l-[6px] mb-6 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                        Thông tin chung
                                    </h2>
                                    <div className={`flex flex-col w-full justify-start gap-10`}>
                                        <div className={`flex w-full`}>

                                            <div className={`w-full  justify-start`}>
                                                <Form.Item
                                                    name='name'
                                                    rules={[
                                                        {
                                                            validator: (_) =>
                                                                companyName ? Promise.resolve() : Promise.reject(new Error('Tên nhà tuyển dụng không thể bỏ trống'))

                                                        },
                                                    ]}
                                                >
                                                    <CustomInput
                                                        prefix={<GoOrganization className={`mr-2`} size={24}
                                                                                fill={"#00b14f"}/>}
                                                        allowClear={true}
                                                        showPlainText={!isEdit}
                                                        value={companyName}
                                                        defaultValue={companyName}
                                                        label={"Tên tổ chức"}
                                                        isBoldLabel={true}
                                                        width={'w-full text-16'}
                                                        onChange={(e) => setCompanyName(e.target.value)}/>
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className={`flex items-start w-full`}>
                                            <div className={`flex flex-col w-1/2 pr-6 justify-start`}>
                                                <CustomInput
                                                    allowClear={true}
                                                    addBefore={'https://'}
                                                    value={website}
                                                    defaultValue={website}
                                                    label={"Website"}
                                                    showPlainText={!isEdit}
                                                    isBoldLabel={true}
                                                    width={'w-full text-16 '}
                                                    onChange={(e) => setWebsite(e.target.value)}/>
                                            </div>
                                            <div className={`flex flex-col w-1/2 justify-start`}>
                                                <Form.Item
                                                    style={{marginBottom: '0px'}}
                                                    name='phone'
                                                    rules={[
                                                        {
                                                            validator: (_) =>
                                                                phone ? Promise.resolve() : Promise.reject(new Error('Số điện thoại không thể bỏ trống'))

                                                        },
                                                    ]}
                                                >
                                                    <CustomInput
                                                        prefix={<HiPhone className={`mr-2`} size={24}
                                                                         fill={"#00b14f"}/>}
                                                        type={'text'}
                                                        allowClear={true}
                                                        value={phone}
                                                        defaultValue={phone}
                                                        showPlainText={!isEdit}
                                                        label={"Số điện thoại"}
                                                        isBoldLabel={true}
                                                        width={'w-full text-16'}
                                                        onChange={(e) => setPhone(e.target.value)}/>
                                                </Form.Item>
                                            </div>
                                        </div>
                                        <div className={`flex w-full`}>
                                            <div className={`w-1/2 pr-6 justify-start`}>
                                                <p className={`ml-1 mb-1 font-semibold`}>Tỉnh thành phố</p>
                                                {
                                                    !isEdit ? (
                                                        <p className={`ml-1 mt-1 p-2 border border-green_default rounded-md font-semibold `}>{province}</p>
                                                    ) : (
                                                        <Select
                                                            placeholder={'Tỉnh thành phố'}
                                                            prefix={<BiSolidCity className={`mr-2`} size={24}
                                                                                 fill={"#00b14f"}/>}
                                                            className={`h-[42px] w-full `}
                                                            optionFilterProp="label"
                                                            options={provincesName}
                                                            value={province}
                                                            onChange={(value, option) => getDistrictsByProvinceCode(value, option)}
                                                        />
                                                    )
                                                }
                                            </div>
                                            <div className={`w-1/2  justify-start`}>
                                                <p className={`ml-1 mb-1 font-semibold`}>Quận huyện</p>
                                                {
                                                    !isEdit ? (
                                                        <p className={`ml-1 mt-1 p-2 border border-green_default rounded-md font-semibold `}>{district}</p>
                                                    ) : (
                                                        <Select
                                                            placeholder={'Quận huyện'}
                                                            prefix={<BiSolidCity className={`mr-2`} size={24}
                                                                                 fill={"#00b14f"}/>}
                                                            className={`h-[42px] w-full `}
                                                            value={district}
                                                            optionFilterProp="label"
                                                            onChange={onDistrictSelected}
                                                            options={districtsName}
                                                        />
                                                    )
                                                }
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div className={`flex flex-col pr-6 w-full gap-6 justify-start mt-16`}>
                                    <h2 className="border-l-[6px] mb-6 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                        Mô tả
                                    </h2>
                                    {
                                        isEdit ? (
                                            <TextArea
                                                disabled={!isEdit || isBanned}
                                                spellCheck={false}
                                                value={description}
                                                defaultValue={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                size={"large"}
                                                placeholder={"Mô tả công ty/tổ chức của bạn là một cách để thu hút ứng viên..."}
                                                style={{height: 200}}
                                            />
                                        ) : (
                                            <div className={`px-2 py-2 rounded-lg border border-green_default`}>
                                                <pre className={`min-h-20`}>{description}</pre>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    isEdit && (
                                        <div className={`w-full flex justify-end gap-6 mt-6 px-6 `}>
                                            <button onClick={handleCancelEditProfile}
                                                    type={'button'}
                                                    className={`font-semibold`}>
                                                Hủy
                                            </button>
                                            <Form.Item style={{marginBottom: '0px'}}>
                                                <button
                                                    type="submit"
                                                    className={`w-fit px-2 hover:bg-green-600  rounded bg-green_default py-2 text-white font-bold`}>
                                                    Xác nhận
                                                </button>
                                            </Form.Item>
                                        </div>
                                    )
                                }
                            </Form>
                            <div
                                className={`flex flex-col pr-6 w-full gap-6 justify-start mt-10 border-t border-solid border-green_default pt-10`}>
                                <div className={`w-full flex gap-4 items-start`}>
                                    <h2 className="border-l-[6px] mb-6 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default ">
                                        Tài khoản
                                    </h2>
                                    {
                                        !isEditAccount ? (
                                            <Tooltip placement={'top'} title={`${!isBanned ? 'Chỉnh sửa' : ''}`}>
                                                <button
                                                    onClick={() => setIsEditAccount(true)}
                                                    className={`${!isBanned && 'cursor-pointer'} disabled:opacity-50`}
                                                    disabled={isBanned}>
                                                    <BiEdit size={24}
                                                            fill={"#00b14f"}/>
                                                </button>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip placement={'top'} title={`Hủy`}>
                                                <button
                                                    onClick={() => setIsEditAccount(false)}
                                                    className={`${!isBanned && 'cursor-pointer'} disabled:opacity-50`}
                                                    disabled={isBanned}>
                                                    <MdCancel size={24}
                                                              fill={"#00b14f"}/>
                                                </button>
                                            </Tooltip>
                                        )
                                    }
                                </div>
                                <div className={`flex flex-col  w-full justify-start`}>
                                    <CustomInput
                                        prefix={<IoPersonCircleSharp className={`mr-2`} size={24}
                                                                     fill={"#00b14f"}/>}
                                        allowClear={true}
                                        value={email}
                                        label={"Email"}
                                        isBoldLabel={true}
                                        disable={true}
                                        width={'w-1/2 text-16'}
                                        onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                {
                                    isEditAccount && (
                                        <>
                                            <div className={`flex flex-col  w-full justify-start`}>
                                                <CustomInput
                                                    prefix={<RiLockPasswordFill className={`mr-2`} size={24}
                                                                                fill={"#00b14f"}/>}
                                                    type={'password'}
                                                    allowClear={true}
                                                    autoComplete={'new-password'}
                                                    value={password}
                                                    isBoldLabel={true}
                                                    label={"Mật khẩu"}
                                                    disable={isBanned}
                                                    width={'w-1/2 text-16'}
                                                    onChange={(e) => setPassword(e.target.value)}/>
                                            </div>
                                            <div className={`flex flex-col  w-full justify-start`}>
                                                <CustomInput
                                                    prefix={<RiLockPasswordFill className={`mr-2`} size={24}
                                                                                fill={"#00b14f"}/>}
                                                    type={'password'}
                                                    allowClear={true}
                                                    autoComplete={'new-password'}
                                                    value={password}
                                                    isBoldLabel={true}
                                                    label={"Xác nhận mật khẩu"}
                                                    disable={isBanned}
                                                    width={'w-1/2 text-16'}
                                                    onChange={(e) => setPassword(e.target.value)}/>
                                                <div className={`w-1/2 flex gap-6  justify-end mt-6`}>
                                                    <button

                                                        className={`font-semibold`}>
                                                        Hủy
                                                    </button>
                                                    <button
                                                        className={`w-fit px-2 hover:bg-green-600  rounded bg-green_default py-2 text-white font-bold`}>
                                                        Xác nhận
                                                    </button>

                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    )
            }
        </div>
    );
};

export default EmployerProfile;