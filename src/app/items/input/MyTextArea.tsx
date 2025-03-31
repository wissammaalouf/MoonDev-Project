'use client';

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import './Styles.css';

interface MyTextAreaProps {
    text: string;
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
    disabled?: boolean;
}

const MyTextArea: React.FC<MyTextAreaProps> = ({ text, inputValue, setInputValue, disabled = false }) => {
    const [isNotEmpty, setIsNotEmpty] = useState(false);

    useEffect(() => {
        setIsNotEmpty(inputValue !== "");
    }, [inputValue]);

    const getLabelCharStyle = (index: number): React.CSSProperties => {
        return {
            '--index': index.toString(),
        } as React.CSSProperties;
    };

    const generateList = (items: string) => {
        const listItems = [];
        for (let i = 0; i < items.length; i++) {
            listItems.push(<span key={i} className="label-char" style={getLabelCharStyle(i)}>{items[i]}</span>);
        }
        return listItems;
    };

    return (
        <div className="mt-7 relative">
            <textarea 
                className={`peer text-base text-gray-700 dark:text-gray-300 px-2 py-2 block w-full border-b-2 border-gray-500 bg-transparent focus:outline-none ${isNotEmpty ? 'not-empty' : ''}`}                value={inputValue}
                onChange={(e) => {setInputValue(e.target.value); setIsNotEmpty(e.target.value !== "")}}
                // placeholder={text}
                disabled={disabled}
                required
            ></textarea>
            <span className="bar"></span>
            <label className="label absolute pointer-events-none left-1 top-1 flex text-gray-500 text-lg font-normal">
                {generateList(text)}
            </label>
        </div>
    );
};

export default MyTextArea;
