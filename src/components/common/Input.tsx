import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-display font-bold text-gray-400 mb-2 tracking-[0.2em] uppercase">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-3 glass-panel border-white/10 bg-white/5 rounded-xl focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all font-body text-sm text-white placeholder:text-gray-700',
                        error && 'border-red-500/50 focus:border-red-500/50 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-[10px] font-mono text-red-500 uppercase tracking-tighter">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
