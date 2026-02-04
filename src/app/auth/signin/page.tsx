'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function SignIn() {
    const router = useRouter();
    const { status, data: session } = useSession();
    const [data, setData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Extract error from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get('error');
        if (urlError) {
            setError(urlError);
        }
    }, []);

    useEffect(() => {
        if (status === 'authenticated') {
            console.log("Authentication successful. Transitioning to dashboard...");
            // Use window.location for a cleaner session sync on some environments
            window.location.href = '/dashboard';
        }
    }, [status]);

    if (status === 'loading') {
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                <h2>Synchronizing Session...</h2>
                <div className="loader" style={{ marginTop: '2rem' }}></div>
            </div>
        );
    }

    if (status === 'authenticated' || (session as any)?.user) {
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                <h1 className="text-accent">Accessing Your Dashboard</h1>
                <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>You're already signed in. Taking you there now...</p>
                <div className="loader" style={{ marginTop: '2.5rem' }}></div>
                <div style={{ marginTop: '2.5rem' }}>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="btn-primary"
                        style={{ padding: '1rem 3rem' }}
                    >
                        Click here if not redirected
                    </button>
                </div>
            </div>
        );
    }

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email: data.email.trim(),
                password: data.password,
                callbackUrl: '/dashboard',
                redirect: false, // Handle redirect manually for better error control
            });

            if (result?.error) {
                setError(result.error);
            } else if (result?.url) {
                router.replace(result.url);
            }
        } catch (err: any) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', paddingTop: '100px' }}>
            <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '3rem' }}>
                <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '2rem' }}>Welcome Back</h2>
                <form onSubmit={loginUser}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>
                <p style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9375rem' }}>
                    Don't have an account? <Link href="/auth/register" className="text-primary" style={{ fontWeight: '600' }}>Create one</Link>
                </p>
            </div>
        </div>
    );
}
