'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Sparkles, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link href="/" className="nav-logo">
                    <Sparkles className="text-primary" size={24} />
                    <span>Jobify<span className="text-primary">AI</span></span>
                </Link>

                <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <Link href="/jobs" className="nav-link" onClick={() => setIsOpen(false)}>Jobs</Link>
                    <Link href="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
                    {session?.user ? (
                        <>
                            <Link href="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <LayoutDashboard size={18} /> Dashboard
                                </span>
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="btn btn-secondary"
                                style={{ gap: '0.5rem' }}
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Link href="/auth/signin" className="nav-link">
                                Sign In
                            </Link>
                            <Link href="/auth/register" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                <button className="btn btn-secondary mobile-menu-btn" onClick={() => setIsOpen(!isOpen)} style={{ padding: '0.5rem' }}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
}
