import React, {useEffect, useRef} from 'react';
import {Input} from 'antd';

const { TextArea } = Input;

const AutoBulletTextArea = ({minHeight = 100, style = '', value, onChange, placeholder = ''}) => {
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

    return (
        <TextArea
            onKeyDown={handleKeyDown}
            ref={textAreaRef}
            style={{height: 300, minHeight: minHeight}} className={`text-16 p-4 ${style}`}
            spellCheck={false}
            value={value}
            onChange={(e)=>onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
};

export default AutoBulletTextArea;