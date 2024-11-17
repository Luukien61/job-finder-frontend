import {zalo} from "@/url/Url.ts";

export const AppInfo = {
    appName: "Job Finder",
    description: "JobFinder là công ty công nghệ nhân sự (HR Tech) hàng đầu Việt Nam. Với năng lực lõi là công nghệ, đặc biệt là trí tuệ nhân tạo (AI), sứ mệnh của JobFinder đặt ra cho mình là thay đổi thị trường tuyển dụng - nhân sự ngày một hiệu quả hơn.",
}

export const GoogleClientId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const GoogleClientSecret: string = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
export const provinces: { [key: number]: string } = {
    0: "Toàn quốc",
    1: "Hà Nội",
    2: "TP Hồ Chí Minh",
    3: "Đà Nẵng",
    4: "Cần Thơ",
    5: "Bà Rịa - Vũng Tàu",
    6: "Khánh Hòa",
    7: "Đồng Nai",
    8: "Bình Dương",
    9: "Hải Phòng",
    10: "Long An",
    11: "Quảng Ninh",
    12: "Đồng Tháp",
    13: "Tiền Giang",
    14: "An Giang",
    15: "Bình Định",
    16: "Phú Yên",
    17: "Bình Phước",
    18: "Hậu Giang",
    19: "Vĩnh Long",
    20: "Thái Nguyên",
    21: "Bắc Giang",
    22: "Nghệ An",
    23: "Thanh Hóa",
    24: "Thừa Thiên Huế",
    25: "Kiên Giang",
    26: "Bến Tre",
    27: "Bắc Ninh",
    28: "Lâm Đồng",
    29: "Bạc Liêu",
    30: "Quảng Nam",
    31: "Quảng Ngãi",
    32: "Cà Mau",
    33: "Ninh Bình",
    34: "Nam Định",
    35: "Hà Nam",
    36: "Thái Bình",
    37: "Vĩnh Phúc",
    38: "Tây Ninh",
    39: "Phú Thọ",
    40: "Hòa Bình",
    41: "Hà Tĩnh",
    42: "Quảng Trị",
    43: "Gia Lai",
    44: "Đắk Lắk",
    45: "Đắk Nông",
    46: "Kon Tum",
    47: "Điện Biên",
    48: "Lào Cai",
    49: "Yên Bái",
    50: "Sơn La",
    51: "Lạng Sơn",
    52: "Cao Bằng",
    53: "Hà Giang",
    54: "Bắc Kạn",
    55: "Tuyên Quang",
    56: "Lai Châu",
    57: "Ninh Thuận",
    58: "Quảng Bình",
    59: "Trà Vinh",
    60: "Sóc Trăng",
    61: "Bình Thuận",
    62: "Hưng Yên",
    63: "Nam Định",
};
export const filters = [
    "Location",
    "Salary",
    "Experience",
    "Field"
]
export const salaries = [
    [5], [5,10], [10,20], [20]
]
export const experiences =[
    [1],[1,3],[3,5],[5,10], [10]
]
export const fields = [
    "Điện/Điện Tử/Điện Lạnh",
    "IT Phần Mềm",
    "IT Phần Cứng",
    "Thiết Kế",
    "Marketing",
    "Truyền Thông/PR/Quảng Cáo",
    "Kinh Doanh/Bán Hàng",
    "Nhân Sự",
    "Hành Chính/Văn Phòng",
    "Lao Động Phổ Thông",
    "Bán Sỉ/Bán Lẻ/Cửa Hàng",
    "Đấu Thầu/Dự Án",
    "Xuất Nhập Khẩu",
    "Bảo Hiểm",
    "Bất Động Sản",
    "Nhà Hàng/Khách Sạn",
    "Cơ Khí/Ô Tô/Tự Động Hóa",
    "Spa/Làm Đẹp",
    "Y Tế",
    "Mỏ/Địa Chất",
    "An Toàn Lao Động",
    "Biên Phiên Dịch",
    "Viễn Thông",
    "Tài Chính/Ngân Hàng",
    "Du Lịch",
    "Giáo Dục/Đào Tạo",
    "In Ấn/Chế Bản",
    "Kế Toán/Kiểm Toán",
    "Kiến Trúc/Nội Thất",
    "Môi Trường",
    "Sản Xuất/Lắp Ráp/Chế Biến",
    "Nông/Lâm/Ngư Nghiệp",
    "Luật/Pháp Chế",
    "Kho Vận",
    "Xây Dựng",
    "Dệt May/Da Giày",
    "Chăm Sóc Khách Hàng",
    "Truyền Hình/Báo Chí",
    "Thu Mua",
    "Quản Lý",
    "Hoá Sinh",
    "Vận Hành/Bảo Trì/Bảo Dưỡng",
    "Khoa Học/Kỹ Thuật",
    "Dược Phẩm/Mỹ Phẩm",
    "Sáng Tạo/Nghệ Thuật"
];
export const backEndPage: string = import.meta.env.VITE_BACKEND_URL

export const AppLogo = '/public/job-finder.jpg'
type item = {
    name: string,
    link: string
}
type footerProps = {
    title: string,
    child: item[]
}
export const footerContent: footerProps[] = [
    {
        title: "Liên hệ",
        child: [
            {
                name: "0386888888",
                link: "tel:+842345678"
            },
            {
                name: "jobfinder@gmail.com",
                link: "mailto:kienluu61@gmail.com"
            },
            {
                name: "Zalo",
                link: `${zalo}`
            }
        ]
    },
    {
        title: "Theo dõi",
        child: [
            {
                name: "Facebook",
                link: "https://www.facebook.com"
            },
            {
                name: "Youtube",
                link: "https://www.youtube.com"
            },
            {
                name: "Tiktok",
                link: "https://www.tiktok.com"
            }
        ]
    },
    {
        title: "Về chúng tôi ",
        child: [
            {
                name: "Chính sách bảo mật",
                link: "/"
            },
            {
                name: "Quyền riêng tư",
                link: "/"
            },
            {
                name: "",
                link: "/"
            },
            {
                name: "",
                link: "/"
            }
        ]
    }
]




