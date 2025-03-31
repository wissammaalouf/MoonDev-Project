"use client";

import User from "@/models/User";

interface EvalDevViewProps {
    user: User;
    search: string;
}

const EvalDevView: React.FC<EvalDevViewProps> = ({ user, search }) => {

    return (
        <div className="p-5 pl-2 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 flex transform hover:scale-110 transition-all duration-300 cursor-pointer">
            <img
                src={user.profile_pic_url}
                alt="Profile Picture"
                className="w-15 h-15 object-cover rounded-full"
            />
            <div className="ml-5">
                <h1>{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div>
                    {user.is_accepted && <p className="text-green-500">{user.project_name}</p>}
                    {user.feedback && !user.is_accepted && <p className="text-red-500">{user.project_name}</p>}
                    {!user.feedback && <p className="text-yellow-500">{user.project_name}</p>}
                </div>
            </div>
            {search &&
            <p className="absolute bottom-1 right-2 text-sm text-gray-500 dark:text-gray-300">
                {user.role}
            </p>}
        </div>
    );
};

export default EvalDevView;
