'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import MyInput from '@/app/items/input/MyInput';
import MyButton from '@/app/items/button/MyButton';
import Link from 'next/link';
import UserController from '@/controllers/UserController';

const LogIn = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    const signIn = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = (e.target as HTMLElement).closest("form");

        if (form && form.reportValidity()) {
            const user = await UserController.getUserByEmail(email);
            if(!user) {
                alert("This account doesn't exist.")
            } else if(user.password === password){
                localStorage.setItem('user', JSON.stringify(user));
                router.push('./main');
            } else {
                alert('Wrong password!');
            }
        }
        else {
            alert("Please fill in all required fields.");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex justify-center items-center">
            <div className="p-8 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 w-[50%]">
                <h1 className="text-2xl font-semibold mb-4">Log In</h1>
                <h1 className="">Please fill the required fields.</h1>
                <form onSubmit={signIn}>
                    <MyInput
                        text="Email"
                        inputValue={email}
                        setInputValue={setEmail}
                        type="email"
                    />
                    <MyInput
                        text="Password"
                        inputValue={password}
                        setInputValue={setPassword}
                        type="password"
                    />
                    <div className="grid justify-center">
                        <MyButton text="Log In" type="submit" />
                    </div>
                    <div className='flex justify-center'>
                        <p className='mt-3 text-sm'>Don't have an account? 
                            <Link href="/signup" className='text-blue-500 underline hover:text-blue-700 hover:underline focus:text-blue-800 focus:outline-none'>
                                Sign Up
                            </Link>
                            .
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LogIn;