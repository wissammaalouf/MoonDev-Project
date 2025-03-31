import supabase from "@/lib/supabaseClient";
import User from "@/models/User";
import FileController from "./FileController";

class UserController {
    static async searchByEmail(val: string) {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .ilike('email', `%${val}%`);

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    static async getProcessed() {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .neq('reviewed_by', -1);

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    static async getUnProcessed() {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq('reviewed_by', -1)
                .neq('file_url', null)
                .neq('file_url', '');

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    static async getAllDevs() {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq("role", "developer");

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    static async getUserByEmail(email: string) {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq('email', email)
                .maybeSingle();

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    static async getUserById(id: number) {
        try {
            const { data, error } = await supabase
                .from('user')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    static async addNewUser(user: User, image: File) {
        try {
            if (await this.getUserByEmail(user.email) != null) {
                throw new Error("Email already used for another account.");
            }

            if (!image) {
                throw new Error("No file selected.");
            }
            const URL = await FileController.uploadFile(user.name, image, "profile_pic", "");

            let userToInsert;
            if (URL) {
                userToInsert = {
                    name: user.name,
                    phone_number: user.phone_number,
                    location: user.location,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    hobbies: user.hobbies,
                    profile_pic_url: URL,
                };
            } else {
                throw new Error("Failed to upload the image, no URL returned.");
            }

            const { data, error } = await supabase
                .from("user")
                .insert(userToInsert)
                .single();

            if (error) {
                throw new Error(error.message);
            }
            alert("User added successfully")
        } catch (error) {
            throw error;
        }
    };

    static async updateUser(user: User) {
        try {
            if (!await this.getUserById(user.id)) {
                throw new Error("User not found.");
            }

            const { data, error } = await supabase
                .from('user')
                .update(user)
                .eq('id', user.id);

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    static async updateUserRole(id: number, role: string) {
        try {
            if (!await this.getUserById(id)) {
                throw new Error("User not found.");
            }

            const { data, error } = await supabase
                .from('user')
                .update({"role": role})
                .eq('id', id);

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };
}

export default UserController;