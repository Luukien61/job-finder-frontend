import React from "react";

const PulsatingSphere = ({children, color, style}) => {
    return (
        <div className="relative flex items-center justify-start">
            {/* Sphere */}
            <div className="aspect-square p-2  flex items-center justify-center rounded-full z-10">
                {children}
            </div>
            {/* Pulsating Effect */}
            <div
                className={`absolute w-14 ${style} aspect-square  ${color} rounded-full animate-pulsate opacity-0`}></div>
        </div>
    );
};
export default PulsatingSphere;