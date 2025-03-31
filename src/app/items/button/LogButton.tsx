'use client'; 

interface LogOutButtonProps {
    text: string;
    handleOnClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}

const LogOutButton: React.FC<LogOutButtonProps> = ({ handleOnClick, text, disabled = false }: LogOutButtonProps) => {
    return (
        <>
            <button className="border-1 border-gray-300 bg-blue-400 dark:bg-white mt-4 mr-4 relative inline-block text-black uppercase text-sm font-normal px-4 py-2 rounded-lg transition-all duration-200 hover:translate-y-[-3px] hover:shadow-lg active:translate-y-[-1px] active:shadow-md focus:outline-none cursor-pointer"
            onClick={handleOnClick}
                disabled = {disabled}>
                {text}
            </button>
        </>
    );
}

export default LogOutButton;