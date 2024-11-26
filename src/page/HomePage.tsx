import React from 'react';
import Content from "../component/Content.tsx";
import {useGoogleOneTap} from "../hook/useGoogleLogIn.tsx";


const HomePage = () => {
    //useGoogleOneTap()
    return (
        <div className={'bg-default'}>
            <Content/>
        </div>
    );
};

export default HomePage;