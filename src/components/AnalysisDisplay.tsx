import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AnalysisDisplayProps {
    data: any;
}

export default function AnalysisDisplay({ data }: AnalysisDisplayProps) {
    if (!data) return null;
    const { analysisResult } = data;

    if (!analysisResult) {
        return <div className="text-error">Error: No analysis result found.</div>;
    }

    return (
        <div className="analysis-result">
            <div className="glass-panel" style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                    <div
                        className="score-circle"
                        style={{
                            '--score': analysisResult.score,
                            width: '160px',
                            height: '160px',
                            background: `conic-gradient(var(--primary) calc(${analysisResult.score} * 1%), var(--glass-border) 0)`,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            boxShadow: '0 0 30px var(--primary-glow)'
                        } as any}
                    >
                        <div style={{ position: 'absolute', width: '130px', height: '130px', background: 'var(--background)', borderRadius: '50%' }}></div>
                        <div className="score-value" style={{ position: 'relative', fontSize: '3.5rem', fontWeight: '800' }}>{analysisResult.score}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <h3 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Overall Analysis</h3>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6' }}>{analysisResult.summary}</p>
                    </div>
                </div>

                <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div className="insight-section">
                        <h4 className="section-title" style={{ color: 'var(--success)', borderBottomColor: 'rgba(16, 185, 129, 0.2)' }}>
                            <CheckCircle size={20} /> Strengths
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {analysisResult.strengths?.map((item: string, i: number) => (
                                <li key={i} className="list-item" style={{ color: '#cbd5e1' }}>
                                    <CheckCircle size={16} className="text-success" style={{ marginTop: '4px', flexShrink: 0 }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="insight-section">
                        <h4 className="section-title" style={{ color: 'var(--error)', borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
                            <XCircle size={20} /> Weaknesses
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {analysisResult.weaknesses?.map((item: string, i: number) => (
                                <li key={i} className="list-item" style={{ color: '#cbd5e1' }}>
                                    <XCircle size={16} className="text-error" style={{ marginTop: '4px', flexShrink: 0 }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="insight-section">
                        <h4 className="section-title" style={{ color: 'var(--accent)', borderBottomColor: 'rgba(139, 92, 246, 0.2)' }}>
                            <AlertCircle size={20} /> Improvements
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {analysisResult.improvements?.map((item: string, i: number) => (
                                <li key={i} className="list-item" style={{ color: '#cbd5e1' }}>
                                    <AlertCircle size={16} className="text-accent" style={{ marginTop: '4px', flexShrink: 0 }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
