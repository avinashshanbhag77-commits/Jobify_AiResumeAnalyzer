'use client';

import { Briefcase, MapPin, Clock, ArrowUpRight, Search, Filter, Loader2, X, ChevronLeft, ChevronRight, Building2, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string; // HTML content
    descriptionPlain: string; // Plain text for preview
    tags: string[];
    posted: string;
    applyUrl: string;
    logo: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(12);

    // Modal State
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('https://remotive.com/api/remote-jobs'); // Fetches all jobs
                const data = await response.json();

                const mappedJobs: Job[] = data.jobs.map((job: any) => ({
                    id: job.id,
                    title: job.title,
                    company: job.company_name,
                    location: job.candidate_required_location,
                    type: job.job_type || 'Full-time',
                    salary: job.salary || 'Competitive',
                    description: job.description, // Keep full HTML for modal
                    descriptionPlain: job.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
                    tags: job.tags && job.tags.length > 0 ? job.tags : [job.category],
                    posted: new Date(job.publication_date).toLocaleDateString(),
                    applyUrl: job.url,
                    logo: job.company_logo || '',
                }));

                setJobs(mappedJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter Logic
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' ||
            (filterType === 'Contract' && job.type.toLowerCase().includes('contract')) ||
            (filterType === 'Full-time' && job.type.toLowerCase().includes('full-time')) ||
            (filterType === 'Freelance' && job.type.toLowerCase().includes('freelance'));
        return matchesSearch && matchesFilter;
    });

    // Pagination Logic
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="container" style={{ paddingTop: '100px', paddingBottom: '4rem', minHeight: '100vh', position: 'relative' }}>

            {/* Hero Section */}
            <div className="hero-section" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
                        Find Your Dream Job
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Explore opportunities from top global companies.
                    </p>
                </motion.div>
            </div>

            {/* Search and Advanced Filter */}
            <motion.div
                className="glass-panel"
                style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search by job title or company..."
                        className="form-input"
                        style={{ paddingLeft: '3rem' }}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                {/* Styled Filter Dropdown */}
                <div style={{ width: '220px', position: 'relative' }}>
                    <Filter size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1, pointerEvents: 'none' }} />
                    <select
                        className="form-select"
                        style={{
                            width: '100%',
                            paddingLeft: '3rem',
                            cursor: 'pointer',
                            border: '1px solid var(--glass-border)',
                            background: '#0f172a',
                            color: 'white',
                            height: '46px',
                            appearance: 'none',
                            borderRadius: 'var(--radius-md)'
                        }}
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="All">All Job Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                    {/* Custom Arrow */}
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </motion.div>

            {/* Jobs Grid */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                ) : currentJobs.length > 0 ? (
                    <>
                        <AnimatePresence mode='wait'>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {currentJobs.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        layout
                                        className="glass-panel job-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onClick={() => setSelectedJob(job)}
                                        style={{
                                            padding: '2rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '2rem',
                                            flexWrap: 'wrap',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            border: '1px solid transparent'
                                        }}
                                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(30, 41, 59, 0.6)', borderColor: 'var(--primary-glow)' }}
                                    >
                                        <div style={{ flex: 1, minWidth: '300px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                                <div style={{
                                                    width: '64px',
                                                    height: '64px',
                                                    borderRadius: '12px',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    flexShrink: 0
                                                }}>
                                                    {job.logo ? (
                                                        <img
                                                            src={job.logo}
                                                            alt={`${job.company} logo`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px', background: 'white' }}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <Building2 size={28} className="text-primary" style={{ display: job.logo ? 'none' : 'block' }} />
                                                    <Building2 size={28} className="text-primary" style={{ display: 'none' }} /> {/* Fallback if image errors and hides itself */}
                                                </div>

                                                <div>
                                                    <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: '700', lineHeight: 1.2, marginBottom: '0.25rem' }}>{job.title}</h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: '600' }}>{job.company}</span>
                                                        {job.location && (
                                                            <>
                                                                <span style={{ color: '#64748b' }}>•</span>
                                                                <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{job.location}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.03)', padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Briefcase size={14} className="text-primary" /> {job.type}
                                                </span>
                                                <span style={{ background: 'rgba(255,255,255,0.03)', padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Briefcase size={14} className="text-success" /> {job.salary}
                                                </span>
                                                <span style={{ background: 'rgba(255,255,255,0.03)', padding: '0.25rem 0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Clock size={14} className="text-accent" /> {job.posted}
                                                </span>
                                            </div>

                                            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {job.descriptionPlain}
                                            </p>

                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                {job.tags.slice(0, 4).map((tag, idx) => (
                                                    <span key={idx} style={{
                                                        background: 'rgba(99, 102, 241, 0.1)',
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '99px',
                                                        fontSize: '0.75rem',
                                                        color: 'var(--primary)',
                                                        fontWeight: '600'
                                                    }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '150px' }}>
                                            <button className="btn btn-secondary" style={{ pointerEvents: 'none' }}>View Details</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.75rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <span style={{ color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                                    Page <span style={{ color: 'white', fontWeight: 'bold' }}>{currentPage}</span> of {totalPages}
                                </span>

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.75rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '4rem', textAlign: 'center' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#64748b'
                        }}>
                            <Search size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No jobs found</h3>
                        <p style={{ color: '#94a3b8' }}>Try adjusting your search or filters to find what you're looking for.</p>
                    </motion.div>
                )}
            </div>

            {/* Job Details Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                        onClick={() => setSelectedJob(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="glass-panel"
                            style={{
                                width: '100%',
                                maxWidth: '900px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                padding: '0',
                                position: 'relative',
                                background: '#0f172a',
                                border: '1px solid var(--glass-border)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', zIndex: 10 }}
                                >
                                    <X size={24} />
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        {selectedJob.logo ? (
                                            <img
                                                src={selectedJob.logo}
                                                alt={`${selectedJob.company} logo`}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px', background: 'white' }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
                                                }}
                                            />
                                        ) : null}
                                        <Building2 size={40} className="text-primary" style={{ display: selectedJob.logo ? 'none' : 'block' }} />
                                        <Building2 size={40} className="text-primary" style={{ display: 'none' }} />
                                    </div>

                                    <div>
                                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white', lineHeight: 1.1 }}>{selectedJob.title}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                            <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.1rem' }}>{selectedJob.company}</span>
                                            <span style={{ color: '#64748b' }}>•</span>
                                            <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Globe size={16} /> {selectedJob.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--glass-border)' }}>
                                        <Briefcase size={18} className="text-primary" /> {selectedJob.type}
                                    </span>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--glass-border)' }}>
                                        <Briefcase size={18} className="text-success" /> {selectedJob.salary}
                                    </span>
                                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--glass-border)' }}>
                                        <Clock size={18} className="text-accent" /> Posted {selectedJob.posted}
                                    </span>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div
                                style={{ padding: '2rem', color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', flex: 1, overflowY: 'auto' }}
                                className="job-description"
                                dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                            />

                            {/* Modal Footer */}
                            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', position: 'sticky', bottom: 0, backdropFilter: 'blur(10px)' }}>
                                <button className="btn btn-secondary" onClick={() => setSelectedJob(null)}>Close</button>
                                <a
                                    href={selectedJob.applyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
                                >
                                    Apply Now <ArrowUpRight size={20} />
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
