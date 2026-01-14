import { Avatar } from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { formatTimestamp } from '../../utils/helpers';
import type { ConversationWithDetails } from '../../types/database';

interface ConversationItemProps {
    conversation: ConversationWithDetails;
    onClick: () => void;
}

export function ConversationItem({ conversation, onClick }: ConversationItemProps) {
    const { user } = useAuth();

    // Get other participant (for one-on-one chats)
    const otherParticipant = conversation.participants?.find(p => p.id !== user?.id);

    const displayName = conversation.is_group
        ? conversation.name || 'Group Chat'
        : otherParticipant?.full_name || otherParticipant?.username || 'Unknown User';

    const displayAvatar = conversation.is_group
        ? conversation.avatar_url
        : otherParticipant?.avatar_url;

    const lastMessageText = conversation.last_message?.is_deleted
        ? 'Message deleted'
        : conversation.last_message?.content || 'No messages yet';

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 group transition-all duration-300 relative overflow-hidden"
        >
            <div className="absolute inset-y-0 left-0 w-1 bg-neon-blue transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

            <div className="relative">
                <Avatar
                    src={displayAvatar}
                    name={displayName}
                    size="md"
                    isOnline={!conversation.is_group && otherParticipant?.is_online}
                />
                {!conversation.is_group && otherParticipant?.is_online && (
                    <div className="absolute inset-0 rounded-full border border-neon-blue/40 animate-pulse" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display font-bold text-sm text-white tracking-wide truncate group-hover:text-neon-blue transition-colors">
                        {displayName}
                    </h3>
                    {conversation.last_message && (
                        <span className="text-[10px] text-gray-500 font-mono">
                            {formatTimestamp(conversation.last_message.created_at)}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate font-light italic">
                        {lastMessageText}
                    </p>
                    {conversation.unread_count && conversation.unread_count > 0 && (
                        <div className="bg-neon-blue/20 text-neon-blue text-[10px] font-bold rounded-full px-2 py-0.5 shadow-[0_0_10px_rgba(0,240,255,0.2)] border border-neon-blue/30">
                            {conversation.unread_count}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
