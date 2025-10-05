import React, {useEffect} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {loginWithGoogle, signupWithGoogle} from "@/axios/Request.ts";
import {toast, ToastContainer} from "react-toastify";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'react-toastify/dist/ReactToastify.css';
import {UserCreationState} from "@/zustand/AppState.ts";
import {UserSignupResponse} from "@/page/SignUp.tsx";

export type UserInfoResponse={
    name: string,
    email: string,
    id: string,
}
export const googleExchange = () => {
    const clientId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri: string = import.meta.env.VITE_GOOGLE_REDIRECT_URL
    const scope: string = import.meta.env.VITE_GOOGLE_SCOPE
    window.open(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`, '_self')
}
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export interface UserResponse {
    "id": string,
    "name": string,
    "avatar": string,
    "email": string,
    "role": "EMPLOYEE" | "EMPLOYER" | "ADMIN",
}
const GoogleCode = () => {
    const [search]=useSearchParams()
    const navigate = useNavigate()
    const code = search.get("code");
    const {setUser} = UserCreationState()

    const handleCodeExchange = async (code: string) => {
        const type = localStorage.getItem('action')
        try {
            if (code) {
                let rawUserInfo: UserResponse | null = null
                if (type == 'signup') {
                    rawUserInfo = await signupWithGoogle(code)
                    if (rawUserInfo) {
                        localStorage.setItem('user', JSON.stringify(rawUserInfo))
                        const userResponse : UserSignupResponse = {
                            id: rawUserInfo.id,
                            email: rawUserInfo.email,
                            avatar: rawUserInfo.avatar,
                            name: rawUserInfo.name,
                        }
                        setUser(userResponse)
                        await delay(500)
                        navigate('/profile/complete')
                    }
                }
                if (type == 'login') {
                    rawUserInfo = await loginWithGoogle(code)
                    if (rawUserInfo) {
                        localStorage.setItem('user', JSON.stringify(rawUserInfo))
                        navigate('/')
                    }
                }
            }
        } catch (e: any) {
            toast.error(e.response.data)
            await delay(2000)
            navigate('/signup')
        }
    }
    useEffect(() => {
        handleCodeExchange(code)
    }, []);
    return (
        <div>
            <div className={`w-10 h-10`}>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick
                    pauseOnHover={true}
                />
            </div>
        </div>
    );
};

export default GoogleCode;