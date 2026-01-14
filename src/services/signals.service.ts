import { supabase } from '../lib/supabase';

export interface Signal {
    id: string;
    user_id: string;
    content: string;
    type: 'exploration' | 'combat' | 'intel' | 'trade' | 'diplomacy';
    media_url?: string;
    created_at: string;
    user?: {
        username: string;
        full_name: string;
        avatar_url: string;
    };
}

export const signalsService = {
    async getSignals() {
        const { data, error } = await supabase
            .from('signals')
            .select('*, user:user_id(username, full_name, avatar_url)')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        return data as Signal[];
    },

    async broadcastSignal(content: string, type: string = 'exploration', mediaUrl?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('signals')
            .insert({
                user_id: user.id,
                content,
                type,
                media_url: mediaUrl
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    subscribeToSignals(onSignal: (signal: Signal) => void) {
        return supabase
            .channel('public:signals')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'signals' },
                async (payload) => {
                    // Fetch user details for the new signal
                    const { data } = await supabase
                        .from('signals')
                        .select('*, user:user_id(username, full_name, avatar_url)')
                        .eq('id', payload.new.id)
                        .single();

                    if (data) onSignal(data as Signal);
                }
            )
            .subscribe();
    },

    async getUserSignals() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('signals')
            .select('*')
            .eq('user_id', user.id)
            .not('media_url', 'is', null) // Only media for gallery
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Signal[];
    }
};
