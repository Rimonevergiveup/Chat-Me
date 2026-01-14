import { Send, Plus, X, MessageCircle } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useState, useEffect, useRef } from 'react';
import { signalsService, type Signal } from '../../services/signals.service';
import { mediaService } from '../../services/media.service';
import { useConversations } from '../../contexts/ConversationsContext';
import { useChat } from '../../contexts/ChatContext';
import toast from 'react-hot-toast';

export function GalaxyView() {
    const { createConversation } = useConversations();
    const { setActiveConversation } = useChat();
    const [signals, setSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSignal, setNewSignal] = useState('');
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [selectedType, setSelectedType] = useState<Signal['type']>('exploration');

    // Story related state
    const [isUploadingStory, setIsUploadingStory] = useState(false);
    const [viewingStory, setViewingStory] = useState<Signal | null>(null);
    const storyInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadSignals();
        const subscription = signalsService.subscribeToSignals((signal) => {
            setSignals(prev => [signal, ...prev]);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const loadSignals = async () => {
        try {
            const data = await signalsService.getSignals();
            setSignals(data);
        } catch (error) {
            console.error('Error loading signals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBroadcast = async () => {
        if (!newSignal.trim() || isBroadcasting) return;

        setIsBroadcasting(true);
        try {
            await signalsService.broadcastSignal(newSignal, selectedType);
            setNewSignal('');
            toast.success('Signal Transmitted');
        } catch (error) {
            console.error('Error broadcasting:', error);
            toast.error('Uplink Failed');
        } finally {
            setIsBroadcasting(false);
        }
    };

    const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingStory(true);
        try {
            const url = await mediaService.uploadFile(file, 'signals');
            await signalsService.broadcastSignal('Shared a visual packet', 'intel', url);
            toast.success('Nebula Stream Updated');
        } catch (error) {
            toast.error('Uplink Interrupted');
        } finally {
            setIsUploadingStory(false);
            if (storyInputRef.current) storyInputRef.current.value = '';
        }
    };

    const handleQuickConnect = async (userId: string) => {
        try {
            const conversation = await createConversation([userId], false);
            setActiveConversation(conversation);
            toast.success('Frequency Established');
        } catch (error) {
            toast.error('Uplink Interrupted');
        }
    };

    const storySignals = signals.filter(s => s.media_url);
    // Unique users for stories
    const uniqueStories = Array.from(new Map(storySignals.map(s => [s.user_id, s])).values());

    const signalTypes: { type: Signal['type'], label: string, color: string }[] = [
        { type: 'exploration', label: 'EXPLORATION', color: 'bg-green-500' },
        { type: 'combat', label: 'COMBAT', color: 'bg-red-500' },
        { type: 'intel', label: 'INTEL', color: 'bg-neon-blue' },
        { type: 'trade', label: 'TRADE', color: 'bg-yellow-500' },
        { type: 'diplomacy', label: 'DIPLOMACY', color: 'bg-purple-500' },
    ];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neon-blue/5 blur-[120px] pointer-events-none" />

            <div className="p-6 shrink-0 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-display font-black text-white tracking-[0.2em] uppercase italic">Stories</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[10px] text-neon-blue font-mono opacity-60 uppercase tracking-widest">Feed Active</p>
                        </div>
                    </div>
                </div>

                {/* Stories Stream */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-mono font-black text-gray-700 tracking-[0.3em] uppercase mb-4 px-1">Recent Stories</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                        {/* New Story Trigger */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                            <button
                                onClick={() => storyInputRef.current?.click()}
                                disabled={isUploadingStory}
                                className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-700 hover:border-neon-blue hover:text-neon-blue transition-all group relative overflow-hidden"
                            >
                                {isUploadingStory ? (
                                    <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Plus size={24} className="group-hover:scale-125 transition-transform" />
                                        <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}
                            </button>
                            <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">Broadcast</span>
                            <input type="file" ref={storyInputRef} className="hidden" accept="image/*" onChange={handleStoryUpload} />
                        </div>

                        {/* User Stories */}
                        {uniqueStories.map((story) => (
                            <button
                                key={story.id}
                                onClick={() => setViewingStory(story)}
                                className="flex flex-col items-center gap-2 shrink-0 animate-in zoom-in-50 duration-500"
                            >
                                <div className="w-17 h-17 p-0.5 rounded-2xl border-2 border-neon-blue/40 bg-gradient-to-tr from-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                    <div className="w-full h-full rounded-xl overflow-hidden glass-panel border-none">
                                        <img src={story.media_url || story.user?.avatar_url} alt="Story" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <span className="text-[8px] font-mono text-white/70 uppercase tracking-tighter truncate w-16 text-center">
                                    {story.user?.username || 'Pilot'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Broadcast Input */}
                <div className="glass-panel p-4 rounded-2xl border-neon-blue/10 mb-6 bg-white/[0.02]">
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-none">
                        {signalTypes.map(item => (
                            <button
                                key={item.type}
                                onClick={() => setSelectedType(item.type)}
                                className={`px-3 py-1 rounded-full text-[8px] font-mono tracking-widest border transition-all shrink-0 ${selectedType === item.type
                                    ? `border-neon-blue text-white bg-white/10`
                                    : 'border-white/5 text-gray-500 hover:border-white/20'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative group">
                        <textarea
                            value={newSignal}
                            onChange={(e) => setNewSignal(e.target.value)}
                            placeholder="Share something with your friends..."
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-blue/30 min-h-[80px] transition-all resize-none font-body"
                        />
                        <button
                            onClick={handleBroadcast}
                            disabled={!newSignal.trim() || isBroadcasting}
                            className="absolute bottom-3 right-3 p-2 bg-neon-blue/10 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-void transition-all disabled:opacity-50 disabled:hover:bg-neon-blue/10 disabled:hover:text-neon-blue"
                        >
                            {isBroadcasting ? (
                                <div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-thin relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-2 border-t-neon-blue border-white/5 rounded-full animate-spin" />
                        <p className="text-[10px] font-mono text-neon-blue animate-pulse tracking-[0.3em] uppercase">Decoding Signals...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {signals.length === 0 ? (
                            <div className="py-20 text-center opacity-40">
                                <p className="text-xs font-display tracking-[0.3em] uppercase">No Incoming Data</p>
                            </div>
                        ) : (
                            signals.map((signal, idx) => (
                                <div
                                    key={signal.id}
                                    className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:border-neon-blue/20 transition-all animate-in slide-in-from-bottom-4 duration-500"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="relative">
                                            <Avatar src={signal.user?.avatar_url} name={signal.user?.full_name || 'Pilot'} size="md" />
                                            <div className="absolute inset-0 rounded-full border border-neon-blue/30 animate-pulse-glow" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-white font-display font-bold text-sm tracking-wide uppercase italic">
                                                    {signal.user?.full_name || 'Unknown Pilot'}
                                                </h3>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleQuickConnect(signal.user_id)}
                                                        className="p-1.5 bg-neon-blue/10 text-neon-blue rounded-lg hover:bg-neon-blue hover:text-void transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <MessageCircle size={14} />
                                                    </button>
                                                    <span className="text-[10px] font-mono text-gray-600">
                                                        {new Date(signal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-1 h-1 rounded-full ${signal.type === 'exploration' ? 'bg-green-500' :
                                                    signal.type === 'combat' ? 'bg-red-500' : 'bg-neon-blue'
                                                    } animate-pulse`} />
                                                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">{signal.type} Protocol</span>
                                            </div>
                                        </div>
                                    </div>
                                    {signal.media_url && (
                                        <div className="mb-4 rounded-xl overflow-hidden glass-panel border-white/5 aspect-video">
                                            <img src={signal.media_url} alt="Signal visual" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-300 font-light leading-relaxed">
                                        {signal.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Story Viewer Modal */}
            {viewingStory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
                    <button
                        onClick={() => setViewingStory(null)}
                        className="absolute top-6 right-6 p-2 text-white hover:bg-white/10 rounded-full z-50"
                    >
                        <X size={32} />
                    </button>

                    <div className="w-full max-w-lg aspect-[9/16] relative overflow-hidden glass-panel border-none animate-in zoom-in-110 duration-500">
                        <img src={viewingStory.media_url} alt="Story view" className="w-full h-full object-cover" />

                        {/* Story Progress Bar */}
                        <div className="absolute top-0 left-0 w-full p-4 flex gap-1 z-10">
                            <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white animate-progress origin-left" />
                            </div>
                        </div>

                        {/* Pilot Info Overlay */}
                        <div className="absolute top-8 left-0 w-full p-4 flex items-center gap-3 z-10">
                            <Avatar src={viewingStory.user?.avatar_url} name={viewingStory.user?.full_name || 'Pilot'} size="sm" />
                            <div>
                                <h4 className="text-white font-display font-bold text-xs uppercase italic">{viewingStory.user?.full_name}</h4>
                                <p className="text-[8px] font-mono text-white/50 uppercase tracking-widest">Transmitted {new Date(viewingStory.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-sm font-light italic mb-4">"{viewingStory.content}"</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleQuickConnect(viewingStory.user_id)}
                                    className="flex-1 py-3 bg-neon-blue text-void rounded-xl font-display font-black tracking-widest uppercase italic text-xs hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                                >
                                    SEND MESSAGE
                                </button>
                                <button
                                    onClick={() => setViewingStory(null)}
                                    className="px-6 py-3 bg-white/10 text-white rounded-xl font-display font-black tracking-widest uppercase italic text-xs hover:bg-white/20 transition-all"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
