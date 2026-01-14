import { Avatar } from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { Phone, Video, MoreVertical, ChevronLeft, Shield } from 'lucide-react';

export function ChatHeader() {
    const { user } = useAuth();
    const { activeConversation, setActiveConversation } = useChat();

    if (!activeConversation) return null;

    const otherParticipant = activeConversation.participants?.find(p => p.id !== user?.id);

    const displayName = activeConversation.is_group
        ? activeConversation.name || 'Group Chat'
        : otherParticipant?.full_name || otherParticipant?.username || 'Unknown User';

    const displayAvatar = activeConversation.is_group
        ? activeConversation.avatar_url
        : otherParticipant?.avatar_url;

    return (
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setActiveConversation(null)}
                    className="p-1 -ml-1 text-gray-400 hover:text-white lg:hidden transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="relative">
                    <Avatar
                        src={displayAvatar}
                        name={displayName}
                        size="md"
                        isOnline={!activeConversation.is_group && otherParticipant?.is_online}
                    />
                    {!activeConversation.is_group && otherParticipant?.is_online && (
                        <div className="absolute inset-0 rounded-full border border-neon-blue/40 animate-pulse" />
                    )}
                </div>

                <div>
                    <h2 className="font-display font-bold text-sm text-white tracking-widest uppercase truncate max-w-[150px] lg:max-w-none">
                        {displayName}
                    </h2>
                    <div className="flex items-center gap-2">
                        {!activeConversation.is_group && otherParticipant?.is_online ? (
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-neon-blue rounded-full shadow-[0_0_5px_#00f0ff]" />
                                <span className="text-[10px] text-neon-blue font-mono tracking-tighter uppercase">Online</span>
                            </div>
                        ) : (
                            <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">Secured</span>
                        )}
                        <Shield size={10} className="text-gray-600" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 lg:gap-3">
                <button className="p-2.5 text-gray-400 hover:text-neon-blue hover:bg-white/5 rounded-xl transition-all">
                    <Phone size={18} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-neon-blue hover:bg-white/5 rounded-xl transition-all">
                    <Video size={18} />
                </button>
                <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <MoreVertical size={18} />
                </button>
            </div>
        </div>
    );
}
