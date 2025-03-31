"use client";

import MyButton from "@/app/items/button/MyButton";
import MyInput from "@/app/items/input/MyInput";
import MyTextArea from "@/app/items/input/MyTextArea";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import User from "@/models/User";
import FileController from "@/controllers/FileController";
import UserController from "@/controllers/UserController";

import acceptedImage from '../../Pics/accepted.png';
import rejectedImage from "../../Pics/rejected.png";

interface DevFormProps {
    user: User;
}

const DevPage: React.FC<DevFormProps> = ({ user }:DevFormProps) => {
    const [name, setName] = useState<string>(user.name);
    const [phoneNumber, setPhoneNumber] = useState<string>(user.phone_number);
    const [location, setLocation] = useState<string>(user.location);
    const [email, setEmail] = useState<string>(user.email);
    const [hobbies, setHobbies] = useState<string>(user.hobbies);
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>(user.profile_pic_url.substring(user.profile_pic_url.lastIndexOf('/') + 1));

    const [project, setProject] = useState<File | null>(null);
    const [projectName, setProjectName] = useState<string>(user.project_name);
    const [isAccepted, setIsAccepted] = useState<boolean>(user.is_accepted);
    const [feedback, setFeedback] = useState<string>(user.feedback);
    const [submitted, setSubmitted] = useState<boolean>(user.file_url ? true : false);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
        setLocation(user.location);
        setHobbies(user.hobbies);
        setPhoneNumber(user.phone_number);
        setImage(null);
    }, [isEdit])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.target as HTMLFormElement;

        if (fileInputRef.current && !project) {
            fileInputRef.current.setCustomValidity("Please select the project to upload");
            fileInputRef.current.reportValidity();
            setIsSubmitting(false);
            return;
        }

        let tempUser = new User(user.id, name, phoneNumber, location, email, user.password, "developer", hobbies, user.profile_pic_url, projectName, user.file_url, user.is_accepted, user.reviewed_by, user.feedback);

        if (form.reportValidity()) {
            let proj_url;
            if (project) {
                try {
                    proj_url = await FileController.uploadFile(user.name, project, "project", projectName);
                } catch (error) {
                    alert("Error uploading project: " + error);
                    return;
                }
            }
            if (proj_url) tempUser.file_url = proj_url;

            try {
                await UserController.updateUser(tempUser);
            } catch (error) {
                alert("Error updating user: " + error);
                return;
            }
            alert("Application submitted successfully!");

        } else {
            alert("Something went wrong");
            return;
        }
        setIsSubmitting(false);
        setSubmitted(true);
        try {
            tempUser = await UserController.getUserById(user.id);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            alert("Something went wrong: " + error)
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(true);

        const form = e.target as HTMLFormElement;

        let tempUser = new User(user.id, name, phoneNumber, location, email, user.password, "developer", hobbies, user.profile_pic_url, user.project_name, user.file_url, user.is_accepted, user.reviewed_by, user.feedback);

        if (form.reportValidity()) {
            let pic_url;
            if (image) {
                try {
                    await FileController.deleteFile(user.profile_pic_url);
                    pic_url = await FileController.uploadFile(name, image, "profile_pic", "");
                } catch (error) {
                    alert("Error updating image: " + error);
                    return;
                }
            }
            if (pic_url) {
                tempUser.profile_pic_url = pic_url;
                user.profile_pic_url = pic_url;
            }

            try {
                await UserController.updateUser(tempUser);
            } catch (error) {
                alert("Error updating user: " + error);
                return;
            }

            setIsEdit(!isEdit);
            if (imageInputRef.current) {
                imageInputRef.current.value = "";
            }
            alert("Information submitted successfully!");

        } else {
            alert("Something went wrong");
            return;
        }
        setIsEditing(false);
        try {
            tempUser = await UserController.getUserById(user.id);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            alert("Something went wrong: " + error)
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (fileInputRef.current && !selectedFile.name.toLowerCase().endsWith(".zip")) {
                fileInputRef.current.value = "";
                alert("Please select a ZIP file");
                return;
            }
            setProject(selectedFile);
        }
        else {
            setProject(null);
        }
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = e.target.files?.[0];
        setImageName("Processing...");
        if (selectedImage) {
            if (imageInputRef.current && !selectedImage.type.startsWith("image/")) {
                setImageName("")
                imageInputRef.current.value = "";
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
            setImageName("");
        }
    };

    return (
        <div className="flex justify-center">
            <div className="mt-10 mb-10 p-8 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 w-[80%]">
                <h1 className="flex justify-center text-2xl font-semibold mb-2">
                    Developer Form
                </h1>
                <div className="grid grid-cols-2 gap-4">
                    <div className="mt-3 border-r-4 border-r-gray-500 pr-4">
                        <fieldset>
                            <form action="#" method="get" onSubmit={handleEdit}>
                                <div className="flex justify-center">
                                    <div>
                                        <img
                                            src={image ? URL.createObjectURL(image) : user.profile_pic_url}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-full"
                                        />
                                    </div>
                                </div>
                                {isEdit && (
                                    <div className="mt-2">
                                        <input
                                            id="image-upload"
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
                                        Change profile picture <br /> {user.profile_pic_url.substring(user.profile_pic_url.lastIndexOf('/') + 1) != imageName && imageName}
                                    </label> */}
                                    </div>
                                )}
                                <MyInput
                                    text="Name"
                                    inputValue={name}
                                    setInputValue={setName}
                                    type="text"
                                    disabled={!isEdit}
                                />

                                <MyInput
                                    text="Phone Number"
                                    inputValue={phoneNumber}
                                    setInputValue={setPhoneNumber}
                                    type="number"
                                    disabled={!isEdit}
                                />

                                <MyInput
                                    text="Location"
                                    inputValue={location}
                                    setInputValue={setLocation}
                                    type="text"
                                    disabled={!isEdit}
                                />

                                <MyInput
                                    text="Email"
                                    inputValue={email}
                                    setInputValue={setEmail}
                                    type="email"
                                    disabled={!isEdit}
                                />

                                <MyTextArea
                                    text="Hobbies"
                                    inputValue={hobbies}
                                    setInputValue={setHobbies}
                                    disabled={!isEdit}
                                />
                                <div className="flex justify-between w-full">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isEdit ? isEdit : false}
                                            onChange={(e) => setIsEdit(!isEdit)} // Handle checkbox change
                                        />
                                        Edit Info
                                    </label>
                                    {isEdit &&
                                        <div>
                                            <MyButton text={isEditing ? "Saving..." : "Save"} type="submit" />
                                        </div>
                                    }
                                </div>
                            </form>
                        </fieldset>
                    </div>
                    <div className="mt-35">
                        <fieldset>
                            <form action="#" method="get" onSubmit={handleSubmit}>
                                {!submitted && <div>
                                    <div className="mt-4 text-[14px]">
                                        Upload your project source code as a zip file
                                    </div>

                                    <input
                                        id="file-upload"
                                        className="text-base px-2 py-2 block w-full border-1 border-gray-600 bg-transparent cursor-pointer bg-gray-200 rounded-md"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                                }
                                <MyInput
                                    text={!submitted ? "Project Name" : "Submitted Project Name"}
                                    inputValue={projectName}
                                    setInputValue={setProjectName}
                                    type="text"
                                    disabled={submitted}
                                />
                                {!feedback && submitted &&
                                        <p className="mt-20 text-xl font-bold text-yellow-500">
                                            Still processing...
                                        </p>
                                }
                                {feedback && isAccepted &&
                                    <img src={acceptedImage.src} alt="Accepted" className="w-full mt-15" />
                                }
                                {feedback && !isAccepted &&
                                    <img src={rejectedImage.src} alt="Accepted" className="w-full mt-15" />
                                }
                                <div className="mt-30">
                                    <MyTextArea
                                        text="Feedback"
                                        inputValue={user.project_name ? user.feedback ? user.feedback : "This project is not yet processed..." : "Please submit your project to get a feedback."}
                                        setInputValue={setFeedback}
                                        disabled={true}
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    {!isEdit && !submitted &&
                                        <MyButton text={isSubmitting ? "Submitting..." : "Submit"} type="submit" />
                                    }
                                    {submitted &&
                                        <p>Project already Uploaded...</p>
                                    }
                                </div>
                            </form>
                        </fieldset>
                    </div>


                </div>
            </div >
        </div>
    );
};

export default DevPage;
