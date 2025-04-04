"use client";

import { useEffect, useState } from "react";
import User from "@/models/User";
import UserController from "@/controllers/UserController";
import MyInput from "@/app/items/input/MyInput";
import MyButton from "@/app/items/button/MyButton";
import EvalDevView from "./EvalDevView";
import EvalForm from "./EvalForm";

interface DevFormProps {
    user: User;
}

const EvalPage: React.FC<DevFormProps> = ({ user }) => {
    const [userList, setUserList] = useState<User[]>([]);
    const [search, setSearch] = useState<string>("");
    const [processed, setProcessed] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            if (processed)
                setUserList(await UserController.getProcessed());
            else
                setUserList(await UserController.getUnProcessed());
        } catch (error) {
            alert(error)
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [processed])

    useEffect(() => {
        handleSearch();
    }, [search])

    const handleClick = (user: User) => {
        setSelectedUser(user); // Set the selected user to show the EvalForm
    };

    const handleSearch = async() => {
        try {
            const handleSearch = async () => {
                if (search)
                    setUserList(await UserController.searchByEmail(search));
                else
                    fetchUsers();
            }
            handleSearch();
        } catch (error) {
            alert(error);
        }
    }

    const comeBack = () => {
        setSelectedUser(null);
        handleSearch();
    }

    return (
        <div>
            {!selectedUser &&
                <div>
                    <div className="flex mb-4">
                        <div className="flex space-x-4 justify-between items-center w-full ml-2 mr-2">
                            <div className="w-full">
                                <MyInput
                                    text="Search by email:"
                                    inputValue={search}
                                    setInputValue={setSearch}
                                    type="text"
                                />
                            </div>
                            {!search && <MyButton
                                text={processed ? "Processed" : "UnProcessed"}
                                handleOnClick={() => setProcessed(!processed)}
                                type="button"
                            />}
                        </div>
                    </div>
                    <div className="ml-4 mr-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {userList.map((dev) => (
                            <ul key={dev.id} onClick={() => handleClick(dev)}>
                                <EvalDevView user={dev} search={search}/>
                            </ul>
                        ))}
                    </div>

                    {userList.length === 0 && <div className="text-lg font-bold mb-4">
                        <p>
                            No users are imported<br/>
                            Change some settings to get users...
                        </p>
                    </div>}
                </div>
            }
            {selectedUser &&
                <div className="flex justify-center">
                    <EvalForm user={selectedUser} handleCancel={comeBack} evalId={user.id}/>
                </div>
            }
        </div>

    );
};

export default EvalPage;
