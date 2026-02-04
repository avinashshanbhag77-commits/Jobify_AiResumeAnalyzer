'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UploadForm from '@/components/UploadForm';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import ResumeHistory from '@/components/ResumeHistory';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem', minHeight: '100vh', display: 'block' }}>
            <div className="dashboard-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {session?.user?.name || 'User'}</h1>
                    <p style={{ color: '#888' }}>Ready to optimize your career?</p>
                </div>
                {status === 'unauthenticated' && (
                    <div className="card" style={{ padding: '1rem', border: '1px solid var(--error)', background: 'rgba(239, 68, 68, 0.1)', maxWidth: '400px' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--error)' }}>
                            Session synchronization issue.
                            <button onClick={() => window.location.href = '/auth/signin'} style={{ marginLeft: '5px', textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Sign in again</button>
                        </p>
                    </div>
                )}
            </div>

            <div className="dashboard-grid">
                <div className="main-content">
                    <UploadForm onAnalysisComplete={setAnalysisData} />
                    {analysisData && <AnalysisDisplay data={analysisData} />}
                </div>

                <div className="sidebar">
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <ResumeHistory onSelect={(data) => {
                            setAnalysisData(data);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} />
                    </div>

                    <div className="card">
                        <h3>Pro Tips</h3>
                        <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: '#ccc' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Use action verbs</li>
                            <li style={{ marginBottom: '0.5rem' }}>Quantify your achievements</li>
                            <li>Tailor to the job description</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
