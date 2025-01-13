import React, {useEffect, useState} from 'react';
import {CustomInput} from "@/page/CompleteProfile.tsx";
import {GoOrganization} from "react-icons/go";
import {HiPhone} from "react-icons/hi";
import {
    Button,
    Form,
    GetProp,
    Image,
    Modal,
    Popconfirm,
    Select,
    Spin,
    Tooltip,
    Upload,
    UploadFile,
    UploadProps
} from 'antd';
import {BiEdit, BiSolidCity} from "react-icons/bi";
import {fullProvinces, portalUrl} from "@/info/AppInfo.ts";
import {ProvinceProps} from "@/page/employer/EmployerSignup.tsx";
import TextArea from "antd/es/input/TextArea";
import {IoPersonCircleSharp, IoWarning} from "react-icons/io5";
import {RiLockPasswordFill} from "react-icons/ri";
import {
    cancelSubscription,
    getCompanyInfo,
    getPlanPriority,
    getPrices,
    getUpgradeCheckoutUrl,
    priceCheckOut,
    updateCompanyInfo
} from "@/axios/Request.ts";
import {CompanyInfo} from "@/page/employer/EmployerHome.tsx";
import {PlusOutlined} from '@ant-design/icons';
import {checkIsCompanyBanned, moveToMiddle} from "@/service/ApplicationService.ts";
import {MdCancel} from "react-icons/md";
import imageUpload from "@/axios/ImageUpload.ts";
import {delay} from "@/page/GoogleCode.tsx";
import {MinimalPlan, useCompanyPlanState} from "@/zustand/AppState.ts";
import {CompanyPlan, Price, priceless, UltimatePlanId} from "@/info/ApplicationType.ts";

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
    const {plan} = useCompanyPlanState()
    const [companyPlan, setCompanyPlan] = useState<MinimalPlan>();
    const [isOpenPlan, setIsOpenPlan] = useState<boolean>(false);
    const [prices, setPrices] = useState<Price[]>([]);

    const fetchPrices = async () => {
        const response: Price[] = await getPrices();
        const filter = response.filter((price) => priceless.includes(price.product));
        const localPrice = await getPlanPriority()
        const updatePlan = filter.map((item) => ({
            ...item,
            priority: localPrice[item.id]
        }))
        const sortedPlan = moveToMiddle(UltimatePlanId, updatePlan);
        setPrices(sortedPlan);
    };

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

    const handleOpenPlan = async () => {
        await fetchPrices()
        setIsOpenPlan(true)
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

    useEffect(() => {
        if (plan) {
            setIsLoading(false);
            setCompanyPlan(plan)
        }
    }, [plan]);

    const onDistrictSelected = (value: any) => {
        setDistrict(value)
    }
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/employer/entry/login'
    }
    const handleViewInvoice = () => {
        window.open(portalUrl, '_blank');
    }
    const handleCancelSubscription = async () => {
        try {
            await cancelSubscription({companyId: currentCompanyId, priceId: companyPlan?.priceId})
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className={`w-full flex justify-center`}>
            <div className={`flex justify-center w-[1100px]`}>

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
                                            className={`items-center  justify-center  overflow-hidden absolute  bottom-[10%]  aspect-square bg-white border rounded-full flex h-[180px]`}>
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
                                        {
                                            (companyPlan) &&
                                            <span
                                                className={'job-pro-icon drop-shadow w-fit absolute left-[120px] bottom-[10%]  text-14 rounded-md p-2 mr-4'}>{companyPlan?.name} company</span>
                                        }
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
                                    className={`flex flex-col pr-6 w-full justify-start mt-10 border-t border-solid border-green_default pt-10`}>
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
                                    <div className={`flex flex-col w-full justify-start`}>
                                        {
                                            companyPlan &&
                                            <div className={`mb-6 flex flex-col `}>
                                                <Tooltip placement={'bottom'} title={'Nâng cấp tài khoản'}>
                                                <span onClick={handleOpenPlan}
                                                      className={'job-pro-icon drop-shadow hover:scale-105 w-fit cursor-pointer text-14 rounded-md p-2 mr-4'}>{companyPlan?.name} company</span>
                                                </Tooltip>
                                            </div>
                                        }
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
                                            <div className={`flex flex-col gap-6 mt-6`}>
                                                <div className={`flex flex-col w-full justify-start`}>
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
                                                            onClick={() => setIsEditAccount(false)}
                                                            className={`font-semibold`}>
                                                            Hủy
                                                        </button>
                                                        <button
                                                            className={`w-fit px-2 hover:bg-green-600  rounded bg-green_default py-2 text-white font-bold`}>
                                                            Xác nhận
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        !isEditAccount && (
                                            <div className={`w-full flex mt-6`}>
                                                <button
                                                    className={`w-fit px-2 hover:bg-red-600  rounded bg-red-500 py-2 text-white font-bold`}
                                                    onClick={handleLogout}>Đăng xuất
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                }
                <Modal
                    onCancel={() => setIsOpenPlan(false)}
                    footer={null}
                    open={isOpenPlan}
                    width={1170}
                >
                    <div className={`bg-white pt-10 flex flex-col gap-4`}>
                        <div className={`w-full flex justify-center items-center`}>
                            <div className={`flex gap-6 items-center`}>
                                {
                                    prices.length > 0 && prices.map((price, index) => (
                                        <div key={index}>
                                            <PriceCard
                                                priority={price.priority}
                                                currentPlantPriority={companyPlan?.planPriority}
                                                isCurrentPlan={companyPlan?.priceId == price.id}
                                                {...price}/>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={`w-full flex px-10 gap-4 justify-end items-end`}>
                            <div className={`cursor-pointer`}>
                                {/*<p className={`text-text_color text-14 font-semibold hover:underline`}>Hủy đăng ký</p>*/}

                                <Popconfirm
                                    icon={<IoWarning  color={'red'} size={'24'}/>}
                                    onConfirm={handleCancelSubscription}
                                    title="Hủy đăng ký"
                                    description={
                                    <div className={'flex flex-col'}>
                                        <p>Bạn có muốn hủy đăng ký {companyPlan?.name} company?</p>
                                        <p>Mọi số tiền còn lại sẽ không được hoàn trả.</p>
                                        <p>Ưu đãi còn lại sẽ được sử dụng đến hết chu kì.</p>
                                    </div>}
                                    okText="Tôi muốn hủy"
                                    okButtonProps={{color: "danger", danger: true}}
                                    cancelText="Thoát"
                                >
                                    <p className={`text-text_color text-14 font-semibold hover:underline`}>Hủy đăng
                                        ký</p>
                                </Popconfirm>
                            </div>
                            <div className={`cursor-pointer`}>
                                <button
                                    onClick={handleViewInvoice}
                                    className={`font-bold bg-[#343A46FF] text-white px-2 hover:bg-[#191A1CFF] border-solid border-2 border-[#272C35] py-2 rounded-md mt-4 hover:text-white  transition`}>
                                    Xem lịch sử
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default EmployerProfile;


const PriceCard = ({product, currency, interval, id, unit_amount, isCurrentPlan, currentPlantPriority, priority}) => {
    const formatCurrency = (amount, currencyCode) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: currencyCode.toUpperCase()
        }).format(amount);
    };
    const formatPlanName = (amount: number) => {
        let planName = 'Mini';
        switch (amount) {

            case 300000:
                planName = 'Basic'
                break;
            case 4000000 :
                planName = 'Ultimate'
                break;
            case 500000 :
                planName = 'Pro'
                break;
        }
        return planName;
    }
    const formatInterval = (interval) => {
        const intervalMap = {
            'day': 'ngày',
            'week': 'tuần',
            'month': 'tháng',
            'year': 'năm'
        };
        return intervalMap[interval] || interval;
    };

    const handleCheckout = async (priceId: string) => {
        try {
            const response = await priceCheckOut({priceId: priceId});
            window.location.href = response.url;
        } catch (error) {
            console.error("Error creating checkout session:", error);
        }
    };


    return (
        <div
            className={`bg-white border ${currentPlantPriority > priority && 'opacity-50 pointer-events-none'} ${product == UltimatePlanId ? 'pt-0 border border-green_default' : 'pt-4'}  cursor-pointer group hover:scale-110 transition-all hover:border-green_default duration-300 hover:border-2 relative shadow-lg rounded-lg p-10 pt-0 w-[310px] max-w-sm mx-auto`}>
            <div className={`w-full flex justify-center`}>
                {
                    product == UltimatePlanId && (
                        <div className={`bg-green-500 rounded-b-xl p-3`}>
                            <p className={`text-white font-bold`}>Phổ biến nhất</p>
                        </div>
                    )
                }
                {
                    isCurrentPlan && (
                        <div className={`bg-[#343A46FF] absolute top-0 right-0 rounded-bl-xl p-1`}>
                            <p className={`text-14 text-white font-bold`}>Current</p>
                        </div>
                    )
                }

            </div>
            <div className="flex justify-center items-center mb-4">
                <h2 className="text-[36px] font-bold text-gray-800">{formatPlanName(unit_amount)}</h2>
            </div>

            <div className="mb-4">
                <div className={`flex justify-center`}>
                    <p className={`text-text_color text-14 opacity-70`}>Chỉ với</p>
                </div>
                <div className="text-3xl flex justify-center font-extrabold ">
                    {formatCurrency(unit_amount, currency)}
                    <span className={`text-text_color`}>/ {formatInterval(interval)}</span>
                </div>
            </div>
            {
                product == UltimatePlanId && (
                    <div className={`w-full flex justify-center`}>
                        <p className={`text-red-600  opacity-70 italic`}>tức chỉ với hơn <span className={`font-bold text-red-600`}>333.000đ/tháng</span></p>
                    </div>
                )
            }
            {
                product == 'prod_RLdPii9sz0QMtX' && (
                    <div className="border-t pt-4 mt-4">
                        <ul className={`list-disc `}>
                            <li>Giới hạn 30 bài đăng/tháng</li>
                            <li>Không hiển thị ưu tiên khi tìm kiếm</li>
                        </ul>
                    </div>
                )
            }

            {
                product == UltimatePlanId && (
                    <div className="border-t pt-4 mt-4">
                        <ul className={`list-disc`}>
                            <li>Không giới hạn số lượng bài đăng</li>
                            <li>Tối đa hiển thị ưu tiên khi tìm kiếm</li>
                        </ul>
                    </div>
                )
            }
            {
                product == 'prod_RLNEo0klDpuWTM' && (
                    <div className="border-t pt-4 mt-4">
                        <ul className={`list-disc`}>
                            <li>Không giới hạn số lượng bài đăng</li>
                            <li>Hiển thị ưu tiên khi tìm kiếm</li>
                        </ul>
                    </div>
                )
            }
            {
                isCurrentPlan ? (
                    <button
                        disabled={isCurrentPlan}
                        className={`w-full pointer-events-none disabled:opacity-70  ${product == UltimatePlanId ? 'bg-[#343A46FF] hover:bg-[#26262a] text-white' : ' text-[#272C35]'} font-bold hover:bg-[#272C35] border-solid border-2 border-[#272C35] py-2 rounded-md mt-4 hover:text-white  transition`}>
                        Gói hiện tại
                    </button>
                ) : (
                    <button
                        disabled={isCurrentPlan}
                        onClick={() => handleCheckout(id)}
                        className={`w-full disabled:opacity-70  ${product == UltimatePlanId ? 'bg-[#343A46FF] hover:bg-[#26262a] hover:scale-105 text-white' : ' text-[#272C35]'} font-bold hover:bg-[#272C35] border-solid border-2 border-[#272C35] py-2 rounded-md mt-4 hover:text-white  transition`}>
                        Đăng Ký Ngay
                    </button>
                )
            }
        </div>
    );
};
