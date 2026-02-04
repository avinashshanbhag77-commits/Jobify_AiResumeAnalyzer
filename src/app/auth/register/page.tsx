'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function Register() {
    const router = useRouter();
    const { status } = useSession();
    const [data, setData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("Register status:", status);
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    email: data.email.trim()
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }

            router.push('/auth/signin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', paddingTop: '100px' }}>
            <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '3rem' }}>
                <h2 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '2rem' }}>Create Account</h2>
                <form onSubmit={registerUser}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
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
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </button>
                </form>
                <p style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9375rem' }}>
                    Already have an account? <Link href="/auth/signin" className="text-primary" style={{ fontWeight: '600' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
