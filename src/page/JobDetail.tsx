import React, {useCallback, useEffect, useState} from 'react';
import {GoClock} from "react-icons/go";
import {FiSend} from "react-icons/fi";
import {FaRegHeart, FaHeart} from "react-icons/fa6";
import {MdEmail, MdKeyboardDoubleArrowRight, MdReportGmailerrorred} from "react-icons/md";
import {BiSolidLeaf} from "react-icons/bi";
import {SearchBar} from "@/component/Content.tsx";
import {PiFolderUser} from "react-icons/pi";
import {IoPersonCircleSharp, IoWarning} from "react-icons/io5";
import {useNavigate, useParams} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {
    applyJob,
    createReport,
    getCompanyInfo,
    getJobDetailById,
    getUserDto,
    isAppliedJob,
    loginUser
} from "@/axios/Request.ts";
import {format} from 'date-fns';
import {CompanyInfo} from "@/page/employer/EmployerHome.tsx";
import {Checkbox, Form, FormProps, Input, Modal, Select, Spin, Tooltip} from "antd";
import {IoMdCloseCircle} from "react-icons/io";
import {RiLockPasswordFill} from "react-icons/ri";
import {UserResponse} from "@/page/GoogleCode.tsx";
import {UserDto} from "@/page/UserProfile.tsx";
import {
    checkIsJobSaved,
    convertDate,
    handleSaveJob,
    refinePdfName,
    unSaveJobHandler
} from "@/service/ApplicationService.ts";
import {JobDetailProps} from "@/info/ApplicationType.ts";
import {reportOptions, reportQuota} from "@/info/AppInfo.ts";

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};
export type SelectProps = {
    value: string,
    label: string;
}


