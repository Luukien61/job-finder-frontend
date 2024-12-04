import React, {useRef} from 'react';
import {Input} from 'antd';

const { TextArea } = Input;
interface Props {
    style?: string,
    value: string,
    onChange: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string,
    minHigh?: number,
    defaultValue?: string,
}

const AutoBulletTextArea : React.FC<Props> = ({placeholder, value,onChange, style='', minHigh=100, defaultValue}) => {
    const textAreaRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cursorPosition = e.target.selectionStart;
            const textBeforeCursor = value.substring(0, cursorPosition);
            const textAfterCursor = value.substring(cursorPosition);

            // Thêm xuống dòng và dấu - mới
            const newText = textBeforeCursor + '\n- ' + textAfterCursor;
            onChange(newText);

            // Đặt con trỏ sau dấu - mới
            setTimeout(() => {
                const newPosition = cursorPosition + 3; // \n- = 3 ký tự
                textAreaRef.current.setSelectionRange(newPosition, newPosition);
            }, 0);
        }

        // Xử lý khi người dùng xóa dấu -
        if (e.key === 'Backspace') {
            value.split('\n');
            const cursorPosition = e.target.selectionStart;

            // Tìm dòng hiện tại
            let currentLineStart = value.lastIndexOf('\n', cursorPosition - 1) + 1;
            if (currentLineStart === 0) currentLineStart = 0;

            const currentLine = value.substring(currentLineStart, cursorPosition);

            // Nếu dòng chỉ còn "- " và người dùng nhấn Backspace
            if (currentLine === '- ' && cursorPosition === currentLineStart + 2) {
                e.preventDefault();
                const textBeforeLine = value.substring(0, currentLineStart);
                const textAfterLine = value.substring(cursorPosition);
                onChange(textBeforeLine + textAfterLine);
            }
        }
    };

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

        onChange(updatedText);
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const pasteText = e.clipboardData.getData('text');
        const updatedText = pasteText
            .split('\n')
            .map((line) => (line.startsWith('-') ? line : `- ${line}`))
            .join('\n');
        if(value){
            onChange(`${value}\n${updatedText}`);
        }else {
            onChange(`${updatedText}`);
        }


    };

    return (
        <TextArea
            defaultValue={defaultValue}
            onKeyDown={handleKeyDown}
            ref={textAreaRef}
            style={{height: 300, minHeight: minHigh}} className={`text-16 p-4 ${style}`}
            spellCheck={false}
            value={value}
            onPaste={handlePaste}
            onChange={handleChange}
            placeholder={placeholder}
        />
    );
};

export default AutoBulletTextArea;