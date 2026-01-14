import { useState, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { Send, Paperclip, Smile } from 'lucide-react';
import { mediaService } from '../../services/media.service';
import { audioService } from '../../services/calls.service';
import toast from 'react-hot-toast';

export function MessageInput() {
    const { sendMessage, sendTypingIndicator, activeConversation } = useChat();
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim() || !activeConversation) return;

        try {
            audioService.playSend();
            const textToSend = message;
            setMessage(''); // Optimistic clear
            await sendMessage(textToSend);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        } else {
            sendTypingIndicator();
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('Packet size limit exceeded (10MB)');
            return;
        }

        setUploading(true);
        try {
            audioService.playWarp();
            const url = await mediaService.uploadFile(file, 'chat-media');
            await sendMessage(file.type.startsWith('image/') ? 'Image Attachment' : 'File Attachment', url);
            toast.success('Upload successful');
        } catch (error) {
            console.error('Error uploading:', error);
            toast.error('Upload interrupted');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (!activeConversation) return null;

    return (
        <div className="p-4 lg:p-6 bg-transparent animate-in slide-in-from-bottom-2 duration-500">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 glass-panel p-2 rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="p-3 bg-white/5 hover:bg-white/10 hover:text-neon-blue rounded-xl transition-all duration-300 text-gray-400 border border-white/5"
                >
                    {uploading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-neon-blue border-t-transparent" />
                    ) : (
                        <Paperclip size={20} />
                    )}
                </button>

                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 resize-none max-h-32 font-body text-sm text-white placeholder:text-gray-700 scrollbar-none"
                        rows={1}
                    />
                </div>

                <div className="flex items-center gap-1 pr-2">
                    <button
                        type="button"
                        className="p-2 text-gray-700 hover:text-neon-purple transition-colors hidden sm:block"
                    >
                        <Smile size={20} />
                    </button>

                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className={`p-3 rounded-xl transition-all duration-300 border ${message.trim()
                            ? 'bg-neon-blue text-void border-neon-blue shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95'
                            : 'bg-white/5 text-gray-800 border-white/5 cursor-not-allowed'
                            }`}
                    >
                        <Send size={20} className={message.trim() ? "fill-void" : ""} />
                    </button>
                </div>
            </form>
        </div>
    );
}
