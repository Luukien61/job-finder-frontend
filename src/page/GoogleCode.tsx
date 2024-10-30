import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {exchangeToken} from "../service/outboundService.ts";
export type UserInfoResponse={
    name: string,
    email: string,
    id: string,
}

const GoogleCode = () => {
    const search: URLSearchParams = new URLSearchParams(useLocation().search);
    const [useInfo,setUseInfo] = useState<UserInfoResponse>()
    useEffect(() => {
        const googleCode = search.get("code")
        if (googleCode){
            const exchangeAndNavigate = async () => {
                const userInfo = await exchangeToken('GOOGLE', googleCode);
                if(userInfo) setUseInfo(userInfo)
            };
            exchangeAndNavigate();
        }
    }, [])
    return (
        <div>

        </div>
    );
};

export default GoogleCode;