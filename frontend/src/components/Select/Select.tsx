import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children: ReactNode;
    error?: string;
    helperText?: string;
    placeholder?: string;
}

function Select({
                    id,
                    label,
                    children,
                    error,
                    helperText,
                    placeholder,
                    className = '',
                    'aria-describedby': ariaDescribedBy,
                    ...props
                }: SelectProps) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    const describedBy = [
        ariaDescribedBy,
        error ? errorId : helperText ? helperId : undefined,
    ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div className="prc-select-field">
            <label htmlFor={selectId} className="prc-select-label">
                {label}
            </label>

            <select
                {...props}
                id={selectId}
                className={`prc-select ${error ? 'prc-select--error' : ''} ${className}`.trim()}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}

                {children}
            </select>

            {error ? (
                <p
                    id={errorId}
                    className="prc-select-error"
                    role="alert"
                >
                    {error}
                </p>
            ) : helperText ? (
                <p id={helperId} className="prc-select-helper">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}

export default Select;