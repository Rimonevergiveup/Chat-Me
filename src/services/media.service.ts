import { supabase } from '../lib/supabase';

export const mediaService = {
    async uploadFile(file: File, bucket: 'avatars' | 'chat-media' | 'signals'): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    async getFileUrl(path: string, bucket: 'avatars' | 'chat-media' | 'signals'): Promise<string> {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    },

    async deleteFile(path: string, bucket: 'avatars' | 'chat-media' | 'signals') {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
    },
};
