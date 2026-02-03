'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function Register() {
    const router = useRouter();
    const [data, setData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
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
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                <form onSubmit={registerUser}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                        <input
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #333', background: '#222', color: '#fff' }}
                        />
                    </div>
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
                        {loading ? <Loader2 className="animate-spin" /> : 'Register'}
                    </button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', color: '#888' }}>
                    Already have an account? <Link href="/auth/signin" className="text-accent">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
