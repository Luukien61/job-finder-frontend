import React from 'react';

const FlexStickyLayout = () => {
    // Tạo dữ liệu mẫu cho content
    const mainContent = Array.from({ length: 20 }, (_, i) => (
        `Section ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`
    ));

    return (
        <div className="flex min-h-screen bg-gray-100 p-4">
            {/* Container chính */}
            <div className="flex w-full gap-4 mx-auto max-w-6xl">
                {/* Main content - co giãn theo nội dung */}
                <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                    <h1 className="text-2xl font-bold mb-4">Main Content</h1>
                    <div className="space-y-4">
                        {mainContent.map((text, index) => (
                            <p key={index} className="text-gray-600">
                                {text}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Sidebar - sticky */}
                <div className="w-80">
                    <div className="sticky top-4 bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Sticky Sidebar</h2>
                        <nav className="space-y-2">
                            <a href="#" className="block text-blue-600 hover:underline">Link 1</a>
                            <a href="#" className="block text-blue-600 hover:underline">Link 2</a>
                            <a href="#" className="block text-blue-600 hover:underline">Link 3</a>
                            <a href="#" className="block text-blue-600 hover:underline">Link 4</a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlexStickyLayout;