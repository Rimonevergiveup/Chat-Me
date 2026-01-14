import { X, Download } from 'lucide-react';
import { useEffect } from 'react';

interface LightboxProps {
    src: string;
    onClose: () => void;
}

export function Lightbox({ src, onClose }: LightboxProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Content Container */}
            <div className="relative max-w-7xl max-h-full flex flex-col items-center animate-in zoom-in-95 duration-500">
                {/* Header Actions */}
                <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-neon-blue uppercase tracking-widest opacity-60">Visual Data Packet</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="p-2 text-white/60 hover:text-neon-blue transition-colors"
                            onClick={() => window.open(src, '_blank')}
                        >
                            <Download size={20} />
                        </button>
                        <button
                            className="p-2 text-white/60 hover:text-red-400 transition-colors"
                            onClick={onClose}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Image Panel */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue/20 via-transparent to-neon-purple/20 blur opacity-50" />
                    <img
                        src={src}
                        alt="Enlarged packet"
                        className="relative rounded-lg shadow-2xl border border-white/10 max-h-[80vh] object-contain"
                    />

                    {/* HUD Overlays */}
                    <div className="absolute top-4 left-4 border-t border-l border-neon-blue/40 w-8 h-8 pointer-events-none" />
                    <div className="absolute top-4 right-4 border-t border-r border-neon-blue/40 w-8 h-8 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 border-b border-l border-neon-blue/40 w-8 h-8 pointer-events-none" />
                    <div className="absolute bottom-4 right-4 border-b border-r border-neon-blue/40 w-8 h-8 pointer-events-none" />
                </div>

                {/* Footer Info */}
                <div className="mt-6 flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                        <span className="w-1 h-1 bg-neon-blue rounded-full opacity-40" />
                        <span className="w-1 h-1 bg-neon-blue rounded-full opacity-60" />
                        <span className="w-1 h-1 bg-neon-blue rounded-full animate-pulse" />
                    </div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">Transmission Decrypted</p>
                </div>
            </div>
        </div>
    );
}
