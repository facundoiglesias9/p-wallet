import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#09090b',
            color: '#fff',
            zIndex: 9999
        }}>
            <div className="animate-ready" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                textAlign: 'center'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px -10px rgba(236, 72, 153, 0.5)'
                    }}>
                        <UserPlus size={32} color="#fff" strokeWidth={2.5} />
                    </div>
                </div>

                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                    Crear Cuenta
                </h1>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                    Comienza desde cero
                </p>

                <RegisterForm />
            </div>
        </div>
    );
}
