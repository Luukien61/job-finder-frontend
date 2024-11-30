import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "../page/HomePage.tsx";
import Signup from "../page/SignUp.tsx";
import LogIn from "../page/LogIn.tsx";
import Message from "@/page/Message.tsx";
import JobDetail from "@/page/JobDetail.tsx";
import Test from "@/page/Test.tsx";
import App from "@/page/App.tsx";
import UserProfile, {AppliedJobList, SavedJobList, UserProfileInfo} from "@/page/UserProfile.tsx";
import GoogleCode from "@/page/GoogleCode.tsx";
import CompleteProfile from "@/page/CompleteProfile.tsx";
import Employer from "@/page/employer/Employer.tsx";
import EmployerSignup from "@/page/employer/EmployerSignup.tsx";
import EmployerEntry from "@/page/employer/EmployerEntry.tsx";
import EmployerLogin from "@/page/employer/EmployerLogin.tsx";
import EmployerHome, {HomeContent} from "@/page/employer/EmployerHome.tsx";
import AddJob from "@/page/employer/AddJob.tsx";
import JobSearch from "@/page/JobSearch.tsx";
import Admin from "@/page/Admin.tsx";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/" element={<App/>}>
                <Route path="/" element={<HomePage/>}/>
                <Route path={'/job/detail/:id'} element={<JobDetail/>}/>
                <Route path={'/search'} element={<JobSearch/>}/>
            </Route>
            <Route path={'/login'} element={<LogIn/>}/>
            <Route path={"/login/oauth2/code/google"} element={<GoogleCode/>}/>
            <Route path={'/signup'} element={<Signup/>}/>
            <Route path={'/message/:id'} element={<Message/>}/>
            <Route path={'/me/:id'} element={<UserProfile/>}>
                <Route index={true} element={<UserProfileInfo/>}/>
                <Route path={"saved"} element={<SavedJobList/>}/>
                <Route path={"applied"} element={<AppliedJobList/>}/>
            </Route>
            <Route path={'/test'} element={<Test/>}/>
            <Route path={'/profile/complete'} element={<CompleteProfile/>}/>
            <Route path={'/employer'} element={<Employer/>}>
                <Route path={''} element={<EmployerHome/>}>
                    <Route index={true} element={<HomeContent/>}/>
                    <Route path={'job/new'} element={<AddJob/>}/>
                </Route>
                <Route path={'entry'} element={<EmployerEntry/>}>
                    <Route path={'signup'} element={<EmployerSignup/>}/>
                    <Route path={'login'} element={<EmployerLogin/>}/>
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRouter;