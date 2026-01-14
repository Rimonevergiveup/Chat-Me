import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { messagesService } from '../services/messages.service';
import { conversationsService } from '../services/conversations.service';
import type { MessageWithSender, ConversationWithDetails } from '../types/database';
import { useAuth } from './AuthContext';

interface ChatContextType {
    activeConversation: ConversationWithDetails | null;
    messages: MessageWithSender[];
    loading: boolean;
    typingUsers: string[];
    setActiveConversation: (conversation: ConversationWithDetails | null) => void;
    sendMessage: (content: string, mediaUrl?: string) => Promise<void>;
    editMessage: (messageId: string, newContent: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;
    sendTypingIndicator: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [activeConversation, setActiveConversation] = useState<ConversationWithDetails | null>(null);
    const [messages, setMessages] = useState<MessageWithSender[]>([]);
    const [loading, setLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() => {
        if (activeConversation) {
            loadMessages();
            subscribeToMessages();
            subscribeToTyping();
            conversationsService.updateLastRead(activeConversation.id);
        } else {
            setMessages([]);
        }
    }, [activeConversation?.id]);

    const loadMessages = async () => {
        if (!activeConversation) return;

        setLoading(true);
        try {
            const data = await messagesService.getMessages(activeConversation.id);
            setMessages(data);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToMessages = () => {
        if (!activeConversation) return;

        const channel = supabase
            .channel(`messages:${activeConversation.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${activeConversation.id}`,
                },
                async (payload) => {
                    if (payload.eventType === 'INSERT') {
                        // Fetch full message with sender details
                        const { data } = await supabase
                            .from('messages')
                            .select('*, sender:sender_id(*)')
                            .eq('id', payload.new.id)
                            .single();

                        if (data) {
                            setMessages(prev => [...prev, { ...data, sender: data.sender as any }]);
                            conversationsService.updateLastRead(activeConversation.id);
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        setMessages(prev => prev.map(msg =>
                            msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
                        ));
                    } else if (payload.eventType === 'DELETE') {
                        setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    };

    const subscribeToTyping = () => {
        if (!activeConversation) return;

        const channel = supabase.channel(`typing:${activeConversation.id}`);

        channel
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                if (payload.userId !== user?.id) {
                    setTypingUsers(prev => {
                        if (!prev.includes(payload.userId)) {
                            return [...prev, payload.userId];
                        }
                        return prev;
                    });

                    // Remove typing indicator after 3 seconds
                    setTimeout(() => {
                        setTypingUsers(prev => prev.filter(id => id !== payload.userId));
                    }, 3000);
                }
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    };

    const sendMessage = async (content: string, mediaUrl?: string) => {
        if (!activeConversation || !content.trim()) return;

        try {
            await messagesService.sendMessage(
                activeConversation.id,
                content,
                mediaUrl ? 'image' : 'text',
                mediaUrl
            );
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };

    const editMessage = async (messageId: string, newContent: string) => {
        try {
            await messagesService.editMessage(messageId, newContent);
        } catch (error) {
            console.error('Error editing message:', error);
            throw error;
        }
    };

    const deleteMessage = async (messageId: string) => {
        try {
            await messagesService.deleteMessage(messageId);
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    };

    const sendTypingIndicator = () => {
        if (!activeConversation || !user) return;

        supabase.channel(`typing:${activeConversation.id}`).send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: user.id },
        });
    };

    return (
        <ChatContext.Provider value={{
            activeConversation,
            messages,
            loading,
            typingUsers,
            setActiveConversation,
            sendMessage,
            editMessage,
            deleteMessage,
            sendTypingIndicator,
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
