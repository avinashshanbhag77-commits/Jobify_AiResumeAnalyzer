'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

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

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent selecting the item when deleting
        if (!confirm('Are you sure you want to delete this scan?')) return;

        try {
            const res = await fetch(`/api/resumes/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setHistory(history.filter(item => item._id !== id));
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('An error occurred while deleting');
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', flex: 1 }}>{item.fileName}</div>
                            <button
                                onClick={(e) => handleDelete(e, item._id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--error)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    transition: 'background 0.2s',
                                    opacity: 0.6
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = '0.6';
                                    e.currentTarget.style.background = 'none';
                                }}
                                title="Delete Scan"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                            <span>Score: {item.analysisResult?.score || 'N/A'}</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
