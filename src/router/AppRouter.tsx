import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "../page/HomePage.tsx";
import Signup from "../page/SignUp.tsx";
import LogIn from "../page/LogIn.tsx";
import Message from "@/page/Message.tsx";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path={'/login'} element={<LogIn/>}/>
            <Route path={'/signup'} element={<Signup/>}/>
            <Route path={'/message'} element={<Message/>}/>
        </Routes>
    );
};

export default AppRouter;