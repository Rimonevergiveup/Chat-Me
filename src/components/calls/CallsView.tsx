import { Phone, PhoneOutgoing, PhoneIncoming, PhoneMissed, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { callsService, type CallLog } from '../../services/calls.service';

export function CallsView() {
    const [calls, setCalls] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCalls();
    }, []);

    const loadCalls = async () => {
        try {
            const data = await callsService.getCalls();
            setCalls(data);
        } catch (error) {
            console.error('Error loading calls:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden relative">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

            <div className="p-6 shrink-0 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-display font-black text-white tracking-[0.2em] uppercase italic">Calls</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Clock size={10} className="text-neon-blue" />
                            <p className="text-[10px] text-neon-blue font-mono opacity-60 uppercase tracking-widest">Call History Active</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4 relative z-10 scrollbar-thin">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-2 border-t-neon-purple border-white/5 rounded-full animate-spin" />
                        <p className="text-[10px] font-mono text-neon-purple animate-pulse tracking-widest uppercase">Syncing Call Data...</p>
                    </div>
                ) : calls.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-neon-blue rounded-full blur-[60px] opacity-20" />
                            <Phone size={60} className="text-gray-600 animate-pulse" />
                        </div>
                        <p className="text-sm font-display tracking-[0.4em] uppercase text-gray-500">No Recent Calls</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {calls.map((call) => (
                            <div
                                key={call.id}
                                className="glass-panel p-5 rounded-2xl flex items-center justify-between group hover:border-neon-blue/20 transition-all duration-300 bg-white/[0.02] border-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full relative ${call.type === 'missed' ? 'bg-red-500/10 text-red-500' :
                                        call.type === 'incoming' ? 'bg-green-500/10 text-green-500' : 'bg-neon-blue/10 text-neon-blue'
                                        }`}>
                                        <div className="absolute inset-0 rounded-full border border-current opacity-20 group-hover:animate-ping" />
                                        {call.type === 'missed' ? <PhoneMissed size={20} /> :
                                            call.type === 'incoming' ? <PhoneIncoming size={20} /> : <PhoneOutgoing size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-display font-bold text-sm tracking-wide uppercase italic">{call.caller_name}</h3>
                                        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter mt-0.5">
                                            {new Date(call.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-neon-blue font-mono drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">
                                        {new Date(call.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <p className={`text-[8px] font-mono mt-1 uppercase tracking-widest ${call.type === 'missed' ? 'text-red-400' : 'text-gray-600'
                                        }`}>
                                        {call.type} Call
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
