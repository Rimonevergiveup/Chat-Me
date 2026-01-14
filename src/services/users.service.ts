import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';

export const usersService = {
    async searchUsers(query: string): Promise<Profile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
            .limit(20);

        if (error) throw error;
        return data || [];
    },

    async getUserProfile(userId: string): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateOnlineStatus(isOnline: boolean) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                is_online: isOnline,
                last_seen: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (error) throw error;
    },

    async getOnlineUsers(): Promise<Profile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('is_online', true);

        if (error) throw error;
        return data || [];
    },
};
