'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link href="/" className="logo">
                    Jobify<span className="accent">AI</span>
                </Link>
                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
                    {session ? (
                        <>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="btn-text"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/api/auth/signin" className="btn-primary">
                            Sign In
                        </Link>
                    )}
                </div>
                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </div>
        </nav>
    );
}
