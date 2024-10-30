import React from 'react';
import Header from "../component/Header.tsx";
import Content from "../component/Content.tsx";
import {useGoogleOneTap} from "../hook/useGoogleLogIn.tsx";


const HomePage = () => {
    useGoogleOneTap()
    return (
        <div className={'bg-default'}>
            <Header/>
            <Content/>
        </div>
    );
};

export default HomePage;