'use client';

import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, Sparkles } from 'lucide-react';

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [canInstallNative, setCanInstallNative] = useState(false);
    const [isInAppBrowser, setIsInAppBrowser] = useState(false);
    const [isInstalling, setIsInstalling] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isInApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|Threads|Webview/i.test(ua);
        setIsInAppBrowser(isInApp);

        // Detect iOS
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !(window as any).MSStream
        );

        // Detect if already installed
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        // Initial check for globally captured prompt
        if ((window as any).deferredPrompt) {
            setDeferredPrompt((window as any).deferredPrompt);
            setCanInstallNative(true);
        }

        // Listen for the native install prompt (Android/Chrome)
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            (window as any).deferredPrompt = e;
            setCanInstallNative(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsInstalling(true);

        // Simulamos un breve retraso para dar feedback visual
        setTimeout(async () => {
            const promptToUse = deferredPrompt || (window as any).deferredPrompt;

            if (canInstallNative && promptToUse) {
                // Native prompt for Android/Windows/Chrome
                promptToUse.prompt();
                const { outcome } = await promptToUse.userChoice;
                if (outcome === 'accepted') {
                    setCanInstallNative(false);
                    setDeferredPrompt(null);
                    (window as any).deferredPrompt = null;
                    setShowModal(false);
                }
            } else {
                // Show instructions for iOS or if prompt is not available
                setShowModal(true);
            }
            setIsInstalling(false);
        }, 800);
    };

    if (isStandalone) {
        return null;
    }

    return (
        <>
            {/* Visual Debugger for PWA - Only visible during troubleshooting */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 100000,
                background: 'rgba(0,0,0,0.85)',
                color: '#fff',
                fontSize: '11px',
                padding: '12px',
                pointerEvents: 'none',
                maxWidth: '80vw',
                fontFamily: 'monospace',
                borderRadius: '0 0 16px 0',
                border: '1px solid rgba(255,255,255,0.1)',
                borderTop: 'none',
                borderLeft: 'none'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--primary)' }}>PWA DIAGNOSTIC</div>
                NativePrompt: {canInstallNative ? '🟢 SI' : '🔴 NO (Esperando...)'}<br />
                Deferred: {deferredPrompt ? 'OK' : 'NULL'}<br />
                Protocol: {typeof window !== 'undefined' ? (window.location.protocol === 'https:' ? '🟢 HTTPS' : '🔴 ' + window.location.protocol) : 'N/A'}<br />
                InApp: {isInAppBrowser ? '🔶 SI' : '🟢 NO'}<br />
                SW: {('serviceWorker' in navigator) ? '🟢 OK' : '🔴 NO'}
            </div>

            <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: isInstalling ? 'var(--border)' : 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
                    border: 'none',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: isInstalling ? 'not-allowed' : 'pointer',
                    boxShadow: isInstalling ? 'none' : '0 8px 20px rgba(79, 70, 229, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    opacity: isInstalling ? 0.7 : 1
                }}
                className={!isInstalling ? "hover:scale-105 active:scale-95" : ""}
            >
                {isInstalling ? (
                    <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                ) : (
                    canInstallNative ? <Sparkles size={18} /> : <Smartphone size={18} />
                )}
                <span>{isInstalling ? 'Conectando...' : (canInstallNative ? 'Instalar App' : 'App Móvil')}</span>
            </button>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.85)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    backdropFilter: 'blur(12px)'
                }}
                    onClick={() => setShowModal(false)}
                >
                    <div style={{
                        background: '#12141c',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2.5rem 2rem',
                        borderRadius: '32px',
                        maxWidth: '450px',
                        width: '100%',
                        position: 'relative',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
                        textAlign: 'center'
                    }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'var(--text-dim)',
                                padding: '8px',
                                borderRadius: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{
                            width: '72px',
                            height: '72px',
                            background: 'var(--success-bg)',
                            color: 'var(--success)',
                            borderRadius: '20px',
                            margin: '0 auto 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Download size={36} />
                        </div>

                        <h2 style={{ fontSize: '1.75rem', fontWeight: 850, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
                            {isInAppBrowser ? 'Navegador Interno' : 'Instalar P-Wallet'}
                        </h2>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '2.5rem', lineHeight: 1.5 }}>
                            {isInAppBrowser
                                ? 'Estás viendo esto desde una app (como WhatsApp). Para instalar, abre el link directamente en Chrome o Samsung Internet.'
                                : 'Lleva el control de tus finanzas en tu pantalla de inicio como una aplicación nativa.'}
                        </p>

                        {isIOS ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ background: '#007aff20', color: '#007aff', padding: '10px', borderRadius: '12px' }}><Share size={24} /></div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>1. Toca "Compartir"</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>En la barra inferior de Safari</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ background: '#5856d620', color: '#5856d6', padding: '10px', borderRadius: '12px' }}><PlusSquare size={24} /></div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>2. "Agregar a Inicio"</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Baja hasta encontrar la opción</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                                    Navegador detectado: Android. Toque el botón de abajo o use el menú del navegador.
                                </p>
                                <button
                                    onClick={handleInstallClick}
                                    disabled={isInstalling}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        background: isInstalling ? 'var(--border)' : 'var(--primary)',
                                        padding: '0.85rem 1.5rem',
                                        borderRadius: '14px',
                                        fontWeight: 700,
                                        color: 'white',
                                        border: 'none',
                                        cursor: isInstalling ? 'not-allowed' : 'pointer',
                                        boxShadow: isInstalling ? 'none' : '0 10px 20px rgba(99, 102, 241, 0.3)',
                                        transition: '0.2s',
                                        opacity: isInstalling ? 0.7 : 1
                                    }}
                                    className={!isInstalling ? "active:scale-95" : ""}
                                >
                                    {isInstalling ? (
                                        <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                                    ) : (
                                        <Smartphone size={20} />
                                    )}
                                    <span>{isInstalling ? 'Conectando...' : 'Instalar aplicación'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
