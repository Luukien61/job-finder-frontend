import React from "react";

const PulsatingSphere = ({children}) => {
    return (
        <div className="relative flex items-center justify-start">
            {/* Sphere */}
            <div className="aspect-square p-2  flex items-center justify-center rounded-full z-10">
                {children}
            </div>
            {/* Pulsating Effect */}
            <div
                className="absolute w-14 -left-[10px] aspect-square  bg-[#DCEEE9] rounded-full animate-pulsate opacity-0"></div>
        </div>
    );
};
export default PulsatingSphere;