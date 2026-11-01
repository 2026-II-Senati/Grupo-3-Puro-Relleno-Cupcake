import type { HTMLAttributes, ReactNode } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    heading?: string;
    description?: string;
    footer?: ReactNode;
    children: ReactNode;
}

function Card({
                  heading,
                  description,
                  footer,
                  children,
                  className = '',
                  ...props
              }: CardProps) {
    return (
        <div
            {...props}
            className={`prc-card ${className}`.trim()}
        >
            {(heading || description) && (
                <div className="prc-card__header">
                    {heading && (
                        <h3 className="prc-card__title">
                            {heading}
                        </h3>
                    )}

                    {description && (
                        <p className="prc-card__description">
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div className="prc-card__body">
                {children}
            </div>

            {footer && (
                <div className="prc-card__footer">
                    {footer}
                </div>
            )}
        </div>
    );
}

export default Card;