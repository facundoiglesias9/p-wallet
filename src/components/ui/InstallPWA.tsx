'use client';

import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';

export function InstallPWA() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !(window as any).MSStream
        );

        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    }, []);

    if (isStandalone) {
        return null; // Don't show if already installed
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '99px',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    transition: 'transform 0.2s'
                }}
                className="hover:scale-105 active:scale-95"
            >
                <Smartphone size={16} />
                <span className="hidden sm:inline">Instalar App</span>
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    backdropFilter: 'blur(5px)'
                }}
                    onClick={() => setShowModal(false)}
                >
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        padding: '2rem',
                        borderRadius: '24px',
                        maxWidth: '400px',
                        width: '100%',
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-dim)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'var(--primary)',
                                borderRadius: '16px',
                                margin: '0 auto 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Download size={32} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Instalar P-Wallet</h2>
                            <p style={{ color: 'var(--text-dim)' }}>Ten la app en tu pantalla de inicio para acceso rápido.</p>
                        </div>

                        {isIOS ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                    <Share size={24} color="#3b82f6" />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 600 }}>1. Toca "Compartir"</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>En la barra inferior de Safari</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                    <PlusSquare size={24} color="#3b82f6" />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 600 }}>2. "Agregar a Inicio"</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Baja un poco para encontrarlo</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                                <p style={{ marginBottom: '1rem' }}>Abre el menú de tu navegador (tres puntos) y busca la opción:</p>
                                <div style={{
                                    display: 'inline-block',
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    color: 'var(--text-main)'
                                }}>
                                    <Smartphone size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                    Instalar aplicación
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
