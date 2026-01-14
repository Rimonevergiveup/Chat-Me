import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface SignUpProps {
    onSwitchToSignIn: () => void;
}

export function SignUp({ onSwitchToSignIn }: SignUpProps) {
    const { signUp } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        fullName: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await signUp(formData.email, formData.password, {
                username: formData.username,
                full_name: formData.fullName,
            });
            toast.success('Account created! Please check your email to verify.');
        } catch (error: any) {
            toast.error(error.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-display font-black text-white mb-2 text-center tracking-widest uppercase italic">
                Initialize Profile
            </h2>
            <p className="text-gray-500 text-xs text-center mb-8 font-mono uppercase tracking-tighter">
                Enter your identity for the Met-Galaxy network
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Pilot Name"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        placeholder="COMMANDER"
                    />

                    <Input
                        label="Callsign (Username)"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        placeholder="Viper-1"
                    />
                </div>

                <Input
                    label="Uplink ID (Email)"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="NAME@GALAXY.NODE"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Access Key"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        placeholder="••••••••"
                    />

                    <Input
                        label="Confirm Key"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        placeholder="••••••••"
                    />
                </div>

                <Button variant="primary" type="submit" className="w-full mt-4" disabled={loading}>
                    {loading ? 'INITIALIZING PROTOCOLS...' : 'DEPLOY TO ORBIT'}
                </Button>
            </form>

            <p className="mt-8 text-center text-xs text-gray-500 font-mono tracking-widest">
                ALREADY IN ORBIT?{' '}
                <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    className="text-neon-blue hover:text-white transition-colors font-bold uppercase"
                >
                    Establish Uplink
                </button>
            </p>
        </div>
    );
}
