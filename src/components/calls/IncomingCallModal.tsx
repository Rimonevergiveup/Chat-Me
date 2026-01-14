import { Phone, PhoneOff, Radio } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { audioService } from '../../services/calls.service';
import { useEffect } from 'react';

interface IncomingCallModalProps {
    callerName: string;
    callerAvatar?: string;
    onAccept: () => void;
    onDecline: () => void;
}

export function IncomingCallModal({ callerName, callerAvatar, onAccept, onDecline }: IncomingCallModalProps) {
    useEffect(() => {
        // Loop the receive tone while ringing? Maybe not, just once for now.
        audioService.playReceive();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-xl animate-in fade-in duration-500">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[100px] animate-pulse-slow" />
            </div>

            <div className="relative w-full max-w-sm glass-panel p-8 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.1)] text-center">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border border-neon-blue/20 flex items-center justify-center bg-void animate-float">
                        <div className="absolute inset-0 rounded-full border-2 border-neon-blue/40 animate-ping" style={{ animationDuration: '3s' }} />
                        <Radio size={40} className="text-neon-blue animate-pulse" />
                    </div>
                </div>

                <div className="mt-12 space-y-6">
                    <div>
                        <p className="text-[10px] font-mono text-neon-blue tracking-[0.5em] uppercase mb-2 animate-pulse">Incoming Frequency</p>
                        <h2 className="text-3xl font-display font-black text-white tracking-widest uppercase italic">
                            {callerName}
                        </h2>
                        <p className="text-xs text-gray-500 font-mono mt-2 tracking-widest">ENCRYPTED UPLINK DETECTED</p>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative">
                            <Avatar src={callerAvatar} name={callerName} size="xl" />
                            <div className="absolute inset-0 rounded-full border-2 border-neon-blue animate-pulse-glow" />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-8 pt-4">
                        <button
                            onClick={onDecline}
                            className="group flex flex-col items-center gap-3 transition-all active:scale-90"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300">
                                <PhoneOff size={28} />
                            </div>
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest group-hover:text-red-400">Sever</span>
                        </button>

                        <button
                            onClick={onAccept}
                            className="group flex flex-col items-center gap-3 transition-all active:scale-90"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300">
                                <Phone size={28} className="animate-pulse" />
                            </div>
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest group-hover:text-green-400">Harmonize</span>
                        </button>
                    </div>
                </div>

                {/* Technical HUD Details */}
                <div className="mt-10 pt-6 border-t border-white/5 flex justify-between text-[8px] font-mono text-gray-700 uppercase tracking-widest">
                    <span>Sig: Alpha-9</span>
                    <span>Sync: 98.4%</span>
                    <span>Loc: Orbit</span>
                </div>
            </div>
        </div>
    );
}
