export function TypingIndicator() {
    return (
        <div className="flex items-center gap-2 px-6 py-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex gap-1">
                <span className="w-1 h-1 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-neon-blue rounded-full animate-bounce" />
            </div>
            <span className="text-[10px] font-mono text-neon-blue uppercase tracking-widest opacity-60">
                Incoming Signal...
            </span>
        </div>
    );
}
