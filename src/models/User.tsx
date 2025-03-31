class User {
    id: number;
    name: string;
    phone_number: string;
    location: string;
    email: string;
    password: string;
    role: string;
    hobbies: string;
    profile_pic_url: string;
    project_name: string;
    file_url: string;
    is_accepted: boolean;
    reviewed_by: number;
    feedback: string;

    constructor(
        id?: number,
        name?: string,
        phone_number?: string,
        location?: string,
        email?: string,
        password?: string,
        role?: string,
        hobbies?: string,
        profile_pic_url?: string,
        project_name?: string,
        file_url?: string,
        is_accepted?: boolean,
        reviewed_by?: number,
        feedback?: string
    ) {
        this.id = id || -1;
        this.name = name || '';
        this.phone_number = phone_number || '';
        this.location = location || '';
        this.email = email || '';
        this.password = password || '';
        this.role = role || '';
        this.hobbies = hobbies || '';
        this.profile_pic_url = profile_pic_url || '';
        this.project_name = project_name || '';
        this.file_url = file_url || '';
        this.is_accepted = is_accepted || false;
        this.reviewed_by = reviewed_by || -1;
        this.feedback = feedback || '';
    }
}

export default User;