import { useState } from 'react';
import { X, Search, Phone, MessageCircle } from 'lucide-react';
import { usersService } from '../../services/users.service';
import { useConversations } from '../../contexts/ConversationsContext';
import { useChat } from '../../contexts/ChatContext';
import { Avatar } from '../common/Avatar';
import type { Profile } from '../../types/database';
import { callsService } from '../../services/calls.service';
import toast from 'react-hot-toast';

interface NewConversationModalProps {
    onClose: () => void;
}

export function NewConversationModal({ onClose }: NewConversationModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const { createConversation } = useConversations();
    const { setActiveConversation } = useChat();

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const results = await usersService.searchUsers(query);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching users:', error);
            toast.error('Failed to search users');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = async (userId: string) => {
        try {
            const conversation = await createConversation([userId], false);
            setActiveConversation(conversation);
            onClose();
            toast.success('Chat established!');
        } catch (error) {
            console.error('Error creating conversation:', error);
            toast.error('Failed to establish connection');
        }
    };

    const handleCallUser = async (user: Profile) => {
        try {
            await callsService.addCall(
                user.full_name || user.username,
                'outgoing',
                user.id,
                user.avatar_url || ''
            );
            toast.success(`Calling ${user.full_name || user.username}...`);
            onClose();
        } catch (error) {
            console.error('Error creating call:', error);
            toast.error('Call initialization failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-panel rounded-3xl shadow-2xl w-full max-w-md border border-white/10 relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-display font-black text-white tracking-widest uppercase italic">Start Connection</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-white/10 bg-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-blue w-4 h-4 opacity-50" />
                        <input
                            type="text"
                            placeholder="Search by name or username..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all font-body text-sm text-white placeholder:text-gray-600"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 gap-4">
                            <div className="w-10 h-10 border-2 border-t-neon-blue border-white/5 rounded-full animate-spin" />
                            <p className="text-[10px] font-mono text-neon-blue animate-pulse tracking-widest uppercase text-center leading-relaxed">Scanning Frequency...</p>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="p-12 text-center">
                            <Search size={40} className="mx-auto text-gray-700 mb-4 opacity-20" />
                            <p className="text-xs font-display text-gray-500 uppercase tracking-[0.2em]">
                                {searchQuery ? 'User Not Found' : 'Find Someone'}
                            </p>
                            <p className="text-[10px] font-mono text-gray-600 mt-1 uppercase">
                                {searchQuery ? 'Unable to resolve identity' : 'Search for a pilot to connect'}
                            </p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {searchResults.map(user => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 cursor-pointer transition-all border-l-2 border-transparent hover:border-neon-blue group"
                                >
                                    <div className="relative" onClick={() => handleSelectUser(user.id)}>
                                        <Avatar src={user.avatar_url} name={user.full_name || user.username} size="md" />
                                        <div className="absolute inset-0 rounded-full border border-neon-blue opacity-0 group-hover:opacity-40 animate-pulse transition-opacity" />
                                    </div>
                                    <div className="flex-1" onClick={() => handleSelectUser(user.id)}>
                                        <h3 className="font-display font-bold text-white text-sm tracking-wide">{user.full_name}</h3>
                                        <p className="text-xs text-neon-blue opacity-60 font-mono">@{user.username}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCallUser(user); }}
                                            className="p-2.5 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all transform hover:scale-110"
                                            title="Call User"
                                        >
                                            <Phone size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleSelectUser(user.id)}
                                            className="p-2.5 bg-neon-blue/10 text-neon-blue rounded-xl hover:bg-neon-blue hover:text-white transition-all transform hover:scale-110"
                                            title="Message User"
                                        >
                                            <MessageCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
