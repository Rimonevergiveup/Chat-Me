import { useConversations } from '../../contexts/ConversationsContext';
import { useChat } from '../../contexts/ChatContext';
import { ConversationItem } from './ConversationItem.tsx';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function ConversationsList() {
    const { conversations, loading } = useConversations();
    const { setActiveConversation } = useChat();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = conversations.filter(conv => {
        const searchLower = searchQuery.toLowerCase();
        const convName = conv.name || conv.participants?.[0]?.full_name || '';
        return convName.toLowerCase().includes(searchLower);
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-neon-blue rounded-full blur-xl opacity-20 animate-pulse" />
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-neon-blue relative" />
                </div>
                <span className="text-[10px] font-display font-bold text-neon-blue tracking-widest animate-pulse">SCANNING FREQUENCIES...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="p-4 border-b border-white/5">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search transmissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 glass-panel border-white/5 bg-white/5 rounded-xl focus:outline-none focus:border-neon-blue/50 transition-all font-body text-sm text-white placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4 opacity-50">
                        <div className="w-12 h-12 rounded-full border border-dashed border-gray-600 flex items-center justify-center">
                            <Search className="text-gray-600" size={24} />
                        </div>
                        <div>
                            <p className="text-white font-display text-xs tracking-widest uppercase">No Signals Found</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Start a new transmission to establish connection</p>
                        </div>
                    </div>
                ) : (
                    filteredConversations.map(conversation => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            onClick={() => setActiveConversation(conversation)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
