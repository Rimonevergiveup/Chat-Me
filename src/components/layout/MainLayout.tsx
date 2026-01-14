import { useState, useEffect } from 'react';
import { ConversationsList } from '../conversations/ConversationsList';
import { NewConversationModal } from '../conversations/NewConversationModal';
import { ChatHeader } from '../chat/ChatHeader';
import { MessagesList } from '../chat/MessagesList';
import { MessageInput } from '../chat/MessageInput';
import { MessageSquare, MessageSquarePlus, Radio, Phone, Settings } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { ProfileView } from '../profile/ProfileView';
import { CallsView } from '../calls/CallsView';
import { GalaxyView } from '../galaxy/GalaxyView';
import { audioService } from '../../services/calls.service';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { IncomingCallModal } from '../calls/IncomingCallModal';

import { Starfield } from './Starfield';

type TabType = 'chats' | 'status' | 'calls' | 'profile';

export function MainLayout() {
    const { activeConversation } = useChat();
    const [activeTab, setActiveTab] = useState<TabType>('chats');
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [parallaxPos, setParallaxPos] = useState({ x: 0, y: 0 });
    const [incomingCall, setIncomingCall] = useState<any>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (activeConversation) {
            setActiveTab('chats');
        }
    }, [activeConversation]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setParallaxPos({ x, y });
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('incoming-calls')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'calls',
                    filter: `receiver_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.new.type === 'outgoing') { // It's outgoing from the sender's perspective
                        setIncomingCall(payload.new);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'chats':
                return (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-display font-black text-white tracking-[0.2em] uppercase italic">Chats</h2>
                            <button
                                onClick={() => setShowNewConversation(true)}
                                className="p-2 text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-all hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                            >
                                <MessageSquarePlus size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <ConversationsList />
                        </div>
                    </div>
                );
            case 'status':
                return <GalaxyView />;
            case 'calls':
                return <CallsView />;
            case 'profile':
                return <ProfileView onBack={() => setActiveTab('chats')} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen w-full relative p-0 lg:p-6 gap-6 overflow-hidden bg-void font-body">
            <Starfield />

            {/* Main Content Area with Parallax */}
            <div
                className="flex w-full h-full gap-6 transition-all duration-300 ease-out"
                style={{
                    transform: `translate3d(${parallaxPos.x}px, ${parallaxPos.y}px, 0)`
                }}
            >

                {/* Sidebar / Left Column */}
                <div className={cn(
                    "h-full flex flex-col glass-panel rounded-none lg:rounded-2xl overflow-hidden transition-all duration-500 z-30",
                    isMobile && activeConversation ? "hidden" : "flex",
                    isMobile ? "w-full" : "w-80"
                )}>
                    {/* Tab Content */}
                    <div className="flex-1 overflow-hidden">
                        {renderTabContent()}
                    </div>

                    {/* Navigation Bar */}
                    <div className="flex justify-around p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                        <button
                            onClick={() => {
                                setActiveTab('chats');
                                audioService.playWarp();
                            }}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                activeTab === 'chats' ? "text-neon-blue scale-110 drop-shadow-[0_0_8px_#00f0ff]" : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <MessageSquare size={20} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Chats</span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('status');
                                audioService.playWarp();
                            }}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                activeTab === 'status' ? "text-neon-blue scale-110 drop-shadow-[0_0_8px_#00f0ff]" : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <Radio size={20} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Stories</span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('calls');
                                audioService.playWarp();
                            }}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                activeTab === 'calls' ? "text-neon-blue scale-110 drop-shadow-[0_0_8px_#00f0ff]" : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <Phone size={20} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Calls</span>
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('profile');
                                audioService.playWarp();
                            }}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all duration-300",
                                activeTab === 'profile' ? "text-neon-blue scale-110 drop-shadow-[0_0_8px_#00f0ff]" : "text-gray-600 hover:text-gray-400"
                            )}
                        >
                            <Settings size={20} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Profile</span>
                        </button>
                    </div>
                </div>

                {/* Right Column / Chat Area */}
                <div className={cn(
                    "flex-1 h-full glass-panel rounded-none lg:rounded-2xl overflow-hidden flex flex-col relative transition-all duration-500",
                    isMobile && !activeConversation ? "hidden" : "flex",
                    !isMobile && !activeConversation ? "hidden lg:flex" : ""
                )}>
                    {activeConversation ? (
                        <>
                            <ChatHeader />
                            <MessagesList />
                            <MessageInput />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 pointer-events-none" />
                            <div className="w-24 h-24 rounded-full border-2 border-neon-blue/20 flex items-center justify-center mb-6 animate-float relative">
                                <div className="absolute inset-0 rounded-full border border-neon-blue/40 animate-pulse-glow" />
                                <Settings size={40} className="text-neon-blue opacity-50 animate-spin-slow" style={{ animationDuration: '10s' }} />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-wide uppercase">
                                Frequency Ready
                            </h2>
                            <p className="text-gray-400 max-w-md font-light text-sm">
                                Establish a secure connection from your transmission logs to begin messaging.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showNewConversation && (
                <NewConversationModal onClose={() => setShowNewConversation(false)} />
            )}

            {incomingCall && (
                <IncomingCallModal
                    callerName={incomingCall.caller_name}
                    callerAvatar={incomingCall.caller_avatar_url}
                    onAccept={() => {
                        setIncomingCall(null);
                        setActiveTab('calls');
                    }}
                    onDecline={() => setIncomingCall(null)}
                />
            )}
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
