import type { HTMLAttributes, ReactNode } from 'react';
import './Badge.css';

type BadgeVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: BadgeVariant;
}

function Badge({
                   children,
                   variant = 'default',
                   className = '',
                   ...props
               }: BadgeProps) {
    return (
        <span
            {...props}
            className={`prc-badge prc-badge--${variant} ${className}`.trim()}
        >
      {children}
    </span>
    );
}

export default Badge;