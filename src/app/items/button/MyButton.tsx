'use client'; 

interface MyButtonProps {
    text: string;
    type: "submit" | "button" | "reset" | undefined;
    handleOnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}

const MyButton: React.FC<MyButtonProps> = ({ handleOnClick, type, text, disabled=false }: MyButtonProps) => {
    return (
        <>
            <button className="border-1 border-gray-300 bg-blue-400 dark:bg-white mt-4 relative inline-block text-black uppercase text-sm font-normal px-6 py-3 rounded-full transition-all duration-200 hover:translate-y-[-3px] hover:shadow-lg active:translate-y-[-1px] active:shadow-md focus:outline-none cursor-pointer"
                onClick={handleOnClick}
                type = {type}
                disabled = {disabled}>
                {text}
            </button>
        </>
    );
}

export default MyButton;