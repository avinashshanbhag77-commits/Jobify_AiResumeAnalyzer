'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import UploadForm from '@/components/UploadForm';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import ResumeHistory from '@/components/ResumeHistory';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [analysisData, setAnalysisData] = useState<any>(null);

    if (status === 'loading') {
        return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        redirect('/api/auth/signin');
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
