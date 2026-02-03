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
        if (status === 'authenticated') {
            console.log("Logged in, redirecting from SignIn to Dashboard...");
            router.push('/dashboard');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading session...</div>;
    }

    if (status === 'authenticated') {
        return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Already signed in. Redirecting...</div>;
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
