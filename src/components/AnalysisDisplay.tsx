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
            <div className="card">
                <div className="score-circle" style={{ '--score': analysisResult.score } as any}>
                    <div className="score-value">{analysisResult.score}</div>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h3>Resume Score</h3>
                    <p style={{ color: '#888' }}>Based on industry standards</p>
                </div>

                <div className="summary" style={{ marginBottom: '2rem' }}>
                    <h4 className="section-title">Summary</h4>
                    <p>{analysisResult.summary}</p>
                </div>

                <div className="insights">
                    <h4 className="section-title text-success"><CheckCircle size={20} /> Strengths</h4>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                        {analysisResult.strengths?.map((item: string, i: number) => (
                            <li key={i} className="list-item">
                                <CheckCircle size={16} className="text-success" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <h4 className="section-title text-error"><XCircle size={20} /> Weaknesses</h4>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                        {analysisResult.weaknesses?.map((item: string, i: number) => (
                            <li key={i} className="list-item">
                                <XCircle size={16} className="text-error" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <h4 className="section-title text-accent"><AlertCircle size={20} /> Improvements</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {analysisResult.improvements?.map((item: string, i: number) => (
                            <li key={i} className="list-item">
                                <AlertCircle size={16} className="text-accent" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
