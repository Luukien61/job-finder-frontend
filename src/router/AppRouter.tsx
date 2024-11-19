import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "../page/HomePage.tsx";
import Signup from "../page/SignUp.tsx";
import LogIn from "../page/LogIn.tsx";
import Message from "@/page/Message.tsx";
import JobDetail from "@/page/JobDetail.tsx";
import Test from "@/page/Test.tsx";
import App from "@/page/App.tsx";
import UserProfile, {Account, AppliedJobList, SavedJobList, UserProfileInfo} from "@/page/UserProfile.tsx";
import GoogleCode from "@/page/GoogleCode.tsx";
import CompleteProfile from "@/page/CompleteProfile.tsx";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<App/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path={'/job/detail/:id'} element={<JobDetail/>}/>
            </Route>
            <Route path={'/login'} element={<LogIn/>}/>
            <Route path={"/login/oauth2/code/google"} element={<GoogleCode/>}/>
            <Route path={'/signup'} element={<Signup/>}/>
            <Route path={'/message/:id'} element={<Message/>}/>
            <Route path={'/me/:id'} element={<UserProfile/>}>
                <Route index={true} element={<UserProfileInfo/>}/>
                <Route path={"saved"} element={<SavedJobList/>}/>
                <Route path={"applied"} element={<AppliedJobList/>}/>
                <Route path={"account"} element={<Account/>}/>
            </Route>
            <Route path={'/test'} element={<Test/>}/>
            <Route path={'/profile/complete'} element={<CompleteProfile/>}/>
        </Routes>
    );
};

export default AppRouter;