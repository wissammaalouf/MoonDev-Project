'use client';

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import './Styles.css';

interface MyInputProps {
    text: string;
    inputValue: string;
    setInputValue: Dispatch<SetStateAction<string>>;
    type: string;
    disabled?: boolean;
}

const MyInput: React.FC<MyInputProps> = ({ text, inputValue, setInputValue, type, disabled }) => {
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
            listItems.push(
                <span key={i} className="label-char" style={getLabelCharStyle(i)}>
                    {items[i]}
                </span>
            );
        }
        return listItems;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setIsNotEmpty(value !== "");
    };

    return (
        <div className="mt-6 relative">
            <input
                required
                name={text}
                type={type}
                value={inputValue || ''}
                onChange={handleChange}
                disabled={disabled}
                className={`peer text-base text-gray-700 dark:text-gray-300 px-2 py-2 block w-full border-b-2 border-gray-500 bg-transparent focus:outline-none ${isNotEmpty ? 'not-empty' : ''}`}
            />
            <span className="bar"></span>
            <label className="label absolute pointer-events-none left-1 top-2.5 flex text-gray-500 text-lg font-normal">
                {generateList(text)}
            </label>
        </div>
    );
};

export default MyInput;
