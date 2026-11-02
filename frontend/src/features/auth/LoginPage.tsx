import { useState } from 'react';
import type { FormEvent } from 'react';

import Button from '../../components/Button/Button.tsx';
import Input from '../../components/Input/Input.tsx';
import Card from '../../components/Card/Card.tsx';
import Alert from '../../components/Alert/Alert.tsx';

import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [message, setMessage] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setEmailError('');
        setPasswordError('');
        setMessage('');

        let hasErrors = false;

        if (!email.trim()) {
            setEmailError('El correo electrónico es obligatorio.');
            hasErrors = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setEmailError('Ingresa un correo electrónico válido.');
            hasErrors = true;
        }

        if (!password) {
            setPasswordError('La contraseña es obligatoria.');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        // Simulación visual: todavía no existe conexión con el backend.
        setIsLoading(true);

        window.setTimeout(() => {
            setIsLoading(false);

            setMessage(
                'Formulario validado correctamente. La autenticación real se integrará posteriormente.'
            );
        }, 800);
    }

    return (
        <main className="prc-login-page">
            <div className="prc-login-container">

                <header className="prc-login-header">
                    <div
                        className="prc-login-logo"
                        aria-hidden="true"
                    >
                        🧁
                    </div>

                    <h1>Puro Relleno Cupcake</h1>

                    <p>
                        Sistema de gestión de pedidos personalizados
                    </p>
                </header>

                <Card>
                    <div className="prc-login-content">

                        <div className="prc-login-heading">
                            <h2>Iniciar sesión</h2>

                            <p>
                                Ingresa tus credenciales para continuar.
                            </p>
                        </div>

                        <form
                            className="prc-login-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <Input
                                label="Correo electrónico"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                autoComplete="email"
                                value={email}
                                error={emailError}
                                required
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setEmailError('');
                                    setMessage('');
                                }}
                            />

                            <div className="prc-login-password-field">
                                <Input
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Ingresa tu contraseña"
                                    autoComplete="current-password"
                                    value={password}
                                    error={passwordError}
                                    required
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        setPasswordError('');
                                        setMessage('');
                                    }}
                                />

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="prc-login-toggle"
                                    aria-pressed={showPassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                </Button>
                            </div>

                            <Button
                                type="submit"
                                isLoading={isLoading}
                                disabled={isLoading}
                                className="prc-login-submit"
                            >
                                Iniciar sesión
                            </Button>
                        </form>

                        {message && (
                            <div className="prc-login-message">
                                <Alert
                                    variant="info"
                                    title="Validación completada"
                                >
                                    {message}
                                </Alert>
                            </div>
                        )}

                    </div>
                </Card>

                <footer className="prc-login-footer">
                    <p>
                        Puro Relleno Cupcake — Sistema de gestión
                    </p>
                </footer>

            </div>
        </main>
    );
}

export default LoginPage;