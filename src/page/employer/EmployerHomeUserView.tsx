import React, {useEffect, useState} from 'react';
import EmployerHeader from "@/component/employer/EmployerHeader.tsx";
import {AiOutlineGlobal} from "react-icons/ai";
import {PiCopySimple, PiPhoneLight} from "react-icons/pi";
import ExpandableCard from "@/component/ExpandableCard.tsx";
import {MdDelete, MdLocationPin} from "react-icons/md";
import LocationMap from "@/component/employer/LocationMap.tsx";
import {IoMdMap} from "react-icons/io";
import Footer from "@/component/Footer.tsx";
import {Input, Pagination} from "antd";
import {Outlet} from "react-router-dom";
import {getCompanyInfo} from "@/axios/Request.ts";
import {CompanyInfo} from "@/page/employer/EmployerHome.tsx";
import {CustomModal} from "@/page/UserProfile.tsx";
import FlexStickyLayout from "@/component/AllPagesPDFViewer.tsx";

const EmployerHomeUserView = () => {

    return (
        <div>
            <EmployerHeader/>
            <div className={`w-full flex justify-center`}>
                <div className={`custom-container`}>
                    <Outlet/>
                </div>
            </div>
            <Footer/>
        </div>
    );
};


export const HomeContent = () => {
    const [currentCompanyId, setCurrentCompanyId] = useState<string>('');
    const [currentCompany, setCurrentCompany] = useState<any>();
    const handleGetCompanyInfo = async (id: string) => {
        const response: CompanyInfo = await getCompanyInfo(id);
        setCurrentCompany(response);
    }
    useEffect(() => {
        const companyId = JSON.parse(localStorage.getItem("company")).id;
        setCurrentCompanyId(companyId);
        handleGetCompanyInfo(companyId);
    }, [])
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch (err) {
            console.error("Failed to copy: ", err);

        }
    }
    return (
        <div className={`flex flex-col mt-10`}>
            {/*banner*/}
            <div className={`w-full rounded-lg overflow-hidden min-h-[358px] bg-gradient-to-green`}>
                <div className={`h-[224px] overflow-hidden`}>
                    <img
                        alt={currentCompany?.name}
                        className={`h-full object-cover object-center w-full`}
                        src={currentCompany?.wallpaper}/>

                </div>
                <div className={`relative`}>
                    <div
                        className={`items-center justify-center left-10 overflow-hidden absolute -top-14 aspect-square bg-white border rounded-full flex h-[180px]`}>
                        <img
                            alt={currentCompany?.name}
                            src={currentCompany?.logo}
                            className={`h-[80%] object-cover aspect-square`}/>

                    </div>

                </div>
                <div className={`items-center flex gap-8 my-6 pl-[252px] pr-10 relative`}>
                    <div className={`flex flex-1 flex-col`}>
                        <div>
                            <p className={`text-white line-clamp-2 font-bold leading-7 mb-4 text-[24px]`}>
                                {currentCompany?.name}
                            </p>
                        </div>
                        <div className={`flex gap-10`}>
                            <div className={`flex gap-2 items-center `}>
                                <AiOutlineGlobal size={20} fill={"#fff"}/>
                                <p className={`text-white`}>{currentCompany?.website}</p>
                            </div>

                            <div className={`flex gap-2 items-center `}>
                                <PiPhoneLight size={20} fill={"#fff"}/>
                                <p className={`text-white`}>{currentCompany?.phone}</p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <div className={`flex w-full mb-10  relative mt-10 overflow-y-visible `}>
                {/*left side*/}
                <div className={`w-2/3 pr-5 flex flex-col gap-6`}>
                    {/*description*/}
                    <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                        <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                            Giới thiệu công ty
                        </h2>
                        <div className={` w-full bg-white min-h-[100px] px-6 pt-4 flex-wrap overflow-hidden`}>
                            {
                                currentCompany && currentCompany.description ? (
                                    <ExpandableCard children={
                                        <pre>{currentCompany.description}</pre>
                                    }/>
                                ): (
                                    <div className={`flex flex-col gap-4 pb-4 justify-center items-center`}>
                                        <img src={'/public/no-avatar.png'} alt={""}/>
                                        <p className={`font-bold `}>Chưa có mô tả</p>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                    <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                        <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                            Tuyển dụng
                        </h2>
                        <div className={` w-full bg-white min-h-[100px] px-6 pt-4 flex-wrap overflow-hidden`}>
                            {
                                Array.from(Array(10).keys()).map((item, index) => (
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
                                                                        Nhân Viên Kế Toán, Thu Nhập 7 - 9
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
                                                    {/*<div*/}
                                                    {/*    className={`bg-white p-1 rounded-full hover:bg-green-300 `}>*/}
                                                    {/*    <FaRegHeart color={"green"}/>*/}
                                                    {/*</div>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ))
                            }
                        </div>
                        <div className={`flex justify-center py-3`}>
                            <Pagination
                                pageSize={20}
                                showSizeChanger={false}
                                defaultCurrent={6}
                                total={500}/>

                        </div>
                    </div>
                </div>
                {/*right side*/}
                <div className={`pl-5 w-1/3 flex flex-col gap-6 h-fit sticky top-24`}>
                    <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                        <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                            Thông tin liên hệ
                        </h2>
                        <div className={` w-full flex flex-col gap-4 bg-white min-h-[100px] px-5 py-4`}>
                            <div className={`flex flex-col gap-2`}>
                                <div className={`flex gap-3`}>
                                    <MdLocationPin size={24} fill={"#00b14f"}/>
                                    <p>Địa chỉ công ty</p>
                                </div>
                                <p className={`opacity-70 ml-2`}>{currentCompany?.address}</p>
                            </div>
                            <div className={`flex gap-3`}>
                                <IoMdMap size={24} fill={"#00b14f"}/>
                                <p>Xem bản đồ</p>
                            </div>
                            <LocationMap
                                location={currentCompany?.address}
                            />

                        </div>
                    </div>
                    <div className={`rounded-lg bg-white overflow-hidden border-green_default `}>
                        <h2 className={`bg-gradient-to-green py-3 px-5 text-white text-18 font-semibold leading-7 m-0`}>
                            Chia sẻ với bạn bè
                        </h2>
                        <div className={` w-full flex flex-col gap-4 bg-white min-h-[100px] px-5 py-4`}>
                            <p>Sao chép đường dẫn</p>
                            <Input
                                suffix={<PiCopySimple size={20} onClick={handleCopy} className={`cursor-pointer`}
                                                      fill={"#00b14f"}/>}
                                contentEditable={false}
                                value={window.location.href}
                                variant={'filled'}
                                readOnly={true}
                            />
                            <div className={`mt-3 flex flex-col gap-3`}>
                                <p>Chia sẻ qua mạng xã hội</p>
                                <div className={`flex gap-4`}>
                                    <img
                                        className={`rounded-full cursor-pointer border w-8 p-1 aspect-square object-cover`}
                                        alt=""
                                        src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/facebook.png"/>
                                    <img className={`rounded-full cursor-pointer border w-8 p-1 aspect-square`}
                                         alt="" data-ll-status="loaded"
                                         src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/twitter.png"/>
                                    <img
                                        className={`rounded-full cursor-pointer border w-8 p-1 aspect-square object-cover`}
                                        alt="" data-ll-status="loaded"
                                        src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/linked.png"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EmployerHomeUserView;