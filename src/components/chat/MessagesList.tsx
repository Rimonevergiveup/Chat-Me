import { useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Settings } from 'lucide-react';

export function MessagesList() {
    const { messages, loading, activeConversation, typingUsers } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingUsers]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!activeConversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 pointer-events-none" />
                <div className="w-24 h-24 rounded-full border-2 border-neon-blue/20 flex items-center justify-center mb-6 animate-float relative">
                    <div className="absolute inset-0 rounded-full border border-neon-blue/40 animate-pulse-glow" />
                    <Settings size={40} className="text-neon-blue opacity-50 animate-spin-slow" style={{ animationDuration: '10s' }} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-wide uppercase">
                    Frequency Ready
                </h2>
                <p className="text-gray-400 max-w-md font-light text-sm text-center">
                    Establish a secure connection from your transmission logs to begin messaging.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-2 border-t-neon-blue border-white/5 rounded-full animate-spin" />
                <p className="text-[10px] font-mono text-neon-blue animate-pulse tracking-[0.3em] uppercase">Initializing Feed...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin bg-transparent">
            <div className="max-w-5xl mx-auto w-full flex flex-col">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mb-8" />
                        <p className="text-xs font-display text-gray-400 uppercase tracking-[0.3em]">No Historical Data</p>
                        <p className="text-[10px] font-mono text-gray-600 mt-2 uppercase">Awaiting first transmission packet</p>
                    </div>
                ) : (
                    <>
                        {messages.map(message => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        {typingUsers.length > 0 && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    );
}
