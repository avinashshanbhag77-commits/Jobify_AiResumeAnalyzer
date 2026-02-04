import Link from 'next/link';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-info">
                    <Link href="/" className="nav-logo" style={{ marginBottom: '1rem' }}>
                        <span>Jobify<span className="text-primary">AI</span></span>
                    </Link>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '300px' }}>
                        Elevating careers with AI-powered resume analysis and industry insights.
                    </p>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} JobifyAI. All rights reserved.</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        Developed with <Heart size={14} className="text-error" fill="currentColor" /> by <span className="text-primary" style={{ fontWeight: '600' }}>Avinash Shanbhag</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
