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
    const [analysisData, setAnalysisData] = useState<any>(null);

    useEffect(() => {
        console.log("Dashboard mount - status:", status, "session:", !!session);
    }, [status, session]);

    // If session is loading, show loading spinner
    if (status === 'loading') {
        return <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
            <h2>Connecting to your dashboard...</h2>
            <p style={{ color: '#888', marginTop: '1rem' }}>Please wait while we sync your session</p>
            <div className="loader" style={{ marginTop: '2rem' }}></div>
        </div>;
    }

    // Force rendering if we have session.user even if status is weird
    const isAuthenticated = status === 'authenticated' || (status === 'unauthenticated' && !!session?.user);

    if (!isAuthenticated) {
        console.log("Dashboard protection: Session missing. Status:", status);
        return (
            <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                <h2>Session Expired or Missing</h2>
                <p>Please sign in to access your resumes.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                    <Link href="/auth/signin" className="btn-primary">Sign In</Link>
                    <Link href="/" className="btn-secondary">Back Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {session?.user?.name || 'User'}</h1>
                    <p style={{ color: '#888' }}>Ready to optimize your career?</p>
                </div>
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
                            // Optionally scroll to top or show a toast
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
