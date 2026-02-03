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
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Analyze Your Resume</h2>

            <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="jobRole" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                    Select Target Job Role
                </label>
                <select
                    id="jobRole"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
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
                style={{ padding: '2rem' }} // Reduced padding
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handleChange}
                />

                {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Loader2 className="animate-spin text-accent" size={32} />
                        <p style={{ fontSize: '0.9rem' }}>Analyzing for {selectedRole}...</p>
                    </div>
                ) : (
                    <>
                        <Upload size={32} className="text-secondary" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                        <p style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                            {selectedRole ? 'Click to upload your resume' : 'Select a role first'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#666' }}>PDF only (Max 5MB)</p>
                    </>
                )}
            </div>
        </div>
    );
}

