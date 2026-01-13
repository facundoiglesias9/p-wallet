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
    const [platform, setPlatform] = useState<'android' | 'ios'>('android');

    useEffect(() => {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isInApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|Threads|Webview/i.test(ua);
        setIsInAppBrowser(isInApp);

        // Detect platform
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);
        setPlatform(isIOSDevice ? 'ios' : 'android');

        // Detect if already installed
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        // Initial check for globally captured prompt
        if ((window as any).deferredPrompt) {
            setDeferredPrompt((window as any).deferredPrompt);
            setCanInstallNative(true);
        }

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

        // Show modal if not native installable or already shown
        const promptToUse = deferredPrompt || (window as any).deferredPrompt;

        if (canInstallNative && promptToUse) {
            setIsInstalling(true);
            setTimeout(async () => {
                promptToUse.prompt();
                const { outcome } = await promptToUse.userChoice;
                if (outcome === 'accepted') {
                    setCanInstallNative(false);
                    setDeferredPrompt(null);
                    (window as any).deferredPrompt = null;
                    setShowModal(false);
                }
                setIsInstalling(false);
            }, 500);
        } else {
            setShowModal(true);
        }
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
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    backdropFilter: 'blur(15px)'
                }}
                    onClick={() => setShowModal(false)}
                >
                    <div style={{
                        background: '#0f1117',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2rem 1.5rem',
                        borderRadius: '32px',
                        maxWidth: '420px',
                        width: '100%',
                        position: 'relative',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                    }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
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

                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
                                color: 'white',
                                borderRadius: '20px',
                                margin: '0 auto 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)'
                            }}>
                                <Download size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 850, marginBottom: '0.5rem' }}>Instalar P-Wallet</h2>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                                Selecciona tu dispositivo para ver los pasos de instalación.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '4px',
                            borderRadius: '16px',
                            marginBottom: '2rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <button
                                onClick={() => setPlatform('android')}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: platform === 'android' ? 'var(--primary)' : 'transparent',
                                    color: platform === 'android' ? 'white' : 'var(--text-dim)',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                            >
                                Android
                            </button>
                            <button
                                onClick={() => setPlatform('ios')}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: platform === 'ios' ? 'var(--primary)' : 'transparent',
                                    color: platform === 'ios' ? 'white' : 'var(--text-dim)',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                            >
                                iOS (iPhone)
                            </button>
                        </div>

                        <div style={{ minHeight: '220px' }}>
                            {platform === 'android' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '1.25rem',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        textAlign: 'center'
                                    }}>
                                        <p style={{ color: 'var(--text-dim)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                                            {isInAppBrowser
                                                ? '⚠️ Navegador interno detectado. Por favor, abre el link directamente en Chrome o Samsung Internet para poder instalar.'
                                                : 'Usa el botón de abajo. Si no funciona, busca "Instalar aplicación" en el menú de tu navegador.'}
                                        </p>
                                        <button
                                            onClick={handleInstallClick}
                                            disabled={isInstalling || isInAppBrowser}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                background: isInstalling ? 'var(--border)' : (canInstallNative ? 'var(--primary)' : 'rgba(255,255,255,0.1)'),
                                                padding: '0.85rem 1.25rem',
                                                borderRadius: '14px',
                                                fontWeight: 700,
                                                color: 'white',
                                                border: 'none',
                                                cursor: (isInstalling || isInAppBrowser) ? 'not-allowed' : 'pointer',
                                                boxShadow: isInstalling || !canInstallNative ? 'none' : '0 10px 20px rgba(99, 102, 241, 0.3)',
                                                transition: '0.2s',
                                                width: '100%',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {isInstalling ? (
                                                <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                                            ) : (
                                                <Smartphone size={20} />
                                            )}
                                            <span>
                                                {isInstalling
                                                    ? 'Verificando...'
                                                    : (canInstallNative ? 'Instalar aplicación' : 'Esperando permiso...')}
                                            </span>
                                        </button>
                                        {!canInstallNative && !isInstalling && !isInAppBrowser && (
                                            <p style={{ marginTop: '10px', fontSize: '0.7rem', color: 'var(--warning)', opacity: 0.8 }}>
                                                * El navegador tarda unos segundos en habilitar la función.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ background: '#007aff20', color: '#007aff', padding: '10px', borderRadius: '12px' }}><Share size={20} /></div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>1. Toca "Compartir"</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>En la barra inferior de Safari</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ background: '#5856d620', color: '#5856d6', padding: '10px', borderRadius: '12px' }}><PlusSquare size={20} /></div>
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>2. "Añadir a inicio"</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Baja hasta encontrar la opción</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
