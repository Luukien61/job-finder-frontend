import React, {useEffect, useState} from 'react';
import {getPrices, priceCheckOut} from "@/axios/Request.ts";
import {Price, priceless, UltimatePlanId} from "@/info/ApplicationType.ts";
import {moveToMiddle} from "@/service/ApplicationService.ts";


const CustomPriceTable = () => {
    const [prices, setPrices] = useState<Price[]>([]);

    useEffect(() => {
        const fetchPrices = async () => {
            const response: Price[] = await getPrices();
            const filter = response.filter((price) => priceless.includes(price.product));
            const sortPrices = moveToMiddle(UltimatePlanId,filter)
            setPrices(sortPrices);
        };
        fetchPrices();
    }, []);


    return (
        <div className={`w-full `}>
            <div className={`p-10 rounded-lg bg-white h-screen flex flex-col gap-10`}>
                <div className={`w-full flex justify-center `}>
                    <p className={`font-extrabold text-[48px]`}>Chọn hạng thành viên</p>
                </div>
                <div className={`w-full flex justify-center items-center`}>
                    <div className={`flex gap-6 items-center`}>
                        {
                            prices?.length > 0 && prices.map((price, index) => (
                                <div key={index}>
                                    <PriceCard {...price}/>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
        ;
};

export default CustomPriceTable;

const PriceCard = ({product, currency, interval, id, unit_amount}) => {
    // Hàm format tiền tệ
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
    // Chuyển đổi interval sang tiếng Việt
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
            className={`bg-white border ${product == UltimatePlanId ? 'pt-0 border border-green_default' : 'pt-4'} cursor-pointer group hover:scale-110 transition-all hover:border-green_default duration-300 hover:border-2 relative shadow-lg rounded-lg p-10 pt-0 w-[310px] max-w-sm mx-auto`}>
            <div className={`w-full flex justify-center`}>
                {
                    product == UltimatePlanId && (
                        <div className={`bg-green-500 rounded-b-xl p-3`}>
                            <p className={`text-white font-bold`}>Phổ biến nhất</p>
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
                            <li><span className={'font-bold'}>Tối đa</span> hiển thị ưu tiên khi tìm kiếm</li>
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

            <button
                onClick={() => handleCheckout(id)}
                className={`w-full ${product == UltimatePlanId ? 'bg-[#343A46FF] hover:bg-[#26262a] hover:scale-105 text-white' : ' text-[#272C35]'} font-bold hover:bg-[#272C35] border-solid border-2 border-[#272C35] py-2 rounded-md mt-4 hover:text-white  transition`}>
                Đăng Ký Ngay
            </button>
        </div>
    );
};