const JobDetail = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [openReports, setOpenReports] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [openLogin, setOpenLogin] = useState<boolean>(false)
    const [isConfirmCheck, setIsConfirmCheck] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form] = Form.useForm()
    const [job, setJob] = useState<JobDetailProps>()
    const [company, setCompany] = useState<CompanyInfo>()
    const [currentUser, setCurrentUser] = useState<UserDto>();
    const [userCvs, setUserCvs] = useState<SelectProps[]>([]);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");
    const {TextArea} = Input;
    const [modalTypeRequestOpen, setModalTypeRequestOpen] = useState<string>('');

    const handleModalClicks = useCallback((event: React.MouseEvent) => {
        event.stopPropagation()
    }, [])
    const handleCloseModel = useCallback(() => {
        setOpenModal(false);
    }, [])
    const handleGetJobById = async (id: string | number) => {
        try {
            const jobDetail: JobDetailProps = await getJobDetailById(id)
            if (jobDetail) {
                setJob(jobDetail)
            } else {
                toast.error("Job not found")
            }
        } catch (e: any) {
            toast.error(e.response.data)
        }
    }

    const handleGetCompanyInfo = async (id: string) => {
        try {
            const response: CompanyInfo = await getCompanyInfo(id);
            setCompany(response);
        } catch (e: any) {
            toast.error(e.response.data)
        }
    }

    const handleCloseLoginModal = () => {
        setIsConfirmCheck(false)
        setOpenLogin(false)
    }

    const checkJobSaveStatus = async (jobId, userId) => {
        if (userId) {
            const saveStatus: boolean = await checkIsJobSaved(jobId, userId)
            setIsSaved(saveStatus)
        }
    }


    useEffect(() => {
        if (job) handleGetCompanyInfo(job.companyId)
    }, [job]);

    useEffect(() => {
        handleGetJobById(id)
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setCurrentUser(user)
            setIsLogin(true)
            checkJobSaveStatus(id, user.id)
        }

    }, []);

    const handleReportClick = () => {
        if (isLogin) {
            setOpenReports(true)
        } else {
            setOpenLogin(true)
            setModalTypeRequestOpen('REPORT')
        }
    }


    const handleApplyJobClick = async () => {

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            try {
                const isApplied = await isAppliedJob(id, user.id)
                console.log(isApplied)
                if (isApplied) {
                    toast.error("Bạn đã ứng tuyển công việc này trước đó")
                } else {
                    setOpenModal(true)
                }
            } catch (e) {
                toast.error(e)
            }
        } else {
            setOpenLogin(true)
            setModalTypeRequestOpen('APPLY')

        }

    }

    const handleApplyJob = async (values: any) => {
        if (currentUser && currentUser.id) {
            if (values.selectCV) {
                try {
                    const jobApplicationRequest = {
                        userId: currentUser.id,
                        userName: currentUser.name,
                        userAvatar: currentUser.avatar,
                        jobId: id,
                        referenceLetter: values.letter,
                        cvUrl: values.selectCV,
                        createdDate: format(new Date(), 'yyyy-MM-dd'),
                    }
                    await applyJob(jobApplicationRequest);
                    toast.success("Bạn đã ứng tuyển thành công");
                    setOpenModal(false)

                } catch (err) {
                    toast.error(err.response.data)
                }
            } else {
                toast.error("Ban chua chon CV")
            }
        } else {
            toast.error("Dang nhap truoc")
        }

    }

    useEffect(() => {
        const handleGetUser = async (userId: string) => {
            try {
                const userInfo: UserDto = await getUserDto(userId);
                if (userInfo) {
                    setCurrentUser(userInfo)
                    if (userInfo.cv && userInfo.cv.length > 0) {
                        const userCvs = refinePdfName(userInfo.cv) as SelectProps[]
                        setUserCvs(userCvs)
                    }
                }
            } catch (e) {
                toast.error("Co loi xay ra")
            }

        }
        if (openModal) {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.id) {
                handleGetUser(user.id)
            }
        }
    }, [openModal]);
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleLogin = async (values: any) => {
        setIsLoading(true);
        try {
            const userResponse: UserResponse = await loginUser({email: values.email, password: values.password})
            if (userResponse) {
                localStorage.setItem("user", JSON.stringify(userResponse))
                toast.info("User logged in successfully")
                setOpenLogin(false)
                window.location.reload()
                if (modalTypeRequestOpen == 'APPLY') {
                    setOpenModal(true)
                }
                if (modalTypeRequestOpen == 'REPORT') {
                    setOpenReports(true)
                }
                setIsConfirmCheck(false)
            } else {
                toast.error("Có lỗi xảy ra")
            }
        } catch (e: any) {
            toast.error(e.response)
        }
        setIsLoading(false)

    }

    const handleSave = async () => {
        try {
            const saved = await handleSaveJob(id, currentUser.id, () => {
            })
            setIsSaved(saved)

        } catch (e) {
            setIsSaved(false)
            toast.error(e.response.data)
        }
    }


    const handleUnSave = async () => {
        try {
            const saved = await unSaveJobHandler(id, currentUser.id, () => {
            })
            setIsSaved(saved)
        } catch (e) {
            setIsSaved(true)
            toast.error(e.response.data)
        }
    }
    const handleCreateReport = async (values: any) => {
        try {
            const reason = values.type + " - " + values.reason;
            if (currentUser && currentUser.id && id && company) {
                const report = {
                    userId: currentUser.id,
                    jobId: id,
                    companyId: company.id,
                    rpReason: reason,
                }
                await createReport(id, report)
                toast.info("Tố cáo thành công")
            }
        } catch (e) {
            console.log(e)
            toast.error(e.response.data)
        }
    }
    const handleCloseReport=()=>{
        setOpenReports(false)
    }


    return (
        <div>
            <div className={`w-full relative flex justify-center mb-4 bg-[#19734E]`}>
                <div className={`custom-container py-2 sticky top-0`}>
                    <SearchBar/>
                </div>
            </div>
            <div className={`flex justify-center`}>
                <div className={`w-[1170px] `}>
                    <div className={`flex relative overflow-y-visible min-h-screen *:mb-4`}>
                        {/*social media share*/}
                        <div className={`sticky top-[40%] block h-fit -ml-[55px] w-[70px] z-10`}>
                            <div
                                className={`flex flex-col rounded-[1000px] p-2 shadow gap-2 h-fit w-fit bg-white items-center `}>
                                <a className="flex items-center border hover:bg-gray-100 rounded-full cursor-pointer h-8 w-8 justify-center p-1"
                                   href="http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.topcv.vn%2Fviec-lam%2Fke-toan-noi-bo-thu-nhap-tu-9-den-12-trieu-tai-long-bien-ha-noi%2F1509876.html"
                                   target="_blank"
                                   data-original-title="Chia sẻ qua Facebook">
                                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9.29432 10.4025L9.80625 7.15275H6.65277V5.04043C6.65277 4.15183 7.09302 3.28354 8.50083 3.28354H9.95471V0.516193C9.10804 0.381299 8.25252 0.308322 7.39506 0.297852C4.79958 0.297852 3.1051 1.85671 3.1051 4.67483V7.15275H0.228058V10.4025H3.1051V18.2628H6.65277V10.4025H9.29432Z"
                                            fill="#7F878F"></path>
                                    </svg>
                                </a>
                                <a className="flex items-center border rounded-full hover:bg-gray-100 cursor-pointer h-8 w-8 justify-center p-1"
                                   href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.topcv.vn%2Fviec-lam%2Fke-toan-noi-bo-thu-nhap-tu-9-den-12-trieu-tai-long-bien-ha-noi%2F1509876.html"
                                   target="_blank" data-toggle="tooltip" data-placement="top"
                                   data-original-title="Chia sẻ qua Twitter">
                                    <svg width="16" height="13" viewBox="0 0 16 13" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M15.9288 1.79435C15.4113 2.00666 14.8672 2.1545 14.3099 2.23421C14.5705 2.19165 14.9538 1.74469 15.1064 1.56378C15.3382 1.2909 15.5148 0.979376 15.6274 0.645043C15.6274 0.620212 15.6534 0.58474 15.6274 0.567003C15.6143 0.560173 15.5995 0.556593 15.5846 0.556593C15.5696 0.556593 15.5549 0.560173 15.5418 0.567003C14.9367 0.879312 14.2928 1.11767 13.6252 1.27646C13.6019 1.28323 13.5771 1.28384 13.5535 1.27821C13.5299 1.27259 13.5084 1.26094 13.4912 1.24453C13.4392 1.18555 13.3833 1.12986 13.3237 1.07781C13.0514 0.845268 12.7425 0.654943 12.4082 0.513794C11.957 0.337346 11.4696 0.26093 10.9828 0.290317C10.5105 0.318748 10.0494 0.439493 9.62819 0.645043C9.21337 0.861753 8.84879 1.15616 8.55637 1.51057C8.24878 1.87536 8.0267 2.2987 7.90509 2.75211C7.80481 3.18341 7.79344 3.62917 7.8716 4.0646C7.8716 4.13909 7.8716 4.14973 7.80461 4.13909C5.15112 3.76663 2.97399 2.86917 1.19507 0.943013C1.11691 0.857879 1.07598 0.857879 1.01271 0.943013C0.238619 2.06395 0.614499 3.83758 1.58211 4.71375C1.71237 4.83081 1.84635 4.94432 1.98777 5.05074C1.54412 5.02072 1.11131 4.90612 0.714982 4.71375C0.64055 4.66763 0.599613 4.69246 0.595891 4.7776C0.585341 4.89563 0.585341 5.0143 0.595891 5.13233C0.673544 5.69797 0.907417 6.23381 1.27359 6.68504C1.63977 7.13628 2.12511 7.48673 2.67998 7.70054C2.81525 7.75576 2.95619 7.79737 3.10052 7.82469C2.68982 7.90176 2.26859 7.91375 1.85379 7.86017C1.76447 7.84243 1.73098 7.88855 1.76447 7.97013C2.31154 9.38904 3.49873 9.8218 4.36958 10.063C4.48867 10.0808 4.60776 10.0808 4.74174 10.1091C4.74174 10.1091 4.74174 10.1091 4.71941 10.1304C4.46262 10.5774 3.4243 10.8789 2.94794 11.035C2.07845 11.3326 1.15142 11.4464 0.231175 11.3684C0.0860335 11.3471 0.0525391 11.3507 0.0153232 11.3684C-0.0218927 11.3861 0.0153232 11.4252 0.0562607 11.4606C0.24234 11.5777 0.42842 11.6806 0.621942 11.7799C1.19806 12.0794 1.80713 12.3173 2.43808 12.4893C5.70563 13.3478 9.38256 12.7164 11.8351 10.3929C13.7629 8.56962 14.4402 6.05461 14.4402 3.53606C14.4402 3.44028 14.563 3.38353 14.6337 3.33386C15.1214 2.97165 15.5514 2.54389 15.9102 2.06395C15.9724 1.9924 16.0042 1.90132 15.9996 1.80854C15.9996 1.75534 15.9996 1.76598 15.9288 1.79435Z"
                                            fill="#7F878F"></path>
                                    </svg>
                                </a>
                                <a className="flex items-center border rounded-full hover:bg-gray-100 cursor-pointer h-8 w-8 justify-center p-1"
                                   href="https://www.linkedin.com/cws/share?url=https%3A%2F%2Fwww.topcv.vn%2Fviec-lam%2Fke-toan-noi-bo-thu-nhap-tu-9-den-12-trieu-tai-long-bien-ha-noi%2F1509876.html"
                                   target="_blank" data-toggle="tooltip" data-placement="top"
                                   data-original-title="Chia sẻ qua Linkedin">
                                    <svg width="17" height="15" viewBox="0 0 17 15" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3.77491 14.8558V4.83137H0.345022V14.8558H3.77527H3.77491ZM2.06068 3.46294C3.25651 3.46294 4.00098 2.69318 4.00098 1.7312C3.9786 0.747299 3.25651 -0.000976562 2.08342 -0.000976562C0.909537 -0.000976562 0.142853 0.747299 0.142853 1.73111C0.142853 2.69309 0.887064 3.46285 2.03821 3.46285H2.06041L2.06068 3.46294ZM5.6734 14.8558H9.10302V9.25832C9.10302 8.95911 9.1254 8.65912 9.21601 8.44542C9.46384 7.84657 10.0282 7.22668 10.9759 7.22668C12.2167 7.22668 12.7133 8.14586 12.7133 9.4936V14.8558H16.1429V9.10811C16.1429 6.02916 14.451 4.59636 12.1945 4.59636C10.3444 4.59636 9.53189 5.60087 9.08046 6.28505H9.10329V4.83172H5.67358C5.71835 5.77213 5.67331 14.8562 5.67331 14.8562L5.6734 14.8558Z"
                                            fill="#7F878F"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        {/*left side*/}
                        <div className={`w-[67%] box-border mr-6 flex flex-col gap-[24px]`}>
                            {/*Quick detail*/}
                            <div
                                className={`flex px-[24px] py-[20px] flex-col gap-[16px] h-fit relative bg-white rounded-[8px] w-full`}>
                                <h1 className={`text-[#263a4d] text-[20px] font-bold leading-[28px] m-0 overflow-hidden text-ellipsis`}>{job?.title}</h1>
                                <div className={`flex items-center text-[14px] `}>
                                    {/*salary*/}
                                    <div className={`flex items-center gap-[16px] w-1/3`}>
                                        <div
                                            className=" flex flex-col h-[40px] justify-center p-[10px] aspect-square items-center bg-gradient-to-r from-[#00bf5d] to-[#00907c] rounded-[30px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M21.92 16.75C21.59 19.41 19.41 21.59 16.75 21.92C15.14 22.12 13.64 21.68 12.47 20.82C11.8 20.33 11.96 19.29 12.76 19.05C15.77 18.14 18.14 15.76 19.06 12.75C19.3 11.96 20.34 11.8 20.83 12.46C21.68 13.64 22.12 15.14 21.92 16.75Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M9.99 2C5.58 2 2 5.58 2 9.99C2 14.4 5.58 17.98 9.99 17.98C14.4 17.98 17.98 14.4 17.98 9.99C17.97 5.58 14.4 2 9.99 2ZM9.05 8.87L11.46 9.71C12.33 10.02 12.75 10.63 12.75 11.57C12.75 12.65 11.89 13.54 10.84 13.54H10.75V13.59C10.75 14 10.41 14.34 10 14.34C9.59 14.34 9.25 14 9.25 13.59V13.53C8.14 13.48 7.25 12.55 7.25 11.39C7.25 10.98 7.59 10.64 8 10.64C8.41 10.64 8.75 10.98 8.75 11.39C8.75 11.75 9.01 12.04 9.33 12.04H10.83C11.06 12.04 11.24 11.83 11.24 11.57C11.24 11.22 11.18 11.2 10.95 11.12L8.54 10.28C7.68 9.98 7.25 9.37 7.25 8.42C7.25 7.34 8.11 6.45 9.16 6.45H9.25V6.41C9.25 6 9.59 5.66 10 5.66C10.41 5.66 10.75 6 10.75 6.41V6.47C11.86 6.52 12.75 7.45 12.75 8.61C12.75 9.02 12.41 9.36 12 9.36C11.59 9.36 11.25 9.02 11.25 8.61C11.25 8.25 10.99 7.96 10.67 7.96H9.17C8.94 7.96 8.76 8.17 8.76 8.43C8.75 8.77 8.81 8.79 9.05 8.87Z"
                                                    fill="white"></path>
                                            </svg>
                                        </div>
                                        <div className={`flex flex-col gap-[2px]`}>
                                            <div>Mức lương</div>
                                            <div className={`font-bold`}>{job?.minSalary} - {job?.maxSalary} triệu</div>
                                        </div>
                                    </div>
                                    {/*location*/}
                                    <div className={`flex items-center gap-[16px] w-1/3`}>
                                        <div
                                            className=" flex flex-col h-[40px] justify-center p-[10px] aspect-square items-center bg-gradient-to-r from-[#00bf5d] to-[#00907c] rounded-[30px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24"
                                                 viewBox="0 0 25 24" fill="none">
                                                <path
                                                    d="M21.2866 8.45C20.2366 3.83 16.2066 1.75 12.6666 1.75C12.6666 1.75 12.6666 1.75 12.6566 1.75C9.1266 1.75 5.0866 3.82 4.0366 8.44C2.8666 13.6 6.0266 17.97 8.8866 20.72C9.9466 21.74 11.3066 22.25 12.6666 22.25C14.0266 22.25 15.3866 21.74 16.4366 20.72C19.2966 17.97 22.4566 13.61 21.2866 8.45ZM12.6666 13.46C10.9266 13.46 9.5166 12.05 9.5166 10.31C9.5166 8.57 10.9266 7.16 12.6666 7.16C14.4066 7.16 15.8166 8.57 15.8166 10.31C15.8166 12.05 14.4066 13.46 12.6666 13.46Z"
                                                    fill="white"></path>
                                            </svg>
                                        </div>
                                        <div className={`flex overflow-x-hidden flex-col gap-[2px]`}>
                                            <div>Địa điểm</div>
                                            <div className={`font-bold truncate break-words`}>{job?.location}</div>
                                        </div>
                                    </div>
                                    {/*experience*/}
                                    <div className={`flex items-center gap-[16px] w-1/3`}>
                                        <div
                                            className=" flex flex-col h-[40px] justify-center p-[10px] aspect-square items-center bg-gradient-to-r from-[#00bf5d] to-[#00907c] rounded-[30px]">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path
                                                    d="M17.39 15.67L13.35 12H10.64L6.59998 15.67C5.46998 16.69 5.09998 18.26 5.64998 19.68C6.19998 21.09 7.53998 22 9.04998 22H14.94C16.46 22 17.79 21.09 18.34 19.68C18.89 18.26 18.52 16.69 17.39 15.67ZM13.82 18.14H10.18C9.79998 18.14 9.49998 17.83 9.49998 17.46C9.49998 17.09 9.80998 16.78 10.18 16.78H13.82C14.2 16.78 14.5 17.09 14.5 17.46C14.5 17.83 14.19 18.14 13.82 18.14Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M18.35 4.32C17.8 2.91 16.46 2 14.95 2H9.04998C7.53998 2 6.19998 2.91 5.64998 4.32C5.10998 5.74 5.47998 7.31 6.60998 8.33L10.65 12H13.36L17.4 8.33C18.52 7.31 18.89 5.74 18.35 4.32ZM13.82 7.23H10.18C9.79998 7.23 9.49998 6.92 9.49998 6.55C9.49998 6.18 9.80998 5.87 10.18 5.87H13.82C14.2 5.87 14.5 6.18 14.5 6.55C14.5 6.92 14.19 7.23 13.82 7.23Z"
                                                    fill="white"></path>
                                            </svg>
                                        </div>
                                        <div className={`flex flex-col gap-[2px]`}>
                                            <div>Kinh nghiệm</div>
                                            <div className={`font-bold`}>{job?.experience} năm</div>
                                        </div>
                                    </div>
                                </div>
                                {/*deadline*/}
                                <div className={`flex items-center gap-[18px]`}>
                                    <div
                                        className={`flex items-center gap-x-1 rounded bg-[#f2f4f5] text-[#263a4d] tracking-[.14px] text-[14px] leading-[22px] px-2 py-[4px] w-fit`}>
                                        <GoClock size={18}/>
                                        <p>Hạn nộp hồ sơ: <span
                                            className={`font-semibold`}>{convertDate(job?.expireDate)}</span></p>
                                    </div>
                                </div>
                                {/*apply*/}
                                <div className={`flex flex-wrap items-center text-[14px] gap-3 mt-1`}>
                                    <button
                                        onClick={handleApplyJobClick}
                                        className={`bg-green_default cursor-pointer hover:bg-[#009643] rounded-[6px] text-white flex-1 flex font-bold gap-[6px] h-[40px] justify-center items-center tracking-[.175px] leading-[22px] px-2 py-3`}>
                                        <FiSend/>
                                        <p>Ứng tuyển ngay</p>
                                    </button>
                                    {/*save*/}
                                    {
                                        isSaved ? (
                                            <div onClick={handleUnSave}
                                                 className={`bg-white border transition-all duration-30 hover:border-green_default hover:bg-gray-50 gap-2 border-solid border-[#99e0b9] text-green_default w-[130px] flex items-center justify-center rounded-[6px] cursor-pointer font-bold h-[40px] tracking-[.175px] leading-[22px] px-2 py-3`}>
                                                <FaHeart/>
                                                <p>Bỏ lưu tin</p>
                                            </div>
                                        ) : (
                                            <div onClick={handleSave}
                                                 className={`bg-white border transition-all duration-30 hover:border-green_default hover:bg-gray-50 gap-2 border-solid border-[#99e0b9] text-green_default w-[130px] flex items-center justify-center rounded-[6px] cursor-pointer font-bold h-[40px] tracking-[.175px] leading-[22px] px-2 py-3`}>
                                                <FaRegHeart/>
                                                <p>Lưu tin</p>
                                            </div>
                                        )
                                    }
                                </div>

                            </div>
                            <div className={`bg-white rounded-[8px] flex flex-col gap-[36px] h-fit p-[20px] w-full`}>
                                <div className={`flex flex-col gap-[20px] h-fit `}>
                                    <div className={`flex items-center `}>
                                        <h2 className={`border-l-[6px] border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default `}
                                        >Chi tiết tuyển dụng</h2>
                                    </div>
                                    {/*job-detail*/}
                                    <div className={`flex flex-col gap-[16px] `}>
                                        {/*description*/}
                                        <div className={`job_description_item `}>
                                            <h3>Mô tả công việc</h3>
                                            <pre>
                                                {job?.description}
                                            </pre>
                                        </div>
                                        {/*requirement*/}
                                        <div className={`job_description_item `}>
                                            <h3>Yêu cầu ứng viên</h3>
                                            <pre className={`break-words`}>
                                                {job?.requirements}
                                            </pre>
                                        </div>
                                        {/*benefit*/}
                                        <div className={`job_description_item `}>
                                            <h3>Quyền lợi</h3>
                                            <pre className={`break-words `}>
                                                {job?.benefits}
                                            </pre>
                                        </div>
                                        <div className={`job_description_item `}>
                                            <h3>Địa điểm</h3>
                                            <pre className={`break-words `}>
                                                {job?.location}
                                            </pre>
                                        </div>
                                        <div className={`job_description_item `}>
                                            <h3>Cách thức ứng tuyển</h3>
                                            <p>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <b>Ứng tuyển</b> ngay dưới
                                                đây.
                                            </p>
                                        </div>
                                        <div className={`job_description_item `}>
                                            <p>Hạn nộp hồ sơ: <span
                                                className={`font-semibold`}>{convertDate(job?.expireDate)}</span></p>
                                        </div>
                                        {/*save and apply*/}
                                        <div className={`flex flex-wrap items-center text-[14px] gap-3 mt-1`}>
                                            <button
                                                onClick={handleApplyJobClick}
                                                className={`bg-green_default cursor-pointer hover:bg-[#009643] rounded-[6px] text-white flex font-bold gap-[6px] h-[40px] justify-center items-center tracking-[.175px] leading-[22px] px-2 py-3`}>
                                                Ứng tuyển ngay
                                            </button>
                                            {/*save*/}
                                            {
                                                isSaved ? (
                                                    <div
                                                        onClick={handleUnSave}
                                                        className={`bg-white border hover:border-green_default hover:bg-gray-50 gap-2 border-solid border-[#99e0b9] text-green_default w-[130px] flex items-center justify-center rounded-[6px] cursor-pointer font-bold h-[40px] tracking-[.175px] leading-[22px] px-2 py-3`}>
                                                        <p>Bỏ lưu tin</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={handleSave}
                                                        className={`bg-white border hover:border-green_default hover:bg-gray-50 gap-2 border-solid border-[#99e0b9] text-green_default w-[130px] flex items-center justify-center rounded-[6px] cursor-pointer font-bold h-[40px] tracking-[.175px] leading-[22px] px-2 py-3`}>
                                                        <p>Lưu tin</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <div
                                            className={`rounded-[8px] flex gap-x-4 p-2  bg-bg_default text-color-default`}>
                                            <MdReportGmailerrorred size={24} className={`text-green_default`}/>
                                            <p className={`text-[16px] tracking-[.14px] leading-6 font-normal `}>Báo cáo
                                                tin
                                                tuyển dụng: Nếu bạn thấy rằng tin tuyển dụng này không đúng hoặc có dấu
                                                hiệu
                                                lừa đảo, <span
                                                    onClick={handleReportClick}
                                                    className={`text-green_default cursor-pointer hover:underline`}>hãy phản ánh với chúng tôi.</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`flex flex-col gap- h-fit mt-10 `}>
                                        <div className={`flex items-center `}>
                                            <h2 className={`border-l-[6px] mb-10 border-solid text-[20px] font-bold pl-[10px] leading-[28px] border-green_default `}
                                            >Việc làm liên quan</h2>
                                        </div>
                                        {/*jobs suggestion*/}
                                        <div className={`flex flex-col `}>
                                            {/*job suggestion items*/}
                                            {
                                                Array.from(Array(20).keys()).map((item, index) => (
                                                    <div
                                                        className={`rounded-[8px] hover:border hover:border-solid hover:border-green_default w-full  bg-highlight_default cursor-pointer flex gap-[16px] m-auto mb-[16px] p-[12px] relative transition-transform`}>
                                                        {/*company logo*/}
                                                        <div
                                                            className={`flex items-center w-[105px] bg-white border-solid border border-[#e9eaec] rounded-[8px] h-[120px] m-auto object-contain p-2 relative `}>
                                                            <a className={` block overflow-hidden bg-white`}
                                                               target={"_blank"}
                                                               href={''}>
                                                                <img
                                                                    src="https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-co-phan-thiet-bi-va-cong-nghe-leanway-1f012ccf747554bd0c2468ff4a032a6c-661dd470c6d24.jpg"
                                                                    className="object-contain align-middle overflow-clip cursor-pointer w-[85px] h-[102px]"
                                                                    alt="CÔNG TY CỔ PHẦN THIẾT BỊ VÀ CÔNG NGHỆ LEANWAY"
                                                                    title="The company's logo"/>
                                                            </a>
                                                        </div>
                                                        {/*card body*/}
                                                        <div className={`flex-1`}>
                                                            <div className={`flex flex-col h-full`}>
                                                                <div className={`mb-auto`}>
                                                                    <div className={`flex `}>
                                                                        <div
                                                                            className={`flex flex-col w-3/4 max-w-[490px] gap-2`}>
                                                                            <h3>
                                                                                <a
                                                                                    target="_blank"
                                                                                    href="https://www.topcv.vn/viec-lam/nhan-vien-ke-toan-thu-nhap-7-9-trieu-thanh-tri-ha-noi/1508427.html?ta_source=SuggestSimilarJob_LinkDetail&amp;jr_i=dense-hertz%3A%3A1730538183569-25caaf%3A%3Af1144ce3ac3c47fdae7d2597270d3c1a%3A%3A1%3A%3A0.9500">
                                                                                    <p className={`font-[600] hover:text-green_default text-[18px] text-[#212f3f] leading-6 cursor-pointer`}>
                                                                                        Nhân Viên Kế Toán, Thu Nhập 7 -
                                                                                        9
                                                                                        Triệu
                                                                                        (Thanh
                                                                                        Trì - Hà Nội) </p>
                                                                                </a>
                                                                            </h3>
                                                                            <div className={`w-full`}>
                                                                                <a target="_blank">
                                                                                    <p className={`break-words text-[14px] hover:underline truncate`}>CÔNG
                                                                                        TY
                                                                                        CỔ PHẦN THIẾT BỊ VÀ CÔNG NGHỆ
                                                                                        LEANWAY </p>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`w-1/4 flex justify-end pr-2`}>
                                                                            <p className={`text-green_default font-bold`}>7-9
                                                                                triệu</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={`mt-auto flex items-end justify-between py-2`}>
                                                                    <div className={`flex gap-4`}>
                                                                        <div
                                                                            className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                                            <p className={`text-black text-[14px] truncate `}>Hà
                                                                                Nội</p>
                                                                        </div>
                                                                        <div
                                                                            className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                                            <p className={`text-black text-[14px] truncate `}>Kinh
                                                                                nghiệm: 3 năm</p>
                                                                        </div>
                                                                        <div
                                                                            className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                                            <p className={`text-black text-[14px] truncate `}>Hạn:
                                                                                29/12/2024</p>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={`bg-white p-1 rounded-full`}>
                                                                        <Tooltip title={'Lưu'}>
                                                                            <FaRegHeart color={"green"}/>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div>

                                </div>
                            </div>
                        </div>
                        {/*right side*/}
                        <div className={` w-[calc(33%-24px)]  `}>
                            <div className={`flex items-center flex-col gap-6 sticky top-0`}>
                                {/*company*/}
                                <div
                                    className={`flex flex-col gap-4 h-fit relative items-start bg-white rounded-[8px] p-5 pb-2 w-full`}>
                                    <div className={`flex flex-col w-full *:mb-3`}>
                                        {/*company name and logo*/}
                                        <a className={``}
                                           href="https://www.topcv.vn/cong-ty/cong-ty-tnhh-nhap-khau-va-phan-phoi-greenhome/167523.html"
                                           target="_blank" data-toggle="tooltip" title={company?.name}
                                           data-placement="top">
                                            <div className={`flex cursor-pointer gap-4 items-start`}>
                                                <div
                                                    className="flex rounded-[5px] items-center bg-white border border-solid border-[#e9eaec] justify-center h-[88px] p-2 w-[88px]">
                                                    <img
                                                        src={company?.logo}
                                                        alt={company?.name}
                                                        className="flex items-center object-contain aspect-square w-[73.92px] flex-shrink-0 rounded-[5px] max-w-full"/>
                                                </div>
                                                <h2 className={`font-bold  w-[calc(100%-100px)]`}>{company?.name}</h2>
                                            </div>
                                        </a>
                                        {/*company size*/}
                                        <div
                                            className={`flex gap-4 items-start *:w-[88px] *:leading-6 *:text-[#7f878f]`}>
                                            <div className={`flex items-center gap-2 `}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     viewBox="0 0 16 16" fill="none">
                                                    <path
                                                        d="M5.99998 1.33334C4.25331 1.33334 2.83331 2.75334 2.83331 4.5C2.83331 6.21334 4.17331 7.6 5.91998 7.66C5.97331 7.65334 6.02665 7.65334 6.06665 7.66C6.07998 7.66 6.08665 7.66 6.09998 7.66C6.10665 7.66 6.10665 7.66 6.11331 7.66C7.81998 7.6 9.15998 6.21334 9.16665 4.5C9.16665 2.75334 7.74665 1.33334 5.99998 1.33334Z"
                                                        fill="#7F878F"></path>
                                                    <path
                                                        d="M9.38664 9.43333C7.52664 8.19333 4.49331 8.19333 2.61997 9.43333C1.77331 10 1.30664 10.7667 1.30664 11.5867C1.30664 12.4067 1.77331 13.1667 2.61331 13.7267C3.54664 14.3533 4.77331 14.6667 5.99997 14.6667C7.22664 14.6667 8.45331 14.3533 9.38664 13.7267C10.2266 13.16 10.6933 12.4 10.6933 11.5733C10.6866 10.7533 10.2266 9.99333 9.38664 9.43333Z"
                                                        fill="#7F878F"></path>
                                                    <path
                                                        d="M13.3267 4.89333C13.4333 6.18667 12.5133 7.32 11.24 7.47333C11.2333 7.47333 11.2333 7.47333 11.2267 7.47333H11.2067C11.1667 7.47333 11.1267 7.47333 11.0933 7.48667C10.4467 7.52 9.85334 7.31333 9.40668 6.93333C10.0933 6.32 10.4867 5.4 10.4067 4.4C10.36 3.86 10.1733 3.36667 9.89334 2.94667C10.1467 2.82 10.44 2.74 10.74 2.71333C12.0467 2.6 13.2133 3.57333 13.3267 4.89333Z"
                                                        fill="#7F878F"></path>
                                                    <path
                                                        d="M14.66 11.06C14.6067 11.7067 14.1933 12.2667 13.5 12.6467C12.8333 13.0133 11.9933 13.1867 11.16 13.1667C11.64 12.7333 11.92 12.1933 11.9733 11.62C12.04 10.7933 11.6467 10 10.86 9.36667C10.4133 9.01333 9.89333 8.73333 9.32666 8.52667C10.8 8.1 12.6533 8.38667 13.7933 9.30667C14.4067 9.8 14.72 10.42 14.66 11.06Z"
                                                        fill="#7F878F"></path>
                                                </svg>
                                                Website:
                                            </div>
                                            <div className={`!text-[#212f3f] font-[500] !w-[calc(100%-100px)]`}>
                                                {company?.website}
                                            </div>
                                        </div>
                                        {/*field*/}
                                        <div
                                            className={`flex gap-4 items-start *:w-[88px] *:leading-6 *:text-[#7f878f]`}>
                                            <div className={`flex items-center gap-2 text-nowrap`}>
                                                <MdEmail/>
                                                Email:
                                            </div>
                                            <div className={`!text-[#212f3f] font-[500] !w-[calc(100%-100px)]`}>
                                                {company?.email}
                                            </div>
                                        </div>
                                        {/*location*/}
                                        <div
                                            className={`flex gap-4 items-start *:w-[88px] *:leading-6 *:text-[#7f878f]`}>
                                            <div className={`flex items-center gap-2 text-nowrap`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     viewBox="0 0 16 16" fill="none">
                                                    <path
                                                        d="M13.7467 5.63334C13.0467 2.55334 10.36 1.16667 8 1.16667C8 1.16667 8 1.16667 7.99334 1.16667C5.64 1.16667 2.94667 2.54667 2.24667 5.62667C1.46667 9.06667 3.57334 11.98 5.48 13.8133C6.18667 14.4933 7.09334 14.8333 8 14.8333C8.90667 14.8333 9.81334 14.4933 10.5133 13.8133C12.42 11.98 14.5267 9.07334 13.7467 5.63334ZM8 8.97334C6.84 8.97334 5.9 8.03334 5.9 6.87334C5.9 5.71334 6.84 4.77334 8 4.77334C9.16 4.77334 10.1 5.71334 10.1 6.87334C10.1 8.03334 9.16 8.97334 8 8.97334Z"
                                                        fill="#7F878F"></path>
                                                </svg>
                                                Địa điểm:
                                            </div>
                                            <div className={`!text-[#212f3f] font-[500] !w-[calc(100%-100px)]`}>
                                                {company?.address}
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 justify-center `}>
                                            <a className={`text-green_default text-[14px] cursor-pointer font-bold hover:underline`}>
                                                Xem trang công ty
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/*overall info*/}
                                <div
                                    className={`flex flex-col gap-4 h-fit relative items-start bg-white rounded-[8px] p-5 w-full`}>
                                    <h2 className={`font-bold leading-6 text-[20px]`}>Thông tin chung</h2>
                                    {/*role*/}
                                    <div className={`flex gap-4 items-center `}>
                                        <div
                                            className={`bg-green_default flex items-center rounded-full p-2 h-10 w-10 justify-center `}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24"
                                                 fill="none">
                                                <path
                                                    d="M17.81 5.49V6.23L14.27 4.18C12.93 3.41 11.06 3.41 9.73 4.18L6.19 6.24V5.49C6.19 3.24 7.42 2 9.67 2H14.33C16.58 2 17.81 3.24 17.81 5.49Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M17.84 7.96999L17.7 7.89999L16.34 7.11999L13.52 5.48999C12.66 4.98999 11.34 4.98999 10.48 5.48999L7.66 7.10999L6.3 7.90999L6.12 7.99999C4.37 9.17999 4.25 9.39999 4.25 11.29V15.81C4.25 17.7 4.37 17.92 6.16 19.13L10.48 21.62C10.91 21.88 11.45 21.99 12 21.99C12.54 21.99 13.09 21.87 13.52 21.62L17.88 19.1C19.64 17.92 19.75 17.71 19.75 15.81V11.29C19.75 9.39999 19.63 9.17999 17.84 7.96999ZM14.79 13.5L14.18 14.25C14.08 14.36 14.01 14.57 14.02 14.72L14.08 15.68C14.12 16.27 13.7 16.57 13.15 16.36L12.26 16C12.12 15.95 11.89 15.95 11.75 16L10.86 16.35C10.31 16.57 9.89 16.26 9.93 15.67L9.99 14.71C10 14.56 9.93 14.35 9.83 14.24L9.21 13.5C8.83 13.05 9 12.55 9.57 12.4L10.5 12.16C10.65 12.12 10.82 11.98 10.9 11.86L11.42 11.06C11.74 10.56 12.25 10.56 12.58 11.06L13.1 11.86C13.18 11.99 13.36 12.12 13.5 12.16L14.43 12.4C15 12.55 15.17 13.05 14.79 13.5Z"
                                                    fill="white"></path>
                                            </svg>
                                        </div>
                                        <div className={`flex flex-col `}>
                                            <p>Cấp bậc</p>
                                            <p className={`font-bold`}>{job?.role}</p>
                                        </div>
                                    </div>
                                    {/*experience*/}
                                    <div className={`flex gap-4 items-center `}>
                                        <div
                                            className={`bg-green_default flex items-center rounded-full p-2 h-10 w-10 justify-center `}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24"
                                                 fill="none">
                                                <path
                                                    d="M17.39 15.67L13.35 12H10.64L6.59998 15.67C5.46998 16.69 5.09998 18.26 5.64998 19.68C6.19998 21.09 7.53998 22 9.04998 22H14.94C16.46 22 17.79 21.09 18.34 19.68C18.89 18.26 18.52 16.69 17.39 15.67ZM13.82 18.14H10.18C9.79998 18.14 9.49998 17.83 9.49998 17.46C9.49998 17.09 9.80998 16.78 10.18 16.78H13.82C14.2 16.78 14.5 17.09 14.5 17.46C14.5 17.83 14.19 18.14 13.82 18.14Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M18.35 4.32C17.8 2.91 16.46 2 14.95 2H9.04998C7.53998 2 6.19998 2.91 5.64998 4.32C5.10998 5.74 5.47998 7.31 6.60998 8.33L10.65 12H13.36L17.4 8.33C18.52 7.31 18.89 5.74 18.35 4.32ZM13.82 7.23H10.18C9.79998 7.23 9.49998 6.92 9.49998 6.55C9.49998 6.18 9.80998 5.87 10.18 5.87H13.82C14.2 5.87 14.5 6.18 14.5 6.55C14.5 6.92 14.19 7.23 13.82 7.23Z"
                                                    fill="white"></path>
                                            </svg>
                                        </div>
                                        <div className={`flex flex-col `}>
                                            <p>Kinh nghiệm</p>
                                            <p className={`font-bold`}>{job?.experience} năm</p>
                                        </div>
                                    </div>
                                    {/*quantity*/}
                                    <div className={`flex gap-4 items-center `}>
                                        <div
                                            className={`bg-green_default flex items-center rounded-full p-2 h-10 w-10 justify-center `}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24"
                                                 fill="none">
                                                <path
                                                    d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M14.08 14.15C11.29 12.29 6.74002 12.29 3.93002 14.15C2.66002 15 1.96002 16.15 1.96002 17.38C1.96002 18.61 2.66002 19.75 3.92002 20.59C5.32002 21.53 7.16002 22 9.00002 22C10.84 22 12.68 21.53 14.08 20.59C15.34 19.74 16.04 18.6 16.04 17.36C16.03 16.13 15.34 14.99 14.08 14.15Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M19.99 7.34001C20.15 9.28001 18.77 10.98 16.86 11.21C16.85 11.21 16.85 11.21 16.84 11.21H16.81C16.75 11.21 16.69 11.21 16.64 11.23C15.67 11.28 14.78 10.97 14.11 10.4C15.14 9.48001 15.73 8.10001 15.61 6.60001C15.54 5.79001 15.26 5.05001 14.84 4.42001C15.22 4.23001 15.66 4.11001 16.11 4.07001C18.07 3.90001 19.82 5.36001 19.99 7.34001Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M21.99 16.59C21.91 17.56 21.29 18.4 20.25 18.97C19.25 19.52 17.99 19.78 16.74 19.75C17.46 19.1 17.88 18.29 17.96 17.43C18.06 16.19 17.47 15 16.29 14.05C15.62 13.52 14.84 13.1 13.99 12.79C16.2 12.15 18.98 12.58 20.69 13.96C21.61 14.7 22.08 15.63 21.99 16.59Z"
                                                    fill="white"></path>
                                            </svg>
                                        </div>
                                        <div className={`flex flex-col `}>
                                            <p>Số lượng</p>
                                            <p className={`font-bold`}>{job?.quantity} người</p>
                                        </div>
                                    </div>
                                    {/*type*/}
                                    <div className={`flex gap-4 items-center `}>
                                        <div
                                            className={`bg-green_default flex items-center rounded-full p-2 h-10 w-10 justify-center `}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24"
                                                 fill="none">
                                                <path
                                                    d="M21.09 6.98002C20.24 6.04002 18.82 5.57002 16.76 5.57002H16.52V5.53002C16.52 3.85002 16.52 1.77002 12.76 1.77002H11.24C7.47998 1.77002 7.47998 3.86002 7.47998 5.53002V5.58002H7.23998C5.16998 5.58002 3.75998 6.05002 2.90998 6.99002C1.91998 8.09002 1.94998 9.57002 2.04998 10.58L2.05998 10.65L2.13743 11.4633C2.1517 11.6131 2.23236 11.7484 2.35825 11.8307C2.59806 11.9877 2.9994 12.2464 3.23998 12.38C3.37998 12.47 3.52998 12.55 3.67998 12.63C5.38998 13.57 7.26998 14.2 9.17998 14.51C9.26998 15.45 9.67998 16.55 11.87 16.55C14.06 16.55 14.49 15.46 14.56 14.49C16.6 14.16 18.57 13.45 20.35 12.41C20.41 12.38 20.45 12.35 20.5 12.32C20.8967 12.0958 21.3083 11.8195 21.6834 11.5489C21.7965 11.4673 21.8687 11.3413 21.8841 11.2028L21.9 11.06L21.95 10.59C21.96 10.53 21.96 10.48 21.97 10.41C22.05 9.40002 22.03 8.02002 21.09 6.98002ZM13.09 13.83C13.09 14.89 13.09 15.05 11.86 15.05C10.63 15.05 10.63 14.86 10.63 13.84V12.58H13.09V13.83ZM8.90998 5.57002V5.53002C8.90998 3.83002 8.90998 3.20002 11.24 3.20002H12.76C15.09 3.20002 15.09 3.84002 15.09 5.53002V5.58002H8.90998V5.57002Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M20.8735 13.7342C21.2271 13.5659 21.6344 13.8462 21.599 14.2362L21.24 18.19C21.03 20.19 20.21 22.23 15.81 22.23H8.19003C3.79003 22.23 2.97003 20.19 2.76003 18.2L2.41932 14.4522C2.38427 14.0667 2.78223 13.7868 3.13487 13.9463C4.27428 14.4618 6.37742 15.3764 7.6766 15.7167C7.8409 15.7597 7.9738 15.8773 8.04574 16.0312C8.65271 17.3293 9.96914 18.02 11.87 18.02C13.7521 18.02 15.0852 17.3027 15.6942 16.0014C15.7662 15.8474 15.8992 15.7299 16.0636 15.6866C17.4432 15.3236 19.6818 14.3013 20.8735 13.7342Z"
                                                    fill="white"></path>
                                            </svg>
                                        </div>
                                        <div className={`flex flex-col `}>
                                            <p>Hình thức làm việc</p>
                                            <p className={`font-bold`}>{job?.type}</p>
                                        </div>
                                    </div>
                                    {/*gender*/}
                                    <div className={`flex gap-4 items-center `}>
                                        <div
                                            className={`bg-green_default flex items-center rounded-full p-2 h-10 w-10 justify-center `}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24"
                                                 fill="none">
                                                <path
                                                    d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"
                                                    fill="white"></path>
                                                <path
                                                    d="M17.08 14.15C14.29 12.29 9.74002 12.29 6.93002 14.15C5.66002 15 4.96002 16.15 4.96002 17.38C4.96002 18.61 5.66002 19.75 6.92002 20.59C8.32002 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z"
                                                    fill="white"></path>
                                            </svg>
                                        </div>
                                        <div className={`flex flex-col `}>
                                            <p>Giới tình </p>
                                            <p className={`font-bold`}>{job?.gender}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>
            </div>
            {/*modal*/}
            <div onClick={handleCloseModel}
                 className={`backdrop-blur-sm bg-black bg-opacity-60 flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full h-full max-h-full ${openModal ? "block" : "hidden"}`}>
                <div onClick={event => handleModalClicks(event)}
                     className="relative p-4 max-w-[40%] max-h-full">
                    <div className="relative bg-[#f5f5f5] rounded-lg flex items-center justify-center min-h-60 shadow ">
                        <div className={`overflow-hidden `}>
                            <div className="bg-white border-b rounded-xl shadow p-5 px-0 relative z-10 min-h-4 ">
                                <div className={`z-10 shadow px-5`}>
                                    <h4 className="text-[#263a4d] text-[18px] font-bold leading-7">
                                        Ứng tuyển <span className="text-green_default text-[18px]">{job?.title}</span>
                                    </h4>
                                </div>
                                <Form
                                    name='apply'
                                    onFinish={handleApplyJob}
                                    scrollToFirstError={true}
                                >
                                    <div className={`m-0 max-h-[70vh] overflow-y-auto px-8 relative`}>
                                        <div className={`flex gap-4 py-4 items-end`}>
                                            <PiFolderUser size={28} color={"green"}/>
                                            <p className={`text-[16px] font-bold `}>Chọn CV để ứng tuyển</p>

                                        </div>
                                        <div className={`w-full flex items-center`}>
                                            <Form.Item
                                                name='selectCV'
                                                rules={[{required: true, message: 'Vui lòng chọn CV'}]}
                                                className={`w-full`}>
                                                <Select
                                                    options={userCvs}
                                                    style={{height: '40px'}}
                                                    className={`w-full`}/>
                                            </Form.Item>
                                        </div>
                                        <div className={`flex mt-6 gap-4 items-end`}>
                                            <BiSolidLeaf color={"green"} size={28}/>
                                            <p className={`font-bold `}>Thư giới thiệu</p>
                                        </div>
                                        <div className={`mt-2 flex flex-col gap-2`}>
                                            <p className={`opacity-70 text-[15px]`}>Một thư giới thiệu ngắn gọn, chỉn
                                                chu sẽ
                                                giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển
                                                dụng.</p>

                                            <Form.Item
                                                style={{marginBottom: '10px'}}
                                                name='letter'>
                                                <TextArea
                                                    className={`text-16`}
                                                    spellCheck={false}
                                                    showCount
                                                    maxLength={200}
                                                    placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này."
                                                    style={{height: 150}}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div
                                            className={`rounded border flex flex-col gap-2 outline-none p-3 mt-6 w-full`}>
                                            <div className={`flex gap-4 items-end`}>
                                                <IoWarning size={28} color={"red"}/>
                                                <p className={`text-red-500 font-bold text-[16px]`}>Lưu ý</p>
                                            </div>
                                            <p className={`text-[14px] opacity-70`}>JobFinder khuyên tất cả các bạn hãy
                                                luôn
                                                cẩn trọng trong quá trình tìm việc và chủ động nghiên cứu về thông tin
                                                công
                                                ty, vị trí việc làm trước khi ứng tuyển.
                                                Ứng viên cần có trách nhiệm với hành vi ứng tuyển của mình. Nếu bạn gặp
                                                phải
                                                tin tuyển dụng hoặc nhận được liên lạc đáng ngờ của nhà tuyển dụng, hãy
                                                báo
                                                cáo ngay cho JobFinder qua email <span
                                                    className={`text-green-500 text-[14px] opacity-100 font-bold`}>hotro@jobfinder.vn</span> để
                                                được hỗ trợ kịp thời.</p>
                                        </div>

                                    </div>
                                    <div className={`w-full pt-4 flex items-center justify-center`}>
                                        <div className={`w-[calc(100%-20px)]`}>
                                            <Form.Item className={`w-full`}>
                                                <button
                                                    type="submit"
                                                    className={`w-full hover:bg-green-600  rounded bg-green_default py-2 text-white font-bold`}>Nộp
                                                    hồ sơ ứng tuyển
                                                </button>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal title="Đăng nhập"
                   open={openLogin}
                   cancelText={"Hủy"}
                   destroyOnClose={true}
                   footer={null}
                   closeIcon={<IoMdCloseCircle size={24}
                                               fill={"#00b14f"}/>}
                   onCancel={handleCloseLoginModal}>
                <div className={`w-full flex justify-center`}>
                    <Form
                        name={'login'}
                        scrollToFirstError={true}
                        form={form}
                        onFinish={handleLogin}
                        className={`w-full flex justify-center`}
                    >
                        <div className={`w-[90%] flex flex-col gap-6`}>
                            <div>
                                <div className={`flex gap-1 justify-start items-center`}>
                                    <p className={`ml-1 font-semibold`}>Email</p>
                                </div>
                                <Form.Item
                                    style={{marginBottom: '0px'}}
                                    name='email' rules={[{required: true, message: 'Vui lòng điền email'}]}>
                                    <Input
                                        prefix={<IoPersonCircleSharp className={`mr-2`} size={24}
                                                                     fill={"#00b14f"}/>}

                                        type={'email'}
                                        allowClear={true}
                                        value={loginEmail}
                                        onChange={e => setLoginEmail(e.target.value)}
                                        spellCheck={false}
                                        className={`p-2 outline-none  rounded border mt-2 w-full`}/>
                                </Form.Item>
                            </div>
                            <div>
                                <div className={`flex gap-1 justify-start items-center`}>
                                    <p className={`ml-1 font-semibold`}>Mật khẩu</p>
                                </div>
                                <Form.Item
                                    style={{marginBottom: '0px'}}
                                    name='password'
                                    rules={[{required: true, message: 'Vui lòng điển mật khẩu'}]}>
                                    <Input
                                        prefix={<RiLockPasswordFill className={`mr-2`} size={24}
                                                                    fill={"#00b14f"}/>}
                                        type={'password'}
                                        allowClear={true}
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                        spellCheck={false}
                                        className={`p-2 outline-none  rounded border mt-2 w-full`}/>
                                </Form.Item>
                            </div>
                            <div>
                                <Checkbox
                                    checked={isConfirmCheck}
                                    onChange={() => setIsConfirmCheck(pre => !pre)}
                                    required={true}
                                >Tôi đã đọc và đồng ý với <span
                                    className={`text-green_default font-bold`}>Điều khoản dịch vụ</span> và <span
                                    className={`text-green_default font-bold`}>Chính sách bảo mật</span> của
                                    JobFinder</Checkbox>
                            </div>
                            <Form.Item>
                                <div className={`w-full flex justify-center  `}>
                                    <button
                                        disabled={!isConfirmCheck}
                                        type="submit"
                                        className={`py-2 rounded disabled:bg-gray-200 font-semibold hover:bg-green-600 bg-green_default w-full text-white`}>
                                        Đăng nhập
                                    </button>
                                </div>
                            </Form.Item>
                            <div>
                                <div className={`w-full flex justify-center pb-2`}>
                                    <p className={`opacity-70 italic`}>hoặc</p>
                                </div>
                                <div className={`w-full flex justify-center  `}>
                                    <button
                                        disabled={!isConfirmCheck}
                                        className={`py-2 rounded flex gap-4 disabled:opacity-50 disabled:bg-gray-100 justify-center font-semibold hover:bg-gray-200 bg-gray-50 border w-full `}>
                                        <img className={`w-6`} src="/public/google.png" alt={`Google Signup`}/>
                                        <p> Đăng nhập với Google</p>
                                    </button>
                                </div>

                            </div>
                            <div className={`flex items-center justify-center`}>
                                <p className={`text-14 opacity-70`}>Chưa có tài khoản? <span
                                    onClick={() => navigate('/employer/entry/signup')}
                                    className={`text-14 font-semibold  hover:underline cursor-pointer text-green_default`}>Đăng ký ngay</span>
                                </p>

                            </div>
                        </div>
                    </Form>

                </div>
            </Modal>

            <Modal
                open={openReports}
                destroyOnClose={true}
                footer={null}
                style={{top: '30px'}}
                width={600}
                onCancel={handleCloseReport}
                closeIcon={<IoMdCloseCircle size={24}
                                            fill={"#00b14f"}/>}
            >
                <div className={`w-full p-2 flex *:w-full flex-col gap-4`}>
                    <div className={`w-full flex  justify-center mt-2`}>
                        <p className={`text-[24px] font-semibold text-green_default`}>Phản ánh tin tuyển dụng không
                            chính xác</p>

                    </div>
                    <div className={`flex  items-center justify-center`}>
                        <p className={`text-center text-14 opacity-70`}>{reportQuota}</p>
                    </div>
                    <Form
                        name={'reports'}
                        form={form}
                        onFinish={handleCreateReport}
                        onFinishFailed={onFinishFailed}>
                        <div className={`flex *:w-full flex-col gap-6`}>
                            <div className={` flex items-start`}>
                                <div className={`w-1/4`}>
                                    <p className={`font-semibold`}>Tin tuyển dụng</p>
                                </div>
                                <div className={`w-3/4 pl-4`}>
                                    {job?.title}
                                </div>

                            </div>
                            <div className={` flex items-center`}>
                                <div className={`w-1/4`}>
                                    <p className={`font-semibold`}>Email</p>
                                </div>
                                <div className={`w-3/4 pl-4`}>
                                    <Form.Item style={{marginBottom: '0px'}}>
                                        <Input
                                            style={{marginBottom: '0px'}}
                                            disabled={true}
                                            size={"large"}
                                            value={currentUser?.email}/>
                                    </Form.Item>
                                </div>

                            </div>
                            <div className={` flex items-center`}>
                                <div className={`w-1/4`}>
                                    <p className={`font-semibold`}>Số điện thoại</p>
                                </div>
                                <div className={`w-3/4 pl-4`}>
                                    <Form.Item rules={[{required:true, message: "Số điện thoại không được để trống "}]} name={'phone'} style={{marginBottom: '0px'}}>
                                        <Input
                                            allowClear={true}
                                            style={{marginBottom: '0px'}}
                                            size={"large"}
                                            value={currentUser?.phone}/>
                                    </Form.Item>
                                </div>

                            </div>
                            <div className={` flex items-center`}>
                                <div className={`w-1/4`}>
                                    <p className={`font-semibold`}>Vi phạm</p>
                                </div>
                                <div className={`w-3/4 pl-4`}>
                                    <Form.Item rules={[{required: true, message: 'Chọn vi phạm'}]} name={'type'}
                                               style={{marginBottom: '0px'}}>
                                        <Select
                                            style={{marginBottom: '0px'}}
                                            size={"large"}
                                            options={reportOptions}/>
                                    </Form.Item>
                                </div>

                            </div>
                            <div className={` flex items-start`}>
                                <div className={`w-1/4`}>
                                    <p className={`font-semibold`}>Nội dung</p>
                                </div>
                                <div className={`w-3/4 pl-4`}>
                                    <Form.Item rules={[{required:true, message:"Nội dung không được để trống"}]} name={'reason'} style={{marginBottom: '0px'}}>
                                        <TextArea
                                            showCount={true}
                                            className={'text-14'}
                                            spellCheck={false}
                                            placeholder={'Bạn vui lòng cung cấp rõ thông tin hoặc bất kỳ bằng chứng nào nếu có'}
                                            style={{marginBottom: '0px', height: '150px'}}
                                            size={"large"}
                                        />
                                    </Form.Item>
                                </div>

                            </div>
                            <div className={`flex mt-2 justify-end gap-3 items-center`}>
                                <div>
                                    <button
                                        onClick={handleCloseReport}
                                        type={'button'}
                                        className={`rounded-md border hover:border-green_nga border-[#d9d9d9] py-1 px-4 `}>
                                        Đóng
                                    </button>
                                </div>
                                <div>
                                    <Form.Item style={{marginBottom: '0px'}}>
                                        <button
                                            type="submit"
                                            className={`rounded-md bg-green_nga text-white hover:bg-green-600 py-1 px-4 `}>
                                            Gửi
                                        </button>
                                    </Form.Item>
                                </div>

                            </div>
                        </div>
                    </Form>
                </div>

            </Modal>

            {isLoading && <Spin style={{zIndex: 2000}} size="large" fullscreen={true}/>}
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
            />
        </div>
    );
};

export default JobDetail;


export type JobWidthCardProps = {
    jobId: number
    logo: string,
    title: string,
    companyName: string,
    companyId: string,
    minSalary: number,
    maxSalary: number,
    location: string,
    experience: number,
    expireDate: Date,
    field?: string,
    quickView: boolean,
    onClick?: () => void,
    onQuickViewClick?: (event: React.MouseEvent) => void,
}


export const JobWidthCard: React.FC<JobWidthCardProps> = (job) => {
    const navigate = useNavigate()
    const handleJobCardClick = () => {
        navigate(`/job/detail/${job.jobId}`)
    }
    const expireDate = new Date(job.expireDate);
    const isExpire= expireDate.getTime() < new Date().getTime();
    const formattedDate = expireDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    return (
        <div onClick={handleJobCardClick}
             className={`rounded-[8px] outline outline-1 outline-[#acf2cb] group hover:border relative hover:border-solid ${isExpire ? 'hover:border-red-500 bg-red-50': 'hover:border-green_default bg-highlight_default'}  w-full  cursor-pointer flex gap-[16px] m-auto mb-[16px] p-[12px] relative transition-transform`}>
            {/*company logo*/}
            <div
                className={`flex items-center w-[105px] bg-white border-solid border border-[#e9eaec] rounded-[8px] h-[120px] m-auto object-contain p-2 relative `}>
                <a className={` block overflow-hidden bg-white`}
                   target={"_blank"}
                   href={`/company/${job.companyId}`}>
                    <img
                        src={job.logo}
                        className="object-contain align-middle overflow-clip cursor-pointer w-[85px] h-[102px]"
                        alt={job.companyName}
                        title={job.companyName}/>
                </a>
            </div>
            {/*card body*/}
            <div className={`w-[calc(100%-120px)] `}>
                <div className={`flex flex-col h-full`}>
                    <div className={`mb-auto`}>
                        <div className={`flex `}>
                            <div
                                className={`flex flex-col w-3/4 max-w-[490px] gap-2`}>
                                <h3>
                                    <a
                                        target="_self"
                                        href={`/job/detail/${job.jobId}`}>
                                        <p className={`font-[600] hover:text-green_default text-[18px] line-clamp-2  text-[#212f3f] leading-6 cursor-pointer`}>
                                            {job.title}</p>
                                    </a>
                                </h3>
                                <div className={``}>
                                    <a href={`/company/${job.companyId}`}
                                       target="_blank">
                                        <p className={`break-words max-w-full  text-[14px] opacity-70 hover:underline truncate`}>{job.companyName}</p>
                                    </a>
                                </div>
                            </div>
                            <div className={`w-1/4 flex justify-end pr-2`}>
                                <p className={`text-green_default font-bold`}>{job.minSalary} - {job.maxSalary} triệu</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`mt-auto flex items-end justify-between py-2`}>
                        <div className={`flex gap-4 overflow-hidden`}>
                            <div
                                className={`rounded-[5px] overflow-x-hidden max-w-[33%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                <p className={`text-black text-[14px] truncate `}>{job.location}</p>
                            </div>
                            <div
                                className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                <p className={`text-black text-[14px] truncate `}>{`Kinh
                                    nghiệm: ${job.experience} năm`}</p>
                            </div>
                            <div
                                className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                <p className={`text-black text-[14px] truncate `}>Hạn: <span
                                    className={`text-[14px] truncate font-semibold`}>{formattedDate}</span></p>
                            </div>
                        </div>
                        {/*<div*/}
                        {/*    className={`bg-white p-1 rounded-full hover:bg-green-300 `}>*/}
                        {/*    <FaRegHeart color={"green"}/>*/}
                        {/*</div>*/}
                    </div>
                </div>
                {
                    job.quickView && (
                        <div
                            onClick={job.onQuickViewClick}
                            className={`absolute top-[40%] right-10 group-hover:block hidden transition-transform duration-500`}>
                            <div className={`rounded-full flex p-1 border bg-[#e3faed] items-center  text-[#15bf61]`}>
                                <p className={`text-[12px]`}>Xem nhanh</p>
                                <MdKeyboardDoubleArrowRight/>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}