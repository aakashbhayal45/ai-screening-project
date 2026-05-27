import { Plus, Search, Sparkles, Briefcase, FileText, CheckCircle2, ChevronRight, Zap, Target, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '../lib/utils';

export default function JDManager() {
    const [isCreating, setIsCreating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        department: 'Engineering',
        location: '',
        employmentType: 'Full-Time',
        salaryMin: '',
        salaryMax: '',
        visibility: 'public',
        description: '',
        requiredSkills: [],
        matchThreshold: 85
    });

    // Fetch Jobs on Mount
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return setIsLoading(false);

                const res = await axios.get('/api/jobs/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    setJobs(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleAIGeneration = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const simulatedJD = `We are looking for a ${formData.title || 'Professional'} to join our ${formData.department} team.\n\nRequired Skills:\n- React.js\n- TypeScript\n- Next.js (SSR/SSG)\n- Tailwind CSS\n- State Management`;
            setFormData(prev => ({
                ...prev,
                description: simulatedJD,
                requiredSkills: ['React.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux']
            }));
            setIsGenerating(false);
        }, 2000);
    };

    const handleCreateJob = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert('Please login first.');

            const salaryRange = formData.salaryMin && formData.salaryMax
                ? `$${formData.salaryMin} - $${formData.salaryMax}`
                : '';

            const payload = {
                title: formData.title,
                location: formData.location,
                employmentType: formData.employmentType,
                salaryRange: salaryRange,
                visibility: formData.visibility,
                description: formData.description,
                requiredSkills: formData.requiredSkills
            };

            const res = await axios.post('/api/jobs', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setJobs([res.data.data, ...jobs]);
                setIsCreating(false);
                // Reset form
                setFormData({
                    title: '', department: 'Engineering', location: '', employmentType: 'Full-Time',
                    salaryMin: '', salaryMax: '', visibility: 'public', description: '', requiredSkills: [], matchThreshold: 85
                });
            }
        } catch (error) {
            console.error('Failed to create job', error);
            alert(error.response?.data?.message || 'Failed to create job. Make sure you have created your Company Profile first.');
        }
    };

    if (isCreating) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 pb-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCreating(false)}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                        &larr; Back to Listings
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Job Post</h1>
                        <p className="text-muted-foreground mt-1">Design an optimized Job Description that attracts top talent.</p>
                    </div>
                    <button onClick={handleCreateJob} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium shadow-md hover:bg-primary/90 transition-all flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Publish Job
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Input Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                            <h2 className="text-lg font-semibold border-b border-border pb-3">Basic Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Job Title</label>
                                    <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} type="text" placeholder="e.g. Senior Frontend Engineer" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Department</label>
                                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                                        <option>Engineering</option>
                                        <option>Design</option>
                                        <option>Marketing</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Location</label>
                                    <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} type="text" placeholder="e.g. San Francisco or Remote" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Employment Type</label>
                                    <select value={formData.employmentType} onChange={e => setFormData({ ...formData, employmentType: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                                        <option>Full-Time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Salary Range ($)</label>
                                    <div className="flex items-center gap-2">
                                        <input value={formData.salaryMin} onChange={e => setFormData({ ...formData, salaryMin: e.target.value })} type="number" placeholder="Min" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                        <span className="text-muted-foreground">-</span>
                                        <input value={formData.salaryMax} onChange={e => setFormData({ ...formData, salaryMax: e.target.value })} type="number" placeholder="Max" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-foreground">Visibility</label>
                                    <select value={formData.visibility} onChange={e => setFormData({ ...formData, visibility: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                                        <option value="public">Public (Career Page)</option>
                                        <option value="private">Private (Internal Only)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 relative overflow-hidden group">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-500" /> Job Description
                                </h2>
                                <button
                                    onClick={handleAIGeneration}
                                    disabled={isGenerating}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                        isGenerating ? "bg-indigo-100 text-indigo-400 cursor-not-allowed" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                                    )}
                                >
                                    {isGenerating ? <Zap className="w-4 h-4 animate-pulse" /> : <Sparkles className="w-4 h-4" />}
                                    {isGenerating ? "Generating..." : "Auto-Generate with AI"}
                                </button>
                            </div>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the role, responsibilities, and requirements... Or click 'Auto-Generate' to let AI write it for you based on the title."
                                className="w-full h-64 bg-background border border-border rounded-lg p-4 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-y"
                            />
                        </div>
                    </div>

                    {/* Right Column - AI Optimization Settings */}
                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-border bg-muted/20">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" /> AI Match Settings
                                </h3>
                            </div>
                            <div className="p-5 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex justify-between">
                                        <span>Auto-Shortlist Threshold</span>
                                        <span className="text-primary font-bold">{formData.matchThreshold}%</span>
                                    </label>
                                    <input type="range" min="0" max="100" value={formData.matchThreshold} onChange={e => setFormData({ ...formData, matchThreshold: e.target.value })} className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                                    <p className="text-xs text-muted-foreground">Candidates scoring above this will be automatically moved to 'Shortlisted'.</p>
                                </div>
                                <hr className="border-border" />
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center justify-between">
                                        Required Skills (Auto-Extracted)
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{formData.requiredSkills.length} found</span>
                                    </label>
                                    {formData.requiredSkills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.requiredSkills.map(skill => (
                                                <span key={skill} className="px-2.5 py-1 bg-muted border border-border rounded-md text-xs font-medium flex items-center gap-1">
                                                    {skill} <button onClick={() => setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter(s => s !== skill) })} className="hover:text-rose-500 text-muted-foreground">&times;</button>
                                                </span>
                                            ))}
                                            <button className="px-2.5 py-1 border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors rounded-md text-xs font-medium flex items-center gap-1">
                                                <Plus className="w-3 h-3" /> Add
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center p-4 bg-muted/30 border border-dashed border-border rounded-lg">
                                            <p className="text-sm text-muted-foreground">Generate JD to auto-extract skills</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Postings</h1>
                    <p className="text-muted-foreground mt-1">Manage open roles and configure AI matching criteria.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" /> Create New Job
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 py-1.5 w-72">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search job titles or departments..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                    ) : jobs.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                            <Briefcase className="w-10 h-10 mb-3 opacity-20" />
                            <p>No jobs found. Click "Create New Job" to get started.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Job Title</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Candidates</th>
                                    <th className="px-6 py-4 font-medium">Location</th>
                                    <th className="px-6 py-4 font-medium">Created At</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {jobs.map((jd) => (
                                    <tr key={jd._id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground text-base group-hover:text-primary transition-colors cursor-pointer">{jd.title}</div>
                                                    <div className="text-xs text-muted-foreground font-medium">{jd.employmentType}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
                                                jd.status === 'open' ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                            )}>
                                                {jd.status === 'open' ? <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span> : null}
                                                {jd.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium text-foreground">0</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-muted-foreground">{jd.location || 'Remote'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{new Date(jd.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
