import { Avatar } from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { formatMessageTime } from '../../utils/helpers';
import type { MessageWithSender } from '../../types/database';

interface MessageBubbleProps {
    message: MessageWithSender;
}

import { useState } from 'react';
import { Lightbox } from '../common/Lightbox';
import { Maximize2, Check, CheckCheck } from 'lucide-react';

export function MessageBubble({ message }: MessageBubbleProps) {
    const { user } = useAuth();
    const isOwn = message.sender_id === user?.id;
    const [showLightbox, setShowLightbox] = useState(false);

    if (message.is_deleted) {
        return (
            <div className="flex items-center justify-center my-2">
                <span className="text-sm text-gray-400 italic">Message deleted</span>
            </div>
        );
    }

    return (
        <div className={`flex items-end gap-3 mb-6 ${isOwn ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {!isOwn && (
                <div className="relative mb-1">
                    <Avatar
                        src={message.sender?.avatar_url}
                        name={message.sender?.full_name || message.sender?.username}
                        size="sm"
                    />
                    <div className="absolute inset-0 rounded-full border border-neon-blue/30 animate-pulse" />
                </div>
            )}

            <div className={`flex flex-col max-w-[80%] lg:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                {!isOwn && (
                    <span className="text-[10px] font-display font-bold text-gray-500 mb-1.5 px-3 tracking-[0.2em] uppercase italic">
                        {message.sender?.full_name || message.sender?.username}
                    </span>
                )}

                <div
                    className={`${isOwn ? 'message-bubble-user' : 'message-bubble-friend'} px-4 py-3 relative overflow-hidden group/bubble transition-all border border-white/5 hover:border-white/10`}
                >
                    {message.message_type === 'image' && message.media_url && (
                        <div
                            className="rounded-lg overflow-hidden border border-white/10 mb-2 relative group/img cursor-pointer"
                            onClick={() => setShowLightbox(true)}
                        >
                            <img
                                src={message.media_url}
                                alt="Shared image"
                                className="max-w-full transition-transform duration-500 group-hover/img:scale-105"
                            />
                            <div className="absolute inset-0 bg-neon-blue/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-void/80 border border-neon-blue/40 flex items-center justify-center text-neon-blue">
                                    <Maximize2 size={14} />
                                </div>
                            </div>
                        </div>
                    )}

                    <p className={`font-body text-sm leading-relaxed relative z-10 ${isOwn ? 'text-white' : 'text-gray-200'}`}>
                        {message.content}
                    </p>

                    <div className={`flex items-center gap-2 justify-end mt-2 opacity-60 relative z-10`}>
                        <span className="text-[10px] font-mono tracking-tighter">
                            {formatMessageTime(message.created_at)}
                        </span>
                        {isOwn && (
                            <span className="text-neon-blue">
                                {message.reads && message.reads.length > 0 ? (
                                    <CheckCheck size={12} className="drop-shadow-[0_0_2px_#00f0ff]" />
                                ) : (
                                    <Check size={12} />
                                )}
                            </span>
                        )}
                    </div>

                    {/* Subtle Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-scanline" />
                </div>

                {message.is_edited && (
                    <span className="text-[9px] text-gray-700 mt-1.5 px-3 font-mono uppercase tracking-[0.2em]">Edited</span>
                )}
            </div>

            {showLightbox && message.media_url && (
                <Lightbox src={message.media_url} onClose={() => setShowLightbox(false)} />
            )}
        </div>
    );
}
