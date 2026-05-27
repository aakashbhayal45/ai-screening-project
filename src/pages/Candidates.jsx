import { UploadCloud, Search, SlidersHorizontal, Eye, FileText, CheckCircle2, Loader2, Download, Filter, MoreHorizontal, UserCheck, UserX, AlertCircle, MapPin, Briefcase, ThumbsUp, ThumbsDown, Tag } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { cn } from '../lib/utils';

export default function Candidates() {
    const context = useOutletContext() || {};
    const blindHiring = context.blindHiring || false;
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [processingState, setProcessingState] = useState(null); // 'uploading', 'parsing', 'scoring', 'done'
    const [activeTab, setActiveTab] = useState('all');
    const [targetJob, setTargetJob] = useState('Senior React Developer');
    const fileInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

    // Filter states
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [minExperience, setMinExperience] = useState(0);
    const [minScore, setMinScore] = useState(0);

    useEffect(() => {
        const query = searchParams.get('search');
        if (query !== null) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setProcessingState('uploading');

        // UI sequence delays to simulate AI perception
        setTimeout(() => setProcessingState('parsing'), 500);
        setTimeout(() => setProcessingState('scoring'), 1000);

        try {
            const newCandidates = [];
            const token = localStorage.getItem('token');
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('resume', files[i]);
                formData.append('targetJob', targetJob);

                const res = await axios.post('/api/candidates/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                });

                if (res.data?.success) {
                    newCandidates.push(res.data.data);
                }
            }

            if (newCandidates.length > 0) {
                setCandidates(prev => [...newCandidates, ...prev]);
            }
        } catch (error) {
            console.error("Error uploading file", error);
            alert("An error occurred during upload");
        } finally {
            setTimeout(() => {
                setProcessingState('done');
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }, 1500);
        }
    };

    const handleExportExcel = () => {
        const exportData = filteredCandidates.map(c => ({
            'ID': c.id,
            'Name': c.name,
            'Role': c.role,
            'Location': c.location,
            'Experience (Years)': c.exp,
            'Match Score (%)': c.score,
            'Status': c.status,
            'Skills Matched': (c.skills || []).join(', '),
            'Skills Missing': (c.missing || []).join(', ')
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
        XLSX.writeFile(workbook, "Candidates_Export.xlsx");
    };

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/candidates', {
                    headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
                });

                if (res.data?.success) {
                    setCandidates(res.data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch candidates', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter(c => {
        const matchesTab = activeTab === 'all' || c.status === activeTab;
        const matchesSearch =
            (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.role || '').toLowerCase().includes(searchQuery.toLowerCase());

        const expValue = parseInt(c.exp) || 0;
        const matchesExp = expValue >= minExperience;

        const scoreValue = parseInt(c.score) || 0;
        const matchesScore = scoreValue >= minScore;

        const matchesSkills = selectedSkills.length === 0 ||
            (c.skills && c.skills.some(s => selectedSkills.includes(s)));

        return matchesTab && matchesSearch && matchesExp && matchesScore && matchesSkills;
    });

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Resume Management</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Upload and AI-evaluate resumes against open roles.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 px-4 py-2 border border-border/80 bg-card/80 backdrop-blur-sm text-foreground rounded-xl font-medium hover:bg-muted/50 transition-all duration-300 text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 group">
                        <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" /> Export to Excel
                    </button>
                    <button
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-sm hover:-translate-y-0.5">
                        <UploadCloud className="w-4 h-4" /> Bulk Upload
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Sidebar - Upload & Filters */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Upload Zone */}
                    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <h2 className="text-sm font-semibold mb-4 text-foreground flex items-center gap-2">
                            <UploadCloud className="w-4 h-4 text-primary" /> Quick Upload
                        </h2>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx"
                            multiple
                            className="hidden"
                        />

                        <button
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            className={cn(
                                "w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all relative z-10",
                                isUploading
                                    ? "border-primary/50 bg-primary/5 cursor-not-allowed scale-[0.98]"
                                    : "border-border hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
                            )}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-2 text-primary">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="text-xs font-medium text-center px-4">
                                        {processingState === 'uploading' && "Uploading PDF..."}
                                        {processingState === 'parsing' && "Extracting NLP Tokens..."}
                                        {processingState === 'scoring' && "Computing Similarity..."}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-foreground">Click or Drag Resumes</p>
                                        <p className="text-[11px] text-muted-foreground mt-1">PDF, DOCX up to 10MB</p>
                                    </div>
                                </>
                            )}
                        </button>

                        <div className="mt-5 relative z-10">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Target Job Description</label>
                            <select
                                value={targetJob}
                                onChange={(e) => setTargetJob(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-shadow transition-colors appearance-none cursor-pointer">
                                <option value="Senior React Developer">Senior React Developer</option>
                                <option value="Backend Engineer (FastAPI)">Backend Engineer (FastAPI)</option>
                                <option value="SOC Analyst">SOC Analyst</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-muted-foreground">
                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Filters Sidebar */}
                    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-border/50 bg-muted/10">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Filter className="w-4 h-4 text-primary" /> Filters
                            </h2>
                        </div>
                        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
                            {/* Skills */}
                            <div>
                                <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Required Skills</h3>
                                <div className="space-y-2">
                                    {['React', 'TypeScript', 'Node.js', 'Python'].map(skill => (
                                        <label key={skill} className="flex items-center gap-2 text-sm cursor-pointer group">
                                            <div className="relative flex items-center justify-center w-4 h-4 border border-border rounded group-hover:border-primary transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                                                    checked={selectedSkills.includes(skill)}
                                                    onChange={() => toggleSkill(skill)}
                                                />
                                                <div className="w-2.5 h-2.5 bg-primary rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                            </div>
                                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-border" />

                            {/* Experience */}
                            <div>
                                <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider flex justify-between">
                                    <span>Experience (Years)</span>
                                    <span className="text-primary">{minExperience}+ yrs</span>
                                </h3>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={minExperience}
                                    onChange={(e) => setMinExperience(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>0</span>
                                    <span>5</span>
                                    <span>10+</span>
                                </div>
                            </div>

                            <hr className="border-border" />

                            {/* AI Score */}
                            <div>
                                <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Min AI Score</h3>
                                <div className="flex items-center gap-3 group">
                                    <input
                                        type="number"
                                        value={minScore}
                                        onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                                        min="0"
                                        max="100"
                                        className="w-16 bg-background border border-border rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all group-hover:border-primary/30"
                                    />
                                    <span className="text-sm text-muted-foreground">%</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border bg-muted/10">
                            <button
                                onClick={() => {
                                    setSelectedSkills([]);
                                    setMinExperience(0);
                                    setMinScore(0);
                                    setSearchQuery('');
                                    setSearchParams({});
                                }}
                                className="w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium rounded-lg text-sm active:scale-[0.98]">
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Candidate List Central Area */}
                <div className="lg:col-span-3">
                    <div className="glass-panel rounded-2xl h-full max-h-[85vh] flex flex-col overflow-hidden">
                        {/* Header Tabs & Search */}
                        <div className="border-b border-border">
                            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 w-full sm:w-1/2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
                                    <Search className="w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or keyword..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            if (e.target.value) {
                                                setSearchParams({ search: e.target.value });
                                            } else {
                                                setSearchParams({});
                                            }
                                        }}
                                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                                    />
                                </div>
                                <div className="flex items-center gap-2 ml-auto w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                                    {[
                                        { id: 'all', label: 'All' },
                                        { id: 'shortlisted', label: 'Shortlisted' },
                                        { id: 'pending', label: 'Pending' },
                                        { id: 'rejected', label: 'Rejected' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                                                activeTab === tab.id
                                                    ? "bg-foreground text-background border-foreground shadow-sm"
                                                    : "bg-background text-muted-foreground border-border hover:bg-muted"
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto bg-muted/5 scroll-smooth p-2">
                            <div className="space-y-2">

                                {/* Main Map */}
                                {filteredCandidates.length === 0 && !isLoading && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-in fade-in duration-300">
                                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="w-8 h-8 text-muted-foreground/50" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">No candidates found</h3>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">Try adjusting your filters or search query to find what you're looking for.</p>
                                        <button
                                            onClick={() => {
                                                setSelectedSkills([]);
                                                setMinExperience(0);
                                                setMinScore(0);
                                                setSearchQuery('');
                                                setSearchParams({});
                                            }}
                                            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors active:scale-[0.98]"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}

                                {filteredCandidates.map((c) => (
                                    <div key={c.id} className="bg-background/80 backdrop-blur-sm border border-border/60 hover:border-primary/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start justify-between gap-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:-translate-y-0.5 group cursor-default">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            {/* Avatar Area */}
                                            <div className="flex flex-col items-center gap-2 shrink-0">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-sm ${c.bg}`}>
                                                    <span className="font-bold text-sm tracking-wide">{blindHiring ? "?" : c.initial}</span>
                                                </div>
                                                {c.status === 'shortlisted' && <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 p-1 rounded-full"><UserCheck className="w-3 h-3" /></div>}
                                                {c.status === 'rejected' && <div className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 p-1 rounded-full"><UserX className="w-3 h-3" /></div>}
                                            </div>

                                            {/* Info Area */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                    <h3
                                                        className="font-semibold text-lg text-foreground cursor-pointer hover:text-primary transition-colors truncate"
                                                        onClick={() => navigate(`/candidates/${c.id}`)}
                                                    >
                                                        {blindHiring ? `Candidate #${c.id}` : c.name}
                                                    </h3>
                                                    <span className="text-sm font-medium text-muted-foreground truncate">{c.role}</span>
                                                    {c.status === 'shortlisted' && (
                                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                                                            <Tag className="w-3 h-3" /> Top Pick
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground font-medium">
                                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {blindHiring ? "Location Hidden" : c.location}</span>
                                                    <span className="text-border">•</span>
                                                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {c.exp} Yrs Exp.</span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                                    {(c.skills || []).map(skill => (
                                                        <span key={skill} className="px-2.5 py-1 bg-muted/50 border border-border text-foreground rounded-md text-[11px] font-semibold">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {(c.missing || []).map(skill => (
                                                        <span key={skill} className="px-2.5 py-1 bg-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-md text-[11px] font-semibold flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> Missing {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Area */}
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-none border-border">
                                            <div className="flex flex-col items-start sm:items-end gap-0.5">
                                                <span className={`text-3xl font-bold font-mono tracking-tight ${c.textColors}`}>
                                                    {c.score}<span className="text-lg">%</span>
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Match Score</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors tooltip shadow-sm border border-emerald-100" title="Shortlist">
                                                    <ThumbsUp className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors tooltip shadow-sm border border-rose-100" title="Reject">
                                                    <ThumbsDown className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-6 bg-border mx-1"></div>
                                                <button
                                                    onClick={() => navigate(`/candidates/${c.id}`)}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-md rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 hover:-translate-y-0.5"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
