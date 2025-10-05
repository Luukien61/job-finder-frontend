import React, { useState } from 'react';

const AutoAddDashTextarea: React.FC = (style:string) => {
    const [text, setText] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        // Thêm dấu `-` vào đầu mỗi dòng, nhưng cho phép xóa hoàn toàn
        const updatedText = value
            .split('\n') // Chia các dòng
            .map((line) => {
                // Nếu dòng trống hoặc người dùng đang xóa, giữ nguyên dòng
                if (line.trim() === '') return '';
                // Thêm `-` vào đầu dòng nếu chưa có
                return line.startsWith('-') ? line : `- ${line}`;
            })
            .join('\n'); // Ghép lại các dòng

        setText(updatedText);
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault(); // Ngăn hành động paste mặc định
        const pasteText = e.clipboardData.getData('text');
        const updatedText = pasteText
            .split('\n')
            .map((line) => (line.startsWith('-') ? line : `- ${line}`))
            .join('\n');

        setText((prev) => `${prev}\n${updatedText}`);
    };


    return (
        <textarea
            value={text}
            onPaste={handlePaste}
            onChange={handleChange}
            placeholder="Nhập nội dung..."
            className="w-full p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
};

export default AutoAddDashTextarea;
