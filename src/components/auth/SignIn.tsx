import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface SignInProps {
    onSwitchToSignUp: () => void;
}

export function SignIn({ onSwitchToSignUp }: SignInProps) {
    const { signIn } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            await signIn(formData.email, formData.password);
            toast.success('Welcome back!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-display font-black text-white mb-2 text-center tracking-widest uppercase italic">
                Authorized Access
            </h2>
            <p className="text-gray-500 text-xs text-center mb-8 font-mono uppercase tracking-tighter">
                Enter credentials for secure uplink
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Identification (Email)"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="NAME@GALAXY.NODE"
                />

                <Input
                    label="Access Key (Password)"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                />

                <Button variant="primary" type="submit" className="w-full" disabled={loading}>
                    {loading ? 'INITIALIZING...' : 'ESTABLISH UPLINK'}
                </Button>
            </form>

            <p className="mt-8 text-center text-xs text-gray-500 font-mono tracking-widest">
                NEW PILOT?{' '}
                <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="text-neon-blue hover:text-white transition-colors font-bold uppercase"
                >
                    Create Profile
                </button>
            </p>
        </div>
    );
}
