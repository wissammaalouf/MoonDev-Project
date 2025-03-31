"use client";

import MyButton from "@/app/items/button/MyButton";
import MyInput from "@/app/items/input/MyInput";
import MyTextArea from "@/app/items/input/MyTextArea";
// import FileController from "@/controllers/FileController";
import UserController from "@/controllers/UserController";
import User from "@/models/User";
import imageCompression from "browser-image-compression";
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from "react";

const SignUp = () => {
    const [name, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [hobbies, setHobbies] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>("No picture selected");
    const [isCreating, setIsCreating] = useState<Boolean>(false);

    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{8,}$/;

    useEffect(() => {
        setIsValid(passwordRegex.test(password));
    }, [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) {
            alert('Please enter a STRONG password.');
            return;
        }
        setIsCreating(true);

        const form = e.target as HTMLFormElement;

        if (imageInputRef.current && !image) {
            imageInputRef.current.setCustomValidity("Please select a profile picture");
            imageInputRef.current.reportValidity();
            setIsCreating(false);
            return;
        }

        if (form.reportValidity()) {
            if(!image) {return;}

            const user = new User(-1, name, phoneNumber, location, email, password, "developer", hobbies, "", "", "", false ,-1, "");
            try {
                await UserController.addNewUser(user, image);
                handleReset();
                if (imageInputRef.current) {
                    imageInputRef.current.value = "";
                }
                router.push('./login');
            } catch (error) {
                alert("Error during signup:\n" + error);
            }

        } else {
            alert("Something went wrong");
        }
        setIsCreating(false);
    };

    const handleReset = () => {
        setName("");
        setPhoneNumber("");
        setLocation("");
        setEmail("");
        setHobbies("");
        setImage(null);
        setImageName("No picture selected");
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = e.target.files?.[0];
        setImageName("Processing...");
        if (selectedImage) {
            if (imageInputRef.current && !selectedImage.type.startsWith("image/")) {
                setImageName("No picture selected")
                alert("Please select an image...");
                return;
            }
            try {
                const options = {
                    maxSizeMB: 1, // Max size is 1MB
                    maxWidthOrHeight: 1080, // Max width or height is 1080px
                    useWebWorker: true, // Enable web workers for better performance
                };

                const compressedFile = await imageCompression(selectedImage, options);
                setImage(compressedFile);
                setImageName(selectedImage.name);
            } catch (error) {
                alert("Error during image compression: " + error);
            }
        } else {
            setImage(null);
            setImageName("No picture selected");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex justify-center">
            <div className="mt-10 mb-10 p-8 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 w-[80%]">
                <h1 className="flex justify-center text-2xl font-semibold mb-2">
                    Sign Up
                </h1>
                <fieldset>
                    <form action="#" method="get" onSubmit={handleSubmit}>
                        <MyInput
                            text="Name"
                            inputValue={name}
                            setInputValue={setName}
                            type="text"
                        />

                        <MyInput
                            text="Phone Number"
                            inputValue={phoneNumber}
                            setInputValue={setPhoneNumber}
                            type="number"
                        />

                        <MyInput
                            text="Location"
                            inputValue={location}
                            setInputValue={setLocation}
                            type="text"
                        />

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
                            type="text"
                        />
                        {!isValid && password != '' && <div className="text-red-500">
                            Please enter a strong password...
                            <br/>At least 8 characters.
                            <br/>At least one uppercase letter.
                            <br/>At least one lowercase letter.
                            <br/>At least one digit.
                            <br/>At least one special character (`@`, `$`, `!`, `%`, `*`, `?`, `&`, `.`, `,`).
                        </div>}

                        <MyTextArea
                            text="Hobbies"
                            inputValue={hobbies}
                            setInputValue={setHobbies}
                        />

                        <div className="mt-4 text-[14px]">Upload your profile picture</div>
                        <input
                            name="image"
                            id="image-upload"
                            // className="hidden"
                            className="text-base px-2 py-2 block w-full border-1 border-gray-600 bg-transparent cursor-pointer bg-gray-200 rounded-md"
                            type="file"
                            accept="image/*"
                            ref={imageInputRef}
                            onChange={handleImageChange}
                        />
                        {/* <label
                            htmlFor="image-upload"
                            className="text-base px-2 py-2 block w-full border-1 border-gray-600 bg-transparent cursor-pointer bg-gray-200 rounded-md"
                        >
                            Profile picture: {imageName}
                        </label> */}
                        {image && (
                            <div className="mt-2">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-full"
                                />
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <MyButton text='Cancel' type="button" handleOnClick={() => {router.push('./');}} />
                            <MyButton text={isCreating ? "Creating account..." : "Sign Up"} type="submit" />
                        </div>
                    </form>
                </fieldset>
            </div>
        </div>
    );
};

export default SignUp;
