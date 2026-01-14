import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { conversationsService } from '../services/conversations.service';
import type { ConversationWithDetails } from '../types/database';
import { useAuth } from './AuthContext';

interface ConversationsContextType {
    conversations: ConversationWithDetails[];
    loading: boolean;
    createConversation: (participantIds: string[], isGroup: boolean, name?: string) => Promise<ConversationWithDetails>;
    refreshConversations: () => Promise<void>;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadConversations();
            subscribeToConversations();
        } else {
            setConversations([]);
            setLoading(false);
        }
    }, [user]);

    const loadConversations = async () => {
        try {
            const data = await conversationsService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToConversations = () => {
        // Subscribe to new messages to update conversation list
        const channel = supabase
            .channel('conversations-updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                },
                () => {
                    loadConversations();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                },
                () => {
                    loadConversations();
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    };

    const createConversation = async (participantIds: string[], isGroup: boolean, name?: string) => {
        const conversation = await conversationsService.createConversation(participantIds, isGroup, name);
        await loadConversations();
        const fullConversation = conversations.find(c => c.id === conversation.id);
        return fullConversation || conversation as ConversationWithDetails;
    };

    const refreshConversations = async () => {
        await loadConversations();
    };

    return (
        <ConversationsContext.Provider value={{ conversations, loading, createConversation, refreshConversations }}>
            {children}
        </ConversationsContext.Provider>
    );
}

export function useConversations() {
    const context = useContext(ConversationsContext);
    if (context === undefined) {
        throw new Error('useConversations must be used within a ConversationsProvider');
    }
    return context;
}
