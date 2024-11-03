import React from 'react';
import Header from "@/component/Header.tsx";
import {Outlet} from "react-router-dom";

const App = () => {
    return (
        <div className={'bg-default'}>
            <Header/>
            <Outlet/>
        </div>
    );
};

export default App;