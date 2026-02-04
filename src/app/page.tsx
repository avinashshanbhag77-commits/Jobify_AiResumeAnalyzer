'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Upload, Brain, Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main>
      <section className="hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="hero-subtitle">Premium AI Resume Analysis</span>
            <h1 className="text-gradient">
              Optimize Your Resume with<br />AI-Powered Intelligence
            </h1>
            <p>
              Stop guessing what recruiters want. Get instant, actionable feedback to skyrocket your interview chances using our advanced AI analyzer.
            </p>
            <div className="cta-group" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link href="/dashboard" className="btn btn-primary">
                Analyze My Resume <ArrowRight size={18} />
              </Link>
              <Link href="/about" className="btn btn-secondary">
                How it Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container">
        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="feature-card glass-panel" variants={itemVariants}>
            <div className="feature-icon">
              <Upload size={28} />
            </div>
            <h3>Instant PDF Parsing</h3>
            <p>Upload your existing resume in seconds. We handle the complex formatting extraction for you with precision.</p>
          </motion.div>

          <motion.div className="feature-card glass-panel" variants={itemVariants}>
            <div className="feature-icon">
              <Brain size={28} />
            </div>
            <h3>AI-Driven Scoring</h3>
            <p>Get a quantifiable score based on industry standards, keywords, and recruiter preferences powered by LLMs.</p>
          </motion.div>

          <motion.div className="feature-card glass-panel" variants={itemVariants}>
            <div className="feature-icon">
              <Zap size={28} />
            </div>
            <h3>Actionable Steps</h3>
            <p>Receive specific bullet-point suggestions to fix weaknesses and highlight your strengths effectively.</p>
          </motion.div>
        </motion.div>
      </section>

      <section className="container" style={{ padding: '4rem 0 8rem' }}>
        <motion.div
          className="glass-panel"
          style={{ padding: '4rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>Ready to Land Your Dream Job?</h2>
          <p style={{ marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Join thousands of professionals who improved their resumes and secured interviews at top tech companies.
          </p>
          <Link href="/auth/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started for Free
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
