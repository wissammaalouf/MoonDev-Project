import supabase from "@/lib/supabaseClient";

class FileController {
    private static getFormattedDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    static async uploadFile(owner: string, file: File, type: string, name: String) {
        const bucketName = 'files';
        let filePath = "";

        if (type === "profile_pic") {
            filePath = `profile_pics/${owner}_${this.getFormattedDate()}_${file.name}`;
        } else {
            filePath = `files/${owner}_${this.getFormattedDate()}_${name}.zip`;
        }

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

        if (error) {
            alert('Error uploading file:' + error.message);
            return;
        }

        const urlResult = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        if (!urlResult.data || !urlResult.data.publicUrl) {
            console.error('Error: No public URL returned.');
            return;
        }
        return urlResult.data.publicUrl;
    }

    static async getFile(filePath: string) {
        const bucketName = 'files';

        const { data, error } = await supabase.storage
            .from(bucketName)
            .download(filePath);

        if (error) {
            alert('Error downloading file:' + error.message);
            return;
        }
        return data;
    }

    static async deleteFile(pic_url: string) {
        const bucketName = 'files';
        const filePath = "profile_pics/"+pic_url.substring(pic_url.lastIndexOf('/') + 1);

        const { data, error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) {
            alert('Error deleting file:' + error.message);
            return;
        }
        return data;
    }
}

export default FileController;