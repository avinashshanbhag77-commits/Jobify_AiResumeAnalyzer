'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { JOB_ROLES } from '@/constants/jobRoles';

interface UploadFormProps {
    onAnalysisComplete: (data: any) => void;
}

export default function UploadForm({ onAnalysisComplete }: UploadFormProps) {
    const roles = JOB_ROLES || [];
    const [isDragOver, setIsDragOver] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (!selectedRole) {
            alert('Please select a job role first.');
            return;
        }

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobRole', selectedRole);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                let errorMessage = 'Analysis failed';
                try {
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await res.json();
                        errorMessage = errorData.message || errorMessage;
                    } else {
                        const errorText = await res.text();
                        console.error("Non-JSON Error Response:", errorText);
                        errorMessage = `Server Error: ${res.status} ${res.statusText}`;
                    }
                } catch (e) {
                    console.error("Error parsing error response:", e);
                }
                throw new Error(errorMessage);
            }

            const result = await res.json();
            onAnalysisComplete(result.data);
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Something went wrong during analysis.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '640px', margin: '0 auto 2rem', padding: '3rem' }}>
            <h2 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>Analyze Your Resume</h2>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label" style={{ fontSize: '0.9375rem', fontWeight: '600' }}>
                    Select Target Job Role
                </label>
                <select
                    id="jobRole"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="form-input form-select"
                    style={{ backgroundPosition: 'right 1rem center' }}
                >
                    <option value="">-- Choose a Role --</option>
                    {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            <div
                className={`upload-area ${isDragOver ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    padding: '3.5rem 2rem',
                    background: isDragOver ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: '2px dashed var(--glass-border)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease'
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />

                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--primary)' }}>Analyzing for {selectedRole}...</p>
                    </div>
                ) : (
                    <>
                        <div className="feature-icon" style={{ margin: '0 auto 1.5rem', width: '64px', height: '64px' }}>
                            <Upload size={32} />
                        </div>
                        <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'white' }}>
                            {selectedRole ? 'Click or drop your resume' : 'Select a role first'}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Professional PDF resumes only (Max 5MB)</p>
                    </>
                )}
            </div>
        </div>
    );
}

