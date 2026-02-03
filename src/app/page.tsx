import Link from 'next/link';
import { ArrowRight, CheckCircle, Upload, Brain } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Optimize Your Resume with<br />AI-Powered Intelligence</h1>
          <p>
            Stop guessing what recruiters want. Get instant, actionable feedback to skyrocket your interview chances using our advanced AI analyzer.
          </p>
          <div className="cta-group">
            <Link href="/dashboard" className="btn-primary">
              Analyze My Resume <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="features">
          <div className="feature-card">
            <Upload size={32} className="text-accent" style={{ marginBottom: '1rem' }} />
            <h3>Instant PDF Parsing</h3>
            <p>Upload your existing resume in seconds. We handle the complex formatting extraction for you.</p>
          </div>
          <div className="feature-card">
            <Brain size={32} className="text-accent" style={{ marginBottom: '1rem' }} />
            <h3>AI-Driven Scoring</h3>
            <p>Get a quantifiable score based on industry standards, keywords, and recruiter preferences.</p>
          </div>
          <div className="feature-card">
            <CheckCircle size={32} className="text-accent" style={{ marginBottom: '1rem' }} />
            <h3>Actionable Improvements</h3>
            <p>Receive specific bullet-point suggestions to fix weaknesses and highlight your strengths.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
