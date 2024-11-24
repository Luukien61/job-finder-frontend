import React, { useRef } from 'react';

const ScrollFromBottom = () => {
    const targetRef = useRef(null);

    const scrollToElement = () => {


        // if (myRef.current) {
        //     const elementTop = myRef.current.getBoundingClientRect().top;
        //     const viewportHeight = window.innerHeight;
        //     const scrollToPosition = window.pageYOffset + elementTop - (viewportHeight - 100);
        //     window.scrollTo({ top: scrollToPosition, behavior: "smooth" });
        // }
        if (targetRef.current) {
            const windowHeight = window.innerHeight; // Chiều cao của viewport
            const elementRect = targetRef.current.getBoundingClientRect();
            const elementTop = elementRect.top; // Khoảng cách từ element đến top của viewport
            const offset = 100; // Khoảng cách muốn giữ từ bottom

            // Tính vị trí scroll để element cách bottom offset px
            const scrollPosition = window.pageYOffset + elementTop - (windowHeight - elementRect.height - offset);

            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-[200vh] bg-gray-100 relative">
            {/* Button fixed ở góc màn hình */}
            <button
                onClick={scrollToElement}
                className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Scroll to Element
            </button>

            {/* Content phía trên */}
            <div className="h-screen bg-blue-100 flex items-center justify-center">
                <h2 className="text-2xl">Scroll down to see more</h2>
            </div>

            {/* Element đích */}
            <div
                ref={targetRef}
                className="mx-auto w-full max-w-md p-6 bg-white shadow-lg rounded-lg"
            >
                <h3 className="text-xl font-bold mb-4">Target Element</h3>
                <p className="text-gray-600">
                    This element will be positioned 100px from the bottom of the viewport
                    when you click the scroll button.
                </p>
            </div>

            {/* Thêm space phía dưới */}
            <div className="h-screen bg-green-100" />
        </div>
    );
};

export default ScrollFromBottom;