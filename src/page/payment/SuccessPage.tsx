import {useEffect} from "react";
import {Spin} from "antd";
import {verifySession} from "@/axios/Request.ts";

const SuccessPage = () => {
    const handleVerifySession = async (sessionId, companyId) => {
        try {
            const plan = await verifySession({sessionId: sessionId, companyId: companyId})
            if(plan){
                window.location.href='/employer/profile'
            }
        } catch (e) {
            console.log(e)
        }

    }
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get("session_id");
        const company = JSON.parse(localStorage.getItem("company"));
        if (company && company.id && sessionId) {
            const companyId = company.id
            handleVerifySession(sessionId, companyId)
        }

    }, []);

    return <div>
        <Spin fullscreen={true}/>
    </div>;
};

export default SuccessPage;
