import React from 'react';
import {ToastContainer} from "react-toastify";
import {Outlet} from "react-router-dom";

const Employer = () => {
    return (
        <div className={`w-full`}>
            <Outlet/>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                pauseOnHover={true}
            />
        </div>
    );
};

export default Employer;