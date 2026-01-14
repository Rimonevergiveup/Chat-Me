import { supabase } from '../lib/supabase';

export interface CallLog {
    id: string;
    user_id: string;
    caller_name: string;
    caller_avatar_url?: string;
    type: 'incoming' | 'outgoing' | 'missed';
    created_at: string;
}

export const callsService = {
    async getCalls() {
        const { data, error } = await supabase
            .from('calls')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as CallLog[];
    },

    async addCall(callerName: string, type: 'incoming' | 'outgoing' | 'missed', receiverId: string, avatarUrl?: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('calls')
            .insert({
                user_id: user.id,
                receiver_id: receiverId,
                caller_name: callerName,
                caller_avatar_url: avatarUrl,
                type
            });

        if (error) throw error;
    }
};

// Audio Service for Sci-Fi Feedback
export const audioService = {
    playSend() {
        this._playTone(880, 0.1, 'sine');
        this._playTone(1760, 0.1, 'square');
    },
    playReceive() {
        this._playTone(440, 0.1, 'sine');
        this._playTone(220, 0.2, 'triangle');
    },
    playWarp() {
        this._playTone(100, 0.5, 'sawtooth', 0.1, 1000);
    },
    _playTone(freq: number, duration: number, type: OscillatorType, volume: number = 0.1, sweep?: number) {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            if (sweep) {
                osc.frequency.exponentialRampToValueAtTime(sweep, ctx.currentTime + duration);
            }

            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.warn('Audio feedback not supported or blocked');
        }
    }
};
