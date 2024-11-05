import React from 'react';
import Header from "@/component/Header.tsx";
import {Outlet} from "react-router-dom";
import Footer from "@/component/Footer.tsx";

const App = () => {
    return (
        <div className={'bg-default'}>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default App;