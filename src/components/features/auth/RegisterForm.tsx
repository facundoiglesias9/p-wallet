'use client';

import { useState, useActionState } from 'react';
import { register } from '../../../actions/auth';
import { ArrowRight, UserPlus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const initialState = {
    error: '',
};

export function RegisterForm() {
    const [state, formAction, isPending] = useActionState(register, initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div>
                <input
                    name="username"
                    type="text"
                    placeholder="Elige tu Usuario"
                    className="input-premium"
                    required
                    style={{ width: '100%', padding: '1rem' }}
                />
            </div>
            <div style={{ position: 'relative' }}>
                <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    className="input-premium"
                    required
                    style={{ width: '100%', padding: '1rem', paddingRight: '3rem' }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex'
                    }}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            <div style={{ position: 'relative' }}>
                <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmar Contraseña"
                    className="input-premium"
                    required
                    style={{ width: '100%', padding: '1rem', paddingRight: '3rem' }}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex'
                    }}
                >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {state?.error && (
                <div style={{
                    color: '#f43f5e',
                    fontSize: '0.85rem',
                    background: 'rgba(244, 63, 94, 0.1)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: '16px',
                    background: 'white',
                    color: 'black',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    opacity: isPending ? 0.7 : 1,
                    transition: 'transform 0.2s'
                }}
            >
                {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
                {!isPending && <UserPlus size={20} />}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </form>
    );
}
