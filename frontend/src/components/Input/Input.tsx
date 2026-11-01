import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import './Input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

function Input({
                   id,
                   label,
                   error,
                   helperText,
                   type = 'text',
                   className = '',
                   'aria-describedby': ariaDescribedBy,
                   ...props
               }: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const describedBy = [
        ariaDescribedBy,
        error ? errorId : helperText ? helperId : undefined,
    ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div className="prc-input-field">
            <label
                htmlFor={inputId}
                className="prc-input-label"
            >
                {label}
            </label>

            <input
                {...props}
                id={inputId}
                type={type}
                className={`prc-input ${error ? 'prc-input--error' : ''} ${className}`.trim()}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
            />

            {error ? (
                <p
                    id={errorId}
                    className="prc-input-error"
                    role="alert"
                >
                    {error}
                </p>
            ) : helperText ? (
                <p
                    id={helperId}
                    className="prc-input-helper"
                >
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}

export default Input;