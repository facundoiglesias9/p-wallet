export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            width: '100%',
            gap: '1rem'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(99, 102, 241, 0.1)',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 500 }}>
                Cargando datos...
            </p>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
        </div>
    );
}
