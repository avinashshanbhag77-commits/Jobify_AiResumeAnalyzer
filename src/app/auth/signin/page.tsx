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
        if (status === 'authenticated' || session?.user) {
            console.log("Active session detected. Forcing redirect to Dashboard...");
            window.location.replace('/dashboard');
        }
    }, [status, session]);

    if (status === 'loading') {
        return <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
            <h2>Syncing Session...</h2>
            <div className="loader"></div>
        </div>;
    }

    if (status === 'authenticated' || session?.user) {
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                <h1 className="text-accent">Welcome Back!</h1>
                <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>You are currently signed in.</p>
                <div style={{ marginTop: '2.5rem' }}>
                    <Link href="/dashboard" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
                        Enter My Dashboard
                    </Link>
                </div>
                <p style={{ marginTop: '2rem', color: '#666' }}>Redirecting automatically...</p>
            </div>
        );
    }

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                callbackUrl: '/dashboard',
                redirect: true, // Let NextAuth handle the redirect
            });

            if (result?.error) {
                setError('Invalid email or password');
            }
        } catch (err: any) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In</h2>
                <form onSubmit={loginUser}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            required
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }}
                        />
                    </div>

                    {error && <p className="text-error" style={{ marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', color: '#888' }}>
                    Don't have an account? <Link href="/auth/register" className="text-accent">Register</Link>
                </p>
            </div>
        </div>
    );
}
