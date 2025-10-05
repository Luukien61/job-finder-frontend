import React from 'react';
import {Outlet} from "react-router-dom";

const EmployerEntry = () => {
    return (
        <div className={`flex rounded items-start`}>
            <Outlet/>
            <div className={`w-fit`}>
                <img className={`w-full h-screen object-contain`}
                     src={`/public/job-finder-employer.jpg`}
                     alt={`bg-cv`}/>
            </div>
        </div>
    );
};

export default EmployerEntry;