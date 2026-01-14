import { supabase } from '../lib/supabase';
import type { Message, MessageWithSender } from '../types/database';

export const messagesService = {
    async getMessages(conversationId: string, limit = 50, offset = 0): Promise<MessageWithSender[]> {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*, sender:sender_id(*), reads:message_reads(*)')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;

        return (messages || []).map(msg => ({
            ...msg,
            sender: (msg.sender as any),
            reads: (msg.reads as any) || [],
        })).reverse();
    },

    async sendMessage(
        conversationId: string,
        content: string,
        type: Message['message_type'] = 'text',
        mediaUrl?: string
    ): Promise<Message> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: message, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content,
                message_type: type,
                media_url: mediaUrl || null,
            })
            .select()
            .single();

        if (error) throw error;

        // Update conversation's updated_at
        await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);

        return message;
    },

    async editMessage(messageId: string, newContent: string) {
        const { error } = await supabase
            .from('messages')
            .update({
                content: newContent,
                is_edited: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', messageId);

        if (error) throw error;
    },

    async deleteMessage(messageId: string) {
        const { error } = await supabase
            .from('messages')
            .update({
                is_deleted: true,
                content: null,
                media_url: null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', messageId);

        if (error) throw error;
    },

    async markAsRead(messageId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('message_reads')
            .insert({ message_id: messageId, user_id: user.id })
            .select();

        if (error && !error.message.includes('duplicate')) throw error;
    },
};
