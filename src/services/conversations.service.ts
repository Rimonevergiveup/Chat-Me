import { supabase } from '../lib/supabase';
import type { Conversation, ConversationWithDetails } from '../types/database';

export const conversationsService = {
    async getConversations(): Promise<ConversationWithDetails[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('conversation_participants')
            .select(`
        conversation_id,
        conversations:conversation_id (
          id,
          name,
          is_group,
          avatar_url,
          created_by,
          created_at,
          updated_at
        )
      `)
            .eq('user_id', user.id);

        if (error) throw error;

        const conversationIds = data?.map(cp => cp.conversation_id) || [];
        if (conversationIds.length === 0) return [];

        // Get participants for each conversation
        const { data: participants } = await supabase
            .from('conversation_participants')
            .select('conversation_id, user_id, profiles:user_id(*)')
            .in('conversation_id', conversationIds);

        // Get last message for each conversation
        const { data: lastMessages } = await supabase
            .from('messages')
            .select('*')
            .in('conversation_id', conversationIds)
            .order('created_at', { ascending: false });

        const conversations = data?.map(cp => {
            const conv = (cp.conversations as any) as Conversation;
            const convParticipants = participants?.filter(p => p.conversation_id === conv.id) || [];
            const lastMessage = lastMessages?.find(m => m.conversation_id === conv.id);

            return {
                ...conv,
                participants: convParticipants.map(p => (p.profiles as any)),
                last_message: lastMessage,
            };
        }) || [];

        return conversations;
    },

    async createConversation(participantIds: string[], isGroup: boolean, name?: string): Promise<Conversation> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if one-on-one conversation already exists
        if (!isGroup && participantIds.length === 1) {
            const existingConv = await this.findOneOnOneConversation(participantIds[0]);
            if (existingConv) return existingConv;
        }

        const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .insert({
                name: name || null,
                is_group: isGroup,
                created_by: user.id,
            })
            .select()
            .single();

        if (convError) throw convError;

        // Add current user as admin
        const participants = [
            { conversation_id: conversation.id, user_id: user.id, role: 'admin' },
            ...participantIds.map(id => ({
                conversation_id: conversation.id,
                user_id: id,
                role: 'member' as const
            })),
        ];

        const { error: participantsError } = await supabase
            .from('conversation_participants')
            .insert(participants);

        if (participantsError) throw participantsError;

        return conversation;
    },

    async findOneOnOneConversation(otherUserId: string): Promise<Conversation | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', user.id);

        if (!data || data.length === 0) return null;

        const conversationIds = data.map(cp => cp.conversation_id);

        const { data: otherUserConvs } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', otherUserId)
            .in('conversation_id', conversationIds);

        if (!otherUserConvs || otherUserConvs.length === 0) return null;

        const sharedConvIds = otherUserConvs.map(cp => cp.conversation_id);

        const { data: conversation } = await supabase
            .from('conversations')
            .select('*')
            .eq('is_group', false)
            .in('id', sharedConvIds)
            .limit(1)
            .single();

        return conversation;
    },

    async getConversationById(id: string): Promise<ConversationWithDetails | null> {
        const { data: conversation, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        const { data: participants } = await supabase
            .from('conversation_participants')
            .select('*, profiles:user_id(*)')
            .eq('conversation_id', id);

        return {
            ...conversation,
            participants: participants?.map(p => (p.profiles as any)) || [],
        };
    },

    async deleteConversation(id: string) {
        const { error } = await supabase
            .from('conversations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async updateLastRead(conversationId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('conversation_participants')
            .update({ last_read_at: new Date().toISOString() })
            .eq('conversation_id', conversationId)
            .eq('user_id', user.id);

        if (error) throw error;
    },
};
