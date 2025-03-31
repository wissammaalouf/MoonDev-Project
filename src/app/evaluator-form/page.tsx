"use client";

import MyButton from "@/app/items/button/MyButton";
import MyInput from "@/app/items/input/MyInput";
import MyTextArea from "@/app/items/input/MyTextArea";
import { useState } from "react";
import User from "@/models/User";
import UserController from "@/controllers/UserController";

interface DevFormProps {
    user: User;
    handleCancel: () => void;
    evalId: number;
}

const EvalForm: React.FC<DevFormProps> = ({ user, handleCancel, evalId }) => {
    const [name, setName] = useState<string>(user.name);
    const [phoneNumber, setPhoneNumber] = useState<string>(user.phone_number);
    const [location, setLocation] = useState<string>(user.location);
    const [email, setEmail] = useState<string>(user.email);
    const [hobbies, setHobbies] = useState<string>(user.hobbies);
    const [evaluator, setEvaluator] = useState<boolean>(user.role === "evaluator");

    const [feedback, setFeedback] = useState<string>(user.feedback);
    const [fileName, setFileName] = useState<string>(user.project_name);
    const [isAccepted, setIsAccepted] = useState<boolean | null>(user.feedback ? user.is_accepted : null);
    const [downloadingFile, setDownloadingFile] = useState<boolean>(false);

    const [isUploading, setIsUploading] = useState<Boolean>(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        const form = e.target as HTMLFormElement;

        const rb_select = document.getElementById("rb_select") as HTMLInputElement;
        rb_select.setCustomValidity("");

        if (form.reportValidity()) {
            if (isAccepted === null) {
                rb_select.setCustomValidity("Please select an option");
                rb_select.reportValidity();
                setIsUploading(false);
                return;
            }
            let tempUser = new User(user.id, user.name, user.phone_number, user.location, user.email, user.password, user.role, user.hobbies, user.profile_pic_url, user.project_name, user.file_url, isAccepted, evalId, feedback);

            try {
                await UserController.updateUser(tempUser);
            } catch (error) {
                alert(error)
            }
        } else {
            alert("Something went wrong");
        }
        alert("Form submitted successfully!");
        setIsUploading(false);
        handleCancel();
    };

    const changeRole = async () => {
        let tempString = evaluator ? "developer" : "evaluator";
        const isConfirmed = window.confirm('Are you sure you want to change this user role to ' + tempString + '?');

        if (isConfirmed) {
            setEvaluator(!evaluator);
            try {
                if (evaluator) {
                    await UserController.updateUserRole(user.id, "developer");
                }
                else {
                    await UserController.updateUserRole(user.id, "evaluator");
                }
                handleCancel();
            } catch (error) {
                alert(error);
            }
        }
    }

    const handleDownload = async (event: React.MouseEvent<HTMLLabelElement>) => {
        setDownloadingFile(true)
        try {
            const response = await fetch(user.file_url);
            const blob = await response.blob();

            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = email + '_' + fileName;

            link.click();

            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
        setDownloadingFile(false);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAccepted(!isAccepted);
    };

    return (
        <>
            <div className="mt-10 mb-10 p-8 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 w-[80%]">
                <h1 className="flex justify-center text-2xl font-semibold mb-2">
                    Evaluator Form
                </h1>
                <fieldset>
                    <form action="#" method="get" onSubmit={handleSubmit}>
                        <div className="mt-2 flex justify-center">
                            <img
                                src={user.profile_pic_url}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-full"
                            />
                        </div>

                        <MyInput
                            text="Name"
                            inputValue={name}
                            setInputValue={setName}
                            type="text"
                            disabled={true}
                        />

                        <MyInput
                            text="Phone Number"
                            inputValue={phoneNumber}
                            setInputValue={setPhoneNumber}
                            type="text"
                            disabled={true}
                        />

                        <MyInput
                            text="Location"
                            inputValue={location}
                            setInputValue={setLocation}
                            type="text"
                            disabled={true}
                        />

                        <MyInput
                            text="Email"
                            inputValue={email}
                            setInputValue={setEmail}
                            type="email"
                            disabled={true}
                        />

                        <MyTextArea
                            text="Hobbies"
                            inputValue={hobbies}
                            setInputValue={setHobbies}
                            disabled={true}
                        />

                        {user.file_url &&
                            <div>
                                <div className="mt-4 text-[14px]">
                                    Download the project's source code as a zip file
                                </div>
                                <label
                                    htmlFor="file-upload"
                                    className="text-base px-2 py-2 block w-full border-1 border-gray-600 bg-transparent cursor-pointer"
                                    onClick={handleDownload}
                                >
                                    Source code file: {fileName}      {downloadingFile? "(Downloading...)": " "}
                                </label>
                                <MyTextArea
                                    text="Feedback"
                                    inputValue={feedback}
                                    setInputValue={setFeedback}
                                />
                                <div className="mb-4 mt-4">
                                    <h2>Select Status</h2>

                                    <label className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="true"
                                            checked={isAccepted === true}
                                            onChange={handleChange}
                                        />
                                        <span>Hired</span>
                                    </label>
                                    <label className="flex items-center space-x-2 text-sm">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="false"
                                            checked={isAccepted === false}
                                            onChange={handleChange}
                                            id="rb_select"
                                        />
                                        <span>Rejected</span>
                                    </label>
                                </div>
                            </div>}
                        {!user.file_url &&
                            <div>
                                <div className="mt-4 text-base px-2 py-2 block w-full text-red-500">
                                    Project is not yet uploaded
                                </div>
                            </div>}

                        <label>
                            <input
                                type="checkbox"
                                checked={evaluator}
                                onChange={changeRole}
                            />
                            Evaluator
                        </label>

                        <div className="flex justify-end space-x-4">
                            <MyButton text='Cancel' type="button" handleOnClick={handleCancel} />
                            <MyButton text={isUploading ? "Submitting..." : "Submit"} type="submit" />
                        </div>
                    </form>
                </fieldset>
            </div>

        </>
    );
};

export default EvalForm;