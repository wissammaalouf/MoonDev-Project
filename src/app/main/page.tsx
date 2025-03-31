'use client';

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import DevPage from '../developer-page/page';
import LogOutButton from '@/app/items/button/LogButton';
import EvalPage from '../evaluator-page/page';
import User from '@/models/User';

const Main = () => {
    const [userType, setUserType] = useState<string | null>(null);
    const [user, setUser] = useState<User>(new User);
    const router = useRouter();

    useEffect(() => {
        const userString = localStorage.getItem('user');

        if (userString) {
            const parsedUser = JSON.parse(userString);

            const tempUser = new User(
                parsedUser.id,
                parsedUser.name,
                parsedUser.phone_number,
                parsedUser.location,
                parsedUser.email,
                parsedUser.password,
                parsedUser.role,
                parsedUser.hobbies,
                parsedUser.profile_pic_url,
                
                parsedUser.project_name,
                parsedUser.file_url,
                parsedUser.is_accepted,
                parsedUser.reviewed_by,
                parsedUser.feedback
            );
            setUser(tempUser);
            setUserType(parsedUser.role);
        } else {
            console.error("No user found in localStorage");
        }
    }, []);

    return (
        <div  className="bg-white dark:bg-gray-900">
            <div className="bg-gray-200 dark:bg-gray-500 pb-3">
                {(!userType || (userType !== 'developer' && userType !== 'evaluator')) &&
                    <div className='flex justify-end'>
                        <LogOutButton
                            text='Log In'
                            handleOnClick={() => {
                                // localStorage.clear()
                                router.push('./login');
                            }}
                        />
                    </div>
                }
                {(userType === 'developer') &&
                    <div className='flex justify-end'>
                        <LogOutButton
                            text='Log Out'
                            handleOnClick={() => {
                                localStorage.clear()
                                router.push('./login');
                            }}
                        />
                    </div>
                }
                {(userType === 'evaluator') && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex">
                            <div className='mt-2 ml-3'>
                                <img
                                    src={user.profile_pic_url}
                                    alt="Profile Picture"
                                    className="w-15 h-15 object-cover rounded-full"
                                />
                            </div>
                            <div className='mt-2 ml-3'>
                                <h1>{user.name}</h1>
                                <p>{user.email}</p>
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <LogOutButton
                                text='Log Out'
                                handleOnClick={() => {
                                    localStorage.clear()
                                    router.push('./login');
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
                {(!userType || (userType !== 'developer' && userType !== 'evaluator')) &&
                    <div className="mt-10 mb-10 p-8 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 w-[80%]">
                        <h1 className="text-2xl font-semibold mb-4">You have no access as Guest... <br />Please sign in first...</h1>
                    </div>
                }
                {userType === 'developer' && (
                        <DevPage user={user} />
                    )}
                {userType === 'evaluator' && (
                        <EvalPage user={user} />
                )}
            </div>
        </div>
    );
}

export default Main;