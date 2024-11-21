import React, {useState, useRef, useEffect} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';

const ExpandableCard = ({children}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [contentHeight, setContentHeight] = useState(200);
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            const actualHeight = contentRef.current.scrollHeight;
            setContentHeight(actualHeight);
            setIsOverflowing(actualHeight > 200);
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
                        ? (isExpanded ? `${contentHeight}px` : '200px')
                        : 'auto'
                }}
                className={`overflow-hidden transition-all duration-500 ease-in-out`}
            >
                {children}
            </div>

            {/*/!* Gradient overlay for collapsed state *!/*/}
            {isOverflowing && !isExpanded && (
                <div
                    className=" absolute bottom-12  left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"
                />
            )}

            {/* Expand/Collapse Button - Only show if content overflows */}
            {isOverflowing && (
                <div className={`w-full flex `}>
                    <button
                        onClick={toggleExpand}
                        className="outline-none h-12 w-fit py-2 flex items-center justify-center text-green_default transition-colors duration-200"
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