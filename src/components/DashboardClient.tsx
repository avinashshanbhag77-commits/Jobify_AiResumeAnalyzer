'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import UploadForm from '@/components/UploadForm';
import AnalysisDisplay from '@/components/AnalysisDisplay';
import ResumeHistory from '@/components/ResumeHistory';
import { motion } from 'framer-motion';
import { Sparkles, History, Lightbulb } from 'lucide-react';

interface DashboardClientProps {
    session: Session;
}

export default function DashboardClient({ session }: DashboardClientProps) {
    const [analysisData, setAnalysisData] = useState<any>(null);

    return (
        <div className="container" style={{ paddingBottom: '4rem', minHeight: '100vh', paddingTop: '100px' }}>
            <motion.div
                className="dashboard-header"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}
            >
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        Welcome, {session?.user?.name || 'User'}
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Ready to optimize your career with AI?</p>
                </div>
            </motion.div>

            <div className="dashboard-grid">
                <motion.div
                    className="main-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <UploadForm onAnalysisComplete={setAnalysisData} />
                    {analysisData && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ marginTop: '2rem' }}
                        >
                            <AnalysisDisplay data={analysisData} />
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    className="sidebar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <History className="text-primary" size={20} />
                            <h3 style={{ fontSize: '1.25rem' }}>Resume History</h3>
                        </div>
                        <ResumeHistory onSelect={(data) => {
                            setAnalysisData(data);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} />
                    </div>

                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <Lightbulb className="text-primary" size={20} />
                            <h3 style={{ fontSize: '1.25rem' }}>Pro Tips</h3>
                        </div>
                        <ul style={{ listStyle: 'none', marginTop: '1rem', color: '#94a3b8' }}>
                            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <Sparkles size={16} className="text-primary" style={{ marginTop: '4px', flexShrink: 0 }} />
                                <span>Use action verbs like "Developed", "Led", "Optimized".</span>
                            </li>
                            <li style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <Sparkles size={16} className="text-primary" style={{ marginTop: '4px', flexShrink: 0 }} />
                                <span>Quantify achievements (e.g., "Increased sales by 20%").</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <Sparkles size={16} className="text-primary" style={{ marginTop: '4px', flexShrink: 0 }} />
                                <span>Tailor skills to match the job description.</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
