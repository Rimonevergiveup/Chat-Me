import { MessageSquare, Orbit, Phone, User } from 'lucide-react';
import { cn } from '../../utils/helpers';

export type TabType = 'chats' | 'status' | 'calls' | 'profile';

interface BottomNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'chats', label: 'CHATS', icon: MessageSquare },
        { id: 'status', label: 'GALAXY', icon: Orbit },
        { id: 'calls', label: 'CALLS', icon: Phone },
        { id: 'profile', label: 'PROFILE', icon: User },
    ];

    return (
        <div className="glass-panel mt-auto rounded-t-2xl px-6 py-3 flex items-center justify-between border-t border-white/10 z-50">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex flex-col items-center gap-1 transition-all duration-300 relative group",
                            isActive ? "text-neon-blue scale-110" : "text-gray-500 hover:text-gray-300"
                        )}
                    >
                        <div className={cn(
                            "p-1 rounded-full transition-all duration-300",
                            isActive && "bg-neon-blue/10 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                        )}>
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={cn(
                            "text-[10px] font-display tracking-widest font-bold",
                            isActive ? "opacity-100" : "opacity-60"
                        )}>
                            {tab.label}
                        </span>

                        {isActive && (
                            <div className="absolute -top-1 w-1 h-1 bg-neon-blue rounded-full shadow-[0_0_8px_#00f0ff]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
