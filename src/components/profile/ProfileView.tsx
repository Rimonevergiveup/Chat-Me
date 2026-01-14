import { Avatar } from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import {
    Moon,
    Rocket,
    Shield,
    Image as ImageIcon,
    Cloud,
    ChevronRight,
    LogOut,
    ChevronLeft,
    Edit2,
    Camera,
    Save
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { mediaService } from '../../services/media.service';
import { signalsService } from '../../services/signals.service';
import toast from 'react-hot-toast';

interface ProfileViewProps {
    onBack?: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
    const { profile, signOut } = useAuth();
    const [subView, setSubView] = useState<'default' | 'privacy' | 'gallery'>('default');
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [userGallery, setUserGallery] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [darkMode, setDarkMode] = useState(true);
    const [antiGravity, setAntiGravity] = useState(true);

    useEffect(() => {
        if (subView === 'gallery') {
            loadUserGallery();
        }
    }, [subView]);

    const loadUserGallery = async () => {
        try {
            const data = await signalsService.getUserSignals();
            setUserGallery(data);
        } catch (error) {
            console.error('Gallery failed:', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await authService.updateProfile({ full_name: fullName });
            setIsEditing(false);
            toast.success('Pilot Data Updated');
        } catch (error) {
            toast.error('Uplink Interrupted');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await mediaService.uploadFile(file, 'avatars');
            await authService.updateProfile({ avatar_url: url });
            toast.success('Visual Protocol Updated');
        } catch (error) {
            toast.error('Scan Failed');
        } finally {
            setIsUploading(false);
        }
    };

    const menuItems = [
        { icon: Shield, label: 'Privacy & Security', color: 'text-gray-400', view: 'privacy' },
        { icon: ImageIcon, label: 'Nebula Gallery', color: 'text-gray-400', view: 'gallery' },
        { icon: Cloud, label: 'Floating Storage', subLabel: '85% Full', color: 'text-gray-400', badgeColor: 'text-neon-blue' },
    ];

    if (subView === 'privacy') {
        return (
            <div className="flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="p-6 flex items-center gap-4 border-b border-white/10">
                    <button onClick={() => setSubView('default')} className="p-2 text-white hover:bg-white/5 rounded-full">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-display font-black text-white tracking-[0.2em] uppercase italic">Security Shield</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border-white/10 bg-white/[0.02]">
                        <div className="flex items-center gap-4 mb-4">
                            <Shield className="text-neon-blue" size={24} />
                            <span className="text-sm font-display text-white uppercase tracking-widest">Active Protocols</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 font-mono uppercase">Encryption</span>
                                <span className="text-green-500 font-mono font-bold">SHA-256 QUANTUM</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 font-mono uppercase">RLS Status</span>
                                <span className="text-neon-blue font-mono font-bold">LOCKED</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border-white/10 bg-white/[0.02]">
                        <h3 className="text-[10px] font-mono font-black text-gray-600 tracking-[0.3em] uppercase mb-4">Active Sessions</h3>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-white font-mono uppercase leading-none">Current Terminal</span>
                            </div>
                            <span className="text-[10px] text-gray-700 font-mono">ID: {profile?.id?.slice(0, 8)}...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (subView === 'gallery') {
        return (
            <div className="flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-500">
                <div className="p-6 flex items-center gap-4 border-b border-white/10">
                    <button onClick={() => setSubView('default')} className="p-2 text-white hover:bg-white/5 rounded-full">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-display font-black text-white tracking-[0.2em] uppercase italic">Media Gallery</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {userGallery.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 opacity-20">
                            <ImageIcon size={48} className="mb-4" />
                            <p className="text-[10px] font-display tracking-widest uppercase text-center">No visual data packets found in cache</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {userGallery.map((sig) => (
                                <div key={sig.id} className="aspect-square glass-panel overflow-hidden rounded-xl border-white/10 relative group">
                                    <img src={sig.media_url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <span className="text-[8px] font-mono text-white/50">{new Date(sig.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {/* Header */}
            <div className="p-6 flex items-center justify-between relative z-10">
                <button onClick={onBack} className="p-2 text-white hover:bg-white/5 rounded-full lg:hidden">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-xl font-display font-black text-white tracking-[0.2em] uppercase italic">Profile</h2>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-neon-blue hover:bg-neon-blue/10 rounded-full transition-all"
                        >
                            <Edit2 size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="p-2 text-green-400 hover:bg-green-400/10 rounded-full transition-all"
                        >
                            {isSaving ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-8 relative z-10">
                {/* User Info Card */}
                <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="relative mb-6 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="absolute -inset-6 bg-neon-blue/20 rounded-full blur-3xl group-hover:bg-neon-blue/30 transition-all duration-700 animate-pulse" />
                        <div className="relative">
                            <Avatar
                                src={profile?.avatar_url}
                                name={profile?.full_name || 'Pilot'}
                                size="xl"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-neon-blue/50">
                                {isUploading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="text-white" size={24} />}
                            </div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-void rounded-full shadow-[0_0_15px_#22c55e]" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </div>

                    {isEditing ? (
                        <div className="w-full max-w-xs space-y-3">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center text-white font-display focus:border-neon-blue/50 focus:outline-none transition-all"
                                placeholder="PILOT NAME"
                            />
                            <p className="text-gray-500 text-xs font-mono tracking-widest uppercase opacity-60">Identity Logic 2.1</p>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-display font-black text-white tracking-widest mb-1 italic uppercase">
                                {profile?.full_name || 'User'}
                            </h1>
                            <p className="text-neon-blue/60 text-xs mb-2 font-mono tracking-[0.4em] uppercase">Identity Verified</p>
                        </>
                    )}
                </div>

                {/* Status Section */}
                <div className="glass-panel p-4 rounded-2xl border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Network Status</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-600 font-mono uppercase mb-1">Total Uplinks</p>
                            <p className="text-xl font-display text-white">1,204</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-600 font-mono uppercase mb-1">Signal Strength</p>
                            <p className="text-xl font-display text-green-400">98%</p>
                        </div>
                    </div>
                </div>

                {/* Visuals Section */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-mono font-bold text-gray-600 tracking-[0.3em] uppercase px-2 italic">Physical Layer</h3>
                    <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border-white/10">
                        <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-neon-blue/10 rounded-xl text-neon-blue">
                                    <Moon size={18} />
                                </div>
                                <span className="text-gray-300 text-sm font-medium tracking-wide uppercase">Dark Mode Protocol</span>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${darkMode ? 'bg-neon-blue' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-[0_0_10px_white] ${darkMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-neon-purple/10 rounded-xl text-neon-purple">
                                    <Rocket size={18} />
                                </div>
                                <span className="text-gray-300 text-sm font-medium tracking-wide uppercase">Anti-gravity Physics</span>
                            </div>
                            <button
                                onClick={() => setAntiGravity(!antiGravity)}
                                className={`w-12 h-6 rounded-full transition-all duration-300 relative ${antiGravity ? 'bg-neon-purple' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-[0_0_10px_white] ${antiGravity ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-mono font-bold text-gray-600 tracking-[0.3em] uppercase px-2 italic">Sub-Systems</h3>
                    <div className="glass-panel rounded-2xl overflow-hidden divide-y divide-white/5 border-white/10">
                        {menuItems.map((item, idx) => (
                            <div key={idx}
                                onClick={() => item.view && setSubView(item.view as any)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 bg-white/5 rounded-xl ${item.color}`}>
                                        <item.icon size={18} />
                                    </div>
                                    <span className="text-gray-300 text-sm font-medium uppercase tracking-wide">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.subLabel && (
                                        <span className={`text-[10px] font-bold ${item.badgeColor} font-mono animate-pulse`}>{item.subLabel}</span>
                                    )}
                                    <ChevronRight size={16} className="text-gray-700 group-hover:text-neon-blue transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disconnect Button */}
                <button
                    onClick={signOut}
                    className="w-full py-5 glass-panel border-red-500/30 rounded-2xl flex items-center justify-center gap-3 text-red-500 font-display font-black tracking-[0.3em] uppercase hover:bg-red-500/10 hover:border-red-500/60 transition-all duration-500 group"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Disconnect From Orbit</span>
                </button>
            </div>

            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-neon-blue/5 blur-[120px] pointer-events-none" />
        </div>
    );
}
