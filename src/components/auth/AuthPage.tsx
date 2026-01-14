import { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { Orbit, Sparkles, Shield, Rocket } from 'lucide-react';

export function AuthPage() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');

    return (
        <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-blue rounded-full blur-[180px] opacity-[0.07] animate-float" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-neon-purple rounded-full blur-[180px] opacity-[0.07] animate-float" style={{ animationDelay: '3s' }} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/starlight.png')] opacity-10" />
            </div>

            <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20 z-10">
                {/* Left side - Branding */}
                <div className="hidden lg:flex flex-1 flex-col items-start">
                    <div className="flex items-center gap-3 mb-8 group">
                        <div className="p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-2xl group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all">
                            <Orbit size={48} className="text-neon-blue animate-spin-slow" />
                        </div>
                        <h1 className="text-7xl font-display font-black text-white tracking-widest uppercase italic">
                            MET<span className="text-neon-blue">-</span>ME
                        </h1>
                    </div>

                    <p className="text-2xl text-gray-400 mb-10 font-light tracking-wide max-w-md">
                        The protocol for <span className="text-white font-medium">interstellar</span> communication and secure data sync.
                    </p>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 glass-panel border-white/10 rounded-xl flex items-center justify-center text-neon-blue group-hover:border-neon-blue/50 transition-all">
                                <Shield size={22} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider">End-to-End Encryption</h3>
                                <p className="text-xs text-gray-500">Your transmissions are secured by quantum-ready protocols.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 glass-panel border-white/10 rounded-xl flex items-center justify-center text-neon-purple group-hover:border-neon-purple/50 transition-all">
                                <Sparkles size={22} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Met-Galaxy Sync</h3>
                                <p className="text-xs text-gray-500">Seamless communication across all your planetary nodes.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 glass-panel border-white/10 rounded-xl flex items-center justify-center text-neon-blue group-hover:border-neon-blue/50 transition-all">
                                <Rocket size={22} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Anti-Gravity Speed</h3>
                                <p className="text-xs text-gray-500">Zero-latency transmissions delivered via light-speed relays.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Auth forms */}
                <div className="w-full lg:flex-1 max-w-md lg:max-w-none">
                    <div className="glass-panel p-8 lg:p-12 rounded-3xl border border-white/10 relative overflow-hidden backdrop-blur-2xl">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                            <Orbit size={32} className="text-neon-blue animate-spin-slow" />
                            <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase italic">
                                MET-ME
                            </h1>
                        </div>

                        {mode === 'signin' ? (
                            <SignIn onSwitchToSignUp={() => setMode('signup')} />
                        ) : (
                            <SignUp onSwitchToSignIn={() => setMode('signin')} />
                        )}

                        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl" />
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}
