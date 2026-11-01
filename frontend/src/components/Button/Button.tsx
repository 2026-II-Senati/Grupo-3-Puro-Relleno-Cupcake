import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
}

function Button({
                    children,
                    variant = 'primary',
                    isLoading = false,
                    disabled = false,
                    className = '',
                    type = 'button',
                    ...props
                }: ButtonProps) {
    return (
        <button
            {...props}
            type={type}
            className={`prc-button prc-button--${variant} ${className}`.trim()}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
        >
            {isLoading ? 'Cargando...' : children}
        </button>
    );
}

export default Button;