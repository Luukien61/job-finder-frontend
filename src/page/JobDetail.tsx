import React from 'react';
import {GoClock} from "react-icons/go";
import {FiSend} from "react-icons/fi";
import {FaRegHeart} from "react-icons/fa6";
import {MdReportGmailerrorred} from "react-icons/md";
import {greasemonkey} from "globals";

const JobDetail = () => {
    return (
        <div>
            <JobDetailContent/>
        </div>
    );
};

export default JobDetail;

const JobDetailContent = () => {
    return (
        <div className={`flex justify-center`}>
            <div className={`w-[1250px] `}>

                <div className={`flex gap-[24px] `}>
                    {/*left side*/}
                    <div className={`w-[67%] box-border flex flex-col gap-[24px]`}>
                        {/*Quick detail*/}
                        <div
                            className={`flex px-[24px] py-[20px] flex-col gap-[16px] h-fit relative bg-white rounded-[8px] w-full`}>
                            <h1 className={`text-[#263a4d] text-[20px] font-bold leading-[28px] m-0 overflow-hidden text-ellipsis`}>Kế
                                Toán Nội Bộ Thu Nhập Từ 9 Đến 12 Triệu Tại Long Biên, Hà Nội</h1>
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
                                        <div className={`font-bold`}>9-12 triệu</div>
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
                                    <div className={`flex flex-col gap-[2px]`}>
                                        <div>Địa điểm</div>
                                        <div className={`font-bold`}>Hà Nội</div>
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
                                        <div className={`font-bold`}>3 năm</div>
                                    </div>
                                </div>
                            </div>
                            {/*deadline*/}
                            <div className={`flex items-center gap-[18px]`}>
                                <div
                                    className={`flex items-center gap-x-1 rounded bg-[#f2f4f5] text-[#263a4d] tracking-[.14px] text-[14px] leading-[22px] px-2 py-[4px] w-fit`}>
                                    <GoClock size={18}/>
                                    <p>Hạn nộp hồ sơ: 21/11/2024</p>
                                </div>
                            </div>
                            {/*apply*/}
                            <div className={`flex flex-wrap items-center text-[14px] gap-3 mt-1`}>
                                <a className={`bg-green_default cursor-pointer hover:bg-[#009643] rounded-[6px] text-white flex-1 flex font-bold gap-[6px] h-[40px] justify-center items-center tracking-[.175px] leading-[22px] px-2 py-3`}>
                                    <FiSend/>
                                    <p>Ứng tuyển ngay</p>
                                </a>
                                {/*save*/}
                                <a className={`bg-white border hover:border-green_default hover:bg-gray-50 gap-2 border-solid border-[#99e0b9] text-green_default w-[130px] flex items-center justify-center rounded-[6px] cursor-pointer font-bold h-[40px] tracking-[.175px] leading-[22px] px-2 py-3`}>
                                    <FaRegHeart/>
                                    <p>Lưu tin</p>
                                </a>
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
                                        <pre className={`break-words `}>
                                            - Làm báo giá, hợp đồng theo mẫu sẵn, theo dõi công nợ với nhà cung cấp

                                        </pre>
                                    </div>
                                    {/*requirement*/}
                                    <div className={`job_description_item `}>
                                        <h3>Yêu cầu ứng viên</h3>
                                        <pre className={`break-words`}>
                                            - Có kinh nghiệm làm kế toán trên 3 năm.

                                        </pre>
                                    </div>
                                    {/*location*/}
                                    <div className={`job_description_item `}>
                                        <h3>Địa điểm làm việc</h3>
                                        <pre className={`break-words `}>
                                            - Hà Nội: Số 11, ngõ 131 Chu Huy Mân, Long Biên

                                        </pre>
                                    </div>
                                    <div className={`job_description_item `}>
                                        <h3>Cách thức ứng tuyển</h3>
                                        <p>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <b>Ứng tuyển</b> ngay dưới đây.
                                        </p>
                                    </div>
                                    <div className={`job_description_item `}>
                                        <p>Hạn nộp hồ sơ: 21/11/2024</p>
                                    </div>
                                    {/*save and apply*/}
                                    <div className={`flex flex-wrap items-center text-[14px] gap-3 mt-1`}>
                                        <a className={`bg-green_default cursor-pointer hover:bg-[#009643] rounded-[6px] text-white flex font-bold gap-[6px] h-[40px] justify-center items-center tracking-[.175px] leading-[22px] px-2 py-3`}>
                                            <p>Ứng tuyển ngay</p>
                                        </a>
                                        {/*save*/}
                                        <a className={`bg-white border hover:border-green_default hover:bg-gray-50 gap-2 border-solid border-[#99e0b9] text-green_default w-[130px] flex items-center justify-center rounded-[6px] cursor-pointer font-bold h-[40px] tracking-[.175px] leading-[22px] px-2 py-3`}>
                                            <p>Lưu tin</p>
                                        </a>
                                    </div>
                                    <div className={`rounded-[8px] flex gap-x-4 p-2  bg-bg_default text-color-default`}>
                                        <MdReportGmailerrorred size={24} className={`text-green_default`}/>
                                        <p className={`text-[16px] tracking-[.14px] leading-6 font-normal `}>Báo cáo tin
                                            tuyển dụng: Nếu bạn thấy rằng tin tuyển dụng này không đúng hoặc có dấu hiệu
                                            lừa đảo, <span className={`text-green_default cursor-pointer`}>hãy phản ánh với chúng tôi.</span>
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
                                        <div className={`rounded-[8px] hover:border hover:border-solid hover:border-green_default w-full  bg-highlight_default cursor-pointer flex gap-[16px] m-auto mb-[16px] p-[12px] relative transition-transform`}>
                                            {/*company logo*/}
                                            <div
                                                className={`flex items-center w-[105px] bg-white border-solid border border-[#e9eaec] rounded-[8px] h-[120px] m-auto object-contain p-2 relative `}>
                                                <a className={` block overflow-hidden bg-white`} target={"_blank"}
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
                                                            <div className={`flex flex-col w-3/4 max-w-[490px] gap-2`}>
                                                                <h3>
                                                                    <a
                                                                        target="_blank"
                                                                        href="https://www.topcv.vn/viec-lam/nhan-vien-ke-toan-thu-nhap-7-9-trieu-thanh-tri-ha-noi/1508427.html?ta_source=SuggestSimilarJob_LinkDetail&amp;jr_i=dense-hertz%3A%3A1730538183569-25caaf%3A%3Af1144ce3ac3c47fdae7d2597270d3c1a%3A%3A1%3A%3A0.9500">
                                                                        <p className={`font-[600] hover:text-green_default text-[18px] text-[#212f3f] leading-6 cursor-pointer`}>
                                                                            Nhân Viên Kế Toán, Thu Nhập 7 - 9 Triệu
                                                                            (Thanh
                                                                            Trì - Hà Nội) </p>
                                                                    </a>
                                                                </h3>
                                                                <div className={`w-full`}>
                                                                    <a target="_blank">
                                                                        <p className={`break-words text-[14px] hover:underline truncate`}>CÔNG
                                                                            TY
                                                                            CỔ PHẦN THIẾT BỊ VÀ CÔNG NGHỆ LEANWAY </p>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className={`w-1/4 flex justify-end pr-2`}>
                                                                <p className={`text-green_default font-bold`}>7-9
                                                                    triệu</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`mt-auto flex items-end justify-between py-2`}>
                                                        <div className={`flex gap-4`}>
                                                            <div
                                                                className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                                <p className={`text-black text-[14px] truncate `}>Hà
                                                                    Nội</p>
                                                            </div>
                                                            <div
                                                                className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                                <p className={`text-black text-[14px] truncate `}>3
                                                                    năm</p>
                                                            </div>
                                                            <div
                                                                className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                                <p className={`text-black text-[14px] truncate `}>29/12/2024</p>
                                                            </div>
                                                        </div>
                                                        <div className={`bg-white p-1 rounded-full hover:bg-green-300 `}>
                                                           <FaRegHeart color={"green"}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div>

                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}