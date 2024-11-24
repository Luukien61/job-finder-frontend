import React, {useState, useRef, useEffect} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';

const ExpandableCard = ({children,  high = 200, expandStyle='h-12 py-2', expandColor='bottom-12 from-white h-16'}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [contentHeight, setContentHeight] = useState(high);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            const actualHeight = contentRef.current.scrollHeight;
            setContentHeight(actualHeight);
            setIsOverflowing(actualHeight > high);
        }
    }, [children]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="rounded-lg   relative">
            <div
                ref={contentRef}
                style={{
                    maxHeight: isOverflowing
                        ? (isExpanded ? `${contentHeight}px` : `${high}px`)
                        : 'auto'
                }}
                className={`overflow-hidden transition-all duration-500 ease-in-out`}
            >
                {children}
            </div>

            {/*/!* Gradient overlay for collapsed state *!/*/}
            {isOverflowing && !isExpanded && (
                <div
                    className={`absolute  ${expandColor} left-0 right-0  bg-gradient-to-t  to-transparent pointer-events-none`}
                />
            )}

            {/* Expand/Collapse Button - Only show if content overflows */}
            {isOverflowing && (
                <div className={`w-full flex `}>
                    <button
                        onClick={toggleExpand}
                        className={`outline-none ${expandStyle} w-fit flex items-center justify-center text-green_default transition-colors duration-200 `}
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="mr-2" size={20}/>
                                Thu gọn
                            </>
                        ) : (
                            <>
                                <ChevronDown className="mr-2" size={20}/>
                                Xem thêm
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpandableCard;