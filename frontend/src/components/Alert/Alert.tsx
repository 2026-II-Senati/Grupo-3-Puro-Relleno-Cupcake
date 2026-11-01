import type { HTMLAttributes, ReactNode } from 'react';
import './Alert.css';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    children: ReactNode;
    variant?: AlertVariant;
}

function Alert({
                   title,
                   children,
                   variant = 'info',
                   className = '',
                   role,
                   ...props
               }: AlertProps) {
    const alertRole =
        role ?? (variant === 'error' || variant === 'warning'
            ? 'alert'
            : 'status');

    return (
        <div
            {...props}
            role={alertRole}
            className={`prc-alert prc-alert--${variant} ${className}`.trim()}
        >
            {title && (
                <strong className="prc-alert__title">
                    {title}
                </strong>
            )}

            <div className="prc-alert__content">
                {children}
            </div>
        </div>
    );
}

export default Alert;