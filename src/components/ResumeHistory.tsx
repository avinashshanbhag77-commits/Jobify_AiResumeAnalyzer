'use client';

import { useEffect, useState } from 'react';

interface ResumeHistoryProps {
    onSelect: (data: any) => void;
}

export default function ResumeHistory({ onSelect }: ResumeHistoryProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/resumes');
            const data = await res.json();
            if (res.ok) {
                setHistory(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) return <div>Loading history...</div>;

    if (history.length === 0) {
        return <div style={{ color: '#888', fontStyle: 'italic' }}>No previous scans found.</div>;
    }

    return (
        <div className="resume-history">
            <h3>Recent Scans</h3>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                {history.map((item) => (
                    <li
                        key={item._id}
                        onClick={() => onSelect(item)}
                        style={{
                            padding: '0.75rem',
                            marginBottom: '0.5rem',
                            backgroundColor: 'var(--surface)',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            border: '1px solid var(--border)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.fileName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Score: {item.analysisResult?.score || 'N/A'}</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
