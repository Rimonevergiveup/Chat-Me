import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'neon' | 'glass';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}: ButtonProps) {
    const baseClasses = 'font-display font-bold rounded-xl transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-neon-blue text-void shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'bg-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.4)] hover:scale-[1.02] active:scale-[0.98]',
        neon: 'border border-neon-blue/50 text-neon-blue bg-neon-blue/5 hover:bg-neon-blue/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]',
        glass: 'glass-panel border-white/10 text-white hover:bg-white/5',
        ghost: 'bg-transparent text-gray-500 hover:text-white hover:bg-white/5',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
