import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "../page/HomePage.tsx";
import Signup from "../page/SignUp.tsx";
import LogIn from "../page/LogIn.tsx";
import Message from "@/page/Message.tsx";
import JobDetail from "@/page/JobDetail.tsx";
import Test from "@/page/Test.tsx";
import App from "@/page/App.tsx";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<App/>} >
                <Route path="/" element={<HomePage/>} />
                <Route path={'/job/detail/:id'} element={<JobDetail/>}/>
            </Route>
            <Route path={'/login'} element={<LogIn/>}/>
            <Route path={'/signup'} element={<Signup/>}/>
            <Route path={'/message'} element={<Message/>}/>

            <Route path={'/test'} element={<Test/>}/>
        </Routes>
    );
};

export default AppRouter;