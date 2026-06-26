import { ImageResponse } from 'next/og';

export const alt = 'Chicken Coop | Boracle';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom, #030712, #111827, #0f172a)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    padding: '80px',
                    position: 'relative',
                }}
            >
                <div style={{ position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', display: 'flex' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', borderRadius: '50%', display: 'flex' }} />
                
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        background: '#1e3a8a',
                        borderRadius: '24px',
                        marginBottom: '40px',
                        boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.5)',
                        zIndex: 10,
                        fontSize: '50px',
                    }}
                >
                    🍗
                </div>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#1f2937',
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '24px',
                    border: '1px solid #374151',
                    zIndex: 10,
                }}>
                    B.O.R.A.C.L.E
                </div>

                <h1
                    style={{
                        fontSize: '76px',
                        fontWeight: 800,
                        color: '#f9fafb',
                        lineHeight: 1.1,
                        marginBottom: '24px',
                        letterSpacing: '-0.02em',
                        textAlign: 'center',
                        zIndex: 10,
                    }}
                >
                    Chicken Coop
                </h1>
                
                <p
                    style={{
                        fontSize: '32px',
                        color: '#9ca3af',
                        marginTop: 0,
                        marginBottom: '0',
                        textAlign: 'center',
                        maxWidth: '850px',
                        lineHeight: 1.4,
                        fontWeight: 500,
                        zIndex: 10,
                    }}
                >
                    Discover available lab rooms at any time, no more wandering around campus.
                </p>
            </div>
        ),
        {
            ...size,
        }
    );
}
