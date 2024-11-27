import React, {useState} from 'react';
import {SearchBar} from "@/component/Content.tsx";
import {Pagination, Select} from "antd";
import {experienceFilter, provinces_2, salaryFilters, sortFilter} from "@/info/AppInfo.ts";
import {CiFilter} from "react-icons/ci";
import {LiaSortAlphaDownSolid} from "react-icons/lia";
import {JobWidthCard} from "@/page/JobDetail.tsx";
import {BsFillQuestionCircleFill} from "react-icons/bs";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import Autoplay from "embla-carousel-autoplay";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {note, WarningNote} from "@/page/UserProfile.tsx";
import {DefaultPageSize} from "@/info/ApplicationType.ts";
import {MdKeyboardDoubleArrowRight} from "react-icons/md";
import {IoCloseCircleSharp} from "react-icons/io5";

const JobSearch = () => {
    const [salaryRange, setSalaryRange] = useState(0);
    const [isQuickView, setIsQuickView] = useState<boolean>(false);


    const warningItem: WarningNote[] = []
    for (let i = 1; i < 7; i++) {
        const item: WarningNote = {
            img: `/public/warning/${i}.webp`,
            note: note[i - 1],
        }
        warningItem.push(item)
    }

    const handleQuickViewClick = (event: React.MouseEvent) => {
        event.stopPropagation()
        setIsQuickView(true);
    }
    const handleExitQuickView=()=>{
        setIsQuickView(false);
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
                    <div className={`w-full flex flex-col gap-3`}>
                        <div className={`flex w-full gap-4`}>
                            <div className={` flex justify-start gap-1 items-center px-4 p-1`}>

                                <p className={`font-semibold line-clamp-1`}>Bộ lọc</p>
                                <CiFilter size={20}
                                          fill={"#00b14f"}/>
                            </div>
                            <div className={` flex gap-3 `}>
                                <div>
                                    <Select
                                        style={{width: '160px'}}
                                        defaultValue={'Toàn quốc'}
                                        className={`w-fit`}
                                        size={"large"}
                                        options={provinces_2}
                                    />
                                </div>
                                <div>
                                    <Select

                                        style={{width: '160px'}}
                                        placeholder={'Mức lương'}
                                        className={`w-fit`}
                                        size={"large"}
                                        options={salaryFilters}
                                    />
                                </div>
                                <div>
                                    <Select

                                        style={{width: '160px'}}
                                        placeholder={'Kinh nghiệm'}
                                        className={`w-fit`}
                                        size={"large"}
                                        options={experienceFilter}
                                    />
                                </div>
                            </div>
                            <div className={`border-l border-black pl-6 flex `}>
                                <div className={`flex gap-4`}>
                                    <div className={`flex items-center gap-1`}>
                                        <p className={`font-semibold line-clamp-1`}>Hiển thị theo</p>
                                        <LiaSortAlphaDownSolid size={20}
                                                               fill={"#00b14f"}/>
                                    </div>
                                    <div>
                                        <Select
                                            style={{width: '180px'}}
                                            placeholder={'Sắp xếp'}
                                            className={`w-fit`}
                                            size={"large"}
                                            options={sortFilter}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex pb-10 transition-transform duration-300`}>
                            {
                                isQuickView ? (
                                    <div className={`w-full flex`}>
                                        {/*left*/}
                                        <div className={`w-[438px]  pr-4 flex flex-col gap-4 flex-shrink-0 relative`}>
                                            {
                                                Array.from(Array(20).keys()).map((value, index) => (
                                                    <div
                                                        className={`rounded-[8px] group outline outline-1 outline-[#acf2cb] group hover:border relative hover:border-solid hover:border-green_default bg-highlight_default  w-full cursor-pointer flex items-start gap-[16px] m-auto p-[12px] transition-transform`}>
                                                        {/*company logo*/}
                                                        <div
                                                            className={`flex items-start w-[105px] bg-white border-solid border border-[#e9eaec] rounded-[8px] h-[120px]  object-contain p-2 relative `}>
                                                            <a className={` block overflow-hidden bg-white`}
                                                               target={"_blank"}
                                                               href={`/company/`}>
                                                                <img
                                                                    src={'https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-tnhh-he-thong-saishunkan-viet-nam-60f916270d6bb.jpg'}
                                                                    className="object-contain align-middle overflow-clip cursor-pointer w-[85px] h-[102px]"
                                                                    alt={''}
                                                                    title={''}/>
                                                            </a>
                                                        </div>
                                                        {/*card body*/}
                                                        <div className={`w-[calc(100%-120px)] `}>
                                                            <div className={`flex flex-col h-full`}>
                                                                <div className={`mb-auto`}>
                                                                    <div className={`flex `}>
                                                                        <div
                                                                            className={`flex flex-col w-full  gap-2`}>
                                                                            <h3>
                                                                                <a
                                                                                    target="_self"
                                                                                    href={`/job/detail/`}>
                                                                                    <p className={`font-[600] hover:text-green_default text-[16px] line-clamp-2  text-[#212f3f] leading-6 cursor-pointer`}>
                                                                                        Java Dev (3 Years+), Signing
                                                                                        Bonus Hấp Dẫn, Rất Ổn Định Lâu
                                                                                        Dài</p>
                                                                                </a>
                                                                            </h3>
                                                                            <div className={``}>
                                                                                <a href={`/company/`}
                                                                                   target="_blank">
                                                                                    <p className={`break-words max-w-full  text-[14px] opacity-70 hover:underline truncate`}>Công
                                                                                        ty cổ phần Công nghệ thông tin
                                                                                        Phú Minh (Phú Minh Teck)</p>
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                        {/*<div className={`w-1/4 flex justify-end pr-2`}>*/}
                                                                        {/*    <p className={`text-green_default font-bold`}>10 - 15 triệu</p>*/}
                                                                        {/*</div>*/}
                                                                    </div>
                                                                </div>
                                                                <div className={`w-full flex  pr-2 mt-4 `}>
                                                                    <p className={`text-green_default font-bold`}>10 -
                                                                        15
                                                                        triệu</p>
                                                                    <div
                                                                        className={`flex-1 flex justify-end items-center`}>
                                                                        <div
                                                                            className={`rounded-full flex p-1 border group-hover:opacity-100 opacity-0 transition-opacity duration-300  bg-[#e3faed] items-center  text-[#15bf61]`}>
                                                                            <p className={`text-[12px]`}>Xem</p>
                                                                            <MdKeyboardDoubleArrowRight/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={`mt-auto flex items-end justify-between py-2 w-full`}>
                                                                    <div
                                                                        className={`flex gap-4 overflow-hidden w-full`}>
                                                                        <div
                                                                            className={`rounded-[5px] overflow-x-hidden max-w-[50%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                                            <p className={`text-black text-[14px] truncate `}>Hà
                                                                                Nội: Cầu Giấy</p>
                                                                        </div>
                                                                        <div
                                                                            className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                                            <p className={`text-black text-[14px] truncate `}>{`3 năm`}</p>
                                                                        </div>

                                                                    </div>
                                                                    {/*<div*/}
                                                                    {/*    className={`bg-white p-1 rounded-full hover:bg-green-300 `}>*/}
                                                                    {/*    <FaRegHeart color={"green"}/>*/}
                                                                    {/*</div>*/}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{clipPath: "polygon(0 0, 0 100%, 100% 50%)"}} className={`absolute top-1/2 h-4 transform w-[6px] left-full bg-green_default  -translate-y-1/2`}>

                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        {/*right*/}
                                        <div className={`flex-1 relative  min-h-[1px]  flex items-start overflow-visible pl-2`}>
                                            <div
                                                className={`w-full block sticky top-[90px] h-fit rounded-md  bg-white p-6`}>
                                                <div className={`flex items-start`}>
                                                    <p className={`font-semibold text-[20px] line-clamp-2`}>Developer
                                                        Java Fullstack Developer Java Fullstack Developer Java Fullstack
                                                        Developer Java Fullstack Developer Java Fullstack Developer Java
                                                        Fullstack</p>
                                                    <div className={`flex-1 flex justify-end`}>
                                                        <IoCloseCircleSharp onClick={handleExitQuickView} className={`cursor-pointer`} size={28}
                                                                            fill={"#00b14f"}/>
                                                    </div>
                                                </div>
                                                <div className={`flex gap-3 mt-4 border-b pb-4`}>
                                                    <div
                                                        className={`rounded-[4px] overflow-x-hidden max-w-[50%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                        <p className={`text-text_color text-[13px] truncate font-[500]`}>15-60
                                                            trieu</p>
                                                    </div>
                                                    <div
                                                        className={`rounded-[4px] overflow-x-hidden max-w-[50%] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                        <p className={`text-text_color text-[13px] truncate font-[500]`}>Hà
                                                            Nội: Cầu Giấy</p>
                                                    </div>
                                                    <div
                                                        className={`rounded-[5px] bg-[#E9EAEC] py-1 px-2 flex items-center justify-center`}>
                                                        <p className={`text-text_color text-[13px] truncate font-[500]`}>{`3 năm`}</p>
                                                    </div>
                                                    <div
                                                        className={`flex flex-1 justify-end items-center cursor-pointer`}>
                                                        <p className={`text-green_default hover:underline font-semibold`}>Xem
                                                            chi tiết</p>
                                                        <MdKeyboardDoubleArrowRight className={`cursor-pointer`}
                                                                                    size={28}
                                                                                    fill={"#00b14f"}/>
                                                    </div>
                                                </div>
                                                <div className={`h-[438px] bg-white overflow-y-auto pr-2 relative`}>
                                                    <div className={`flex flex-col py-4 gap-[20px] h-fit `}>
                                                        <div className={`flex flex-col gap-[16px] `}>
                                                            {/*description*/}
                                                            <div className={`job_description_item `}>
                                                                <h3 className={'tracking-normal'}>Mô tả công việc</h3>
                                                                <pre>
                                                                    - Tham gia phát triển dự án phần mềm
- Các dự án thuộc domain: ngân hàng, tài chính, thị trường Nhật, thị trường nói tiếng Anh, ...
- Thực hiện thiết kế, coding và unit test cho dự án.
- Tham gia việc review code, hỗ trợ các thành viên trong nhóm.
- Thực hiện công việc theo sự phân công của Trưởng nhóm/Quản lý dự án, phối hợp giữa các nhóm để phát triển dự án.
                                                                </pre>
                                                            </div>
                                                            {/*requirement*/}
                                                            <div className={`job_description_item `}>
                                                                <h3 className={'tracking-normal'}>Yêu cầu ứng viên</h3>
                                                                <pre className={`break-words`}>
                                                                    - Tham gia phát triển dự án phần mềm
- Các dự án thuộc domain: ngân hàng, tài chính, thị trường Nhật, thị trường nói tiếng Anh, ...
- Thực hiện thiết kế, coding và unit test cho dự án.
- Tham gia việc review code, hỗ trợ các thành viên trong nhóm.
- Thực hiện công việc theo sự phân công của Trưởng nhóm/Quản lý dự án, phối hợp giữa các nhóm để phát triển dự án.
                                                                </pre>
                                                            </div>
                                                            {/*benefit*/}
                                                            <div className={`job_description_item `}>
                                                                <h3 className={'tracking-normal'} >Quyền lợi</h3>
                                                                <pre className={`break-words whitespace-pre-wrap`}>
                                                                    - Tham gia phát triển dự án phần mềm
- Các dự án thuộc domain: ngân hàng, tài chính, thị trường Nhật, thị trường nói tiếng Anh, ...
- Thực hiện thiết kế, coding và unit test cho dự án.
- Tham gia việc review code, hỗ trợ các thành viên trong nhóm.
- Thực hiện công việc theo sự phân công của Trưởng nhóm/Quản lý dự án, phối hợp giữa các nhóm để phát triển dự án.
                                                                </pre>
                                                            </div>
                                                            <div className={`job_description_item `}>
                                                                <h3 className={'tracking-normal'}>Địa điểm</h3>
                                                                <pre className={`break-words`}>

                                                                </pre>
                                                            </div>
                                                            <div className={`job_description_item `}>
                                                            <p>Hạn nộp hồ sơ: <span
                                                                    className={`font-semibold`}>31/12/2024</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    <div className={`w-full flex`}>
                                        <div className={`w-[70%] pr-4 relative`}>
                                            <div className={`py-2 flex flex-col gap-3`}>
                                                <div className={`flex w-full flex-col bg-white px-6 py-6 rounded-md`}>
                                                    <div>
                                                        {Array.from(Array(20).keys()).map((value, index) => (
                                                            <JobWidthCard
                                                                onQuickViewClick={handleQuickViewClick}
                                                                key={index}
                                                                companyName={"CÔNG TY CỔ PHẦN TECHBANK SOFTWARE"}
                                                                logo={'https://cdn-new.topcv.vn/unsafe/80x/https://static.topcv.vn/company_logos/fWr7TOqpMgRhSa90QEbEIufIFvGvpWXH_1727063635____77bbd23a77e8baeaa97c13b795780888.png'}
                                                                jobId={1}
                                                                companyId={'company_1234'}
                                                                experience={2}
                                                                expireDate={new Date(2024, 12, 30)}
                                                                location={'Hồ Chí Minh'}
                                                                title={'Mid/Sr Fullstack Developer (NodeJS/ReactJS/Java Script) '}
                                                                minSalary={10}
                                                                maxSalary={15}
                                                                quickView={true}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className={`w-full flex justify-center items-center`}>
                                                        <Pagination
                                                            //onChange={onPageNumberChange}
                                                            current={1}
                                                            pageSize={DefaultPageSize}
                                                            showSizeChanger={false}
                                                            total={100}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`w-[30%] relative min-h-[1px] py-2 flex items-start overflow-visible pl-2`}>
                                            <div className={`block sticky top-[90px] w-full h-fit`}>
                                                <div
                                                    className={`w-full bg-white rounded-xl border border-green_default p-5`}>
                                                    <div className={`flex flex-col gap-4 w-full p-4`}>
                                                        <div className={`w-full flex gap-4 items-center justify-start`}>
                                                            <BsFillQuestionCircleFill size={24} fill={"green"}/>
                                                            <p className={`font-bold text-[16px]`}>Bí kíp tìm việc an
                                                                toàn</p>
                                                        </div>
                                                        <div>
                                                            <p className={`text-[14px] opacity-70`}>Dưới đây là những
                                                                dấu hiệu
                                                                của
                                                                các tổ chức, cá
                                                                nhân
                                                                tuyển dụng không minh bạch:
                                                            </p>
                                                        </div>
                                                        <div className={`flex flex-col`}>
                                                            <p className={`text-green_default font-bold`}>1. Dấu hiệu
                                                                phổ
                                                                biến:</p>
                                                            <Carousel
                                                                plugins={[
                                                                    Autoplay({
                                                                        delay: 3500
                                                                    }),
                                                                ]}
                                                                opts={{
                                                                    loop: true,
                                                                }}
                                                                className="w-full max-w-xs">
                                                                <CarouselContent>
                                                                    {warningItem.map((item, index) => (
                                                                        <CarouselItem key={index}>
                                                                            <div className="p-1">
                                                                                <Card>
                                                                                    <CardContent
                                                                                        className="aspect-square relative items-center justify-center p-6">
                                                                                        <img
                                                                                            className={`w-[183px] h-[174px]`}
                                                                                            src={item.img}
                                                                                            alt={""}/>
                                                                                        <div
                                                                                            className={`flex items-center justify-center absolute bottom-0 w-[80%]`}>
                                                                                            <p className={`text-center text-[12px] opacity-70`}>{item.note}</p>
                                                                                        </div>
                                                                                    </CardContent>
                                                                                </Card>
                                                                            </div>
                                                                        </CarouselItem>
                                                                    ))}
                                                                </CarouselContent>
                                                                <CarouselPrevious/>
                                                                <CarouselNext/>
                                                            </Carousel>
                                                        </div>
                                                        <div className={`flex flex-col gap-3 *:text-14`}>
                                                            <p className={`text-green_default font-bold !text-16`}>2.
                                                                Cần làm gì
                                                                khi gặp việc
                                                                làm, công ty
                                                                không
                                                                minh bạch:</p>
                                                            <p>- Kiểm tra thông tin về công ty, việc làm trước khi ứng
                                                                tuyển</p>
                                                            <p>- Báo cáo tin tuyển dụng với JobFinder thông qua
                                                                nút <span
                                                                    className={`text-green_default text-14`}>Báo cáo tin tuyển dụng</span> để
                                                                được hỗ trợ và
                                                                giúp
                                                                các ứng viên khác tránh được rủi ro</p>
                                                            <p>- Hoặc liên hệ với JobFinder thông qua kênh hỗ trợ ứng
                                                                viên của
                                                                JobFinder:<br/>
                                                                Email: <span
                                                                    className={`text-green_default`}>hotro@jobfinder.vn</span><br/>
                                                                Hotline: <span
                                                                    className={`text-green_default`}>(024) 6680 5588</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearch;