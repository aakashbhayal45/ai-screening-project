import { ArrowLeft, CheckCircle2, AlertCircle, FileText, Download, Briefcase, GraduationCap, MapPin, Sparkles, Target, Zap, Building2, Calendar, ChevronRight, Star, MessageSquare } from 'lucide-react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CandidateDetail() {
    const { blindHiring } = useOutletContext();
    const { id } = useParams();
    const [candidateData, setCandidateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/candidates/${id}`, {
                    headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
                });
                if (res.data?.success) {
                    setCandidateData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch candidate details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidate();
    }, [id]);

    if (loading) {
        return <div className="max-w-6xl mx-auto h-96 flex items-center justify-center font-medium my-10 bg-card rounded-xl border border-border">Loading profile...</div>;
    }

    if (!candidateData) {
        return <div className="max-w-6xl mx-auto h-96 flex items-center justify-center font-medium my-10 text-rose-500 bg-card rounded-xl border border-border">Candidate not found</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
            <Link to="/candidates" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-2 group transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" /> Back to Candidates
            </Link>

            {/* Header Profile */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden relative">
                {/* Decorative Background */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>

                <div className="p-6 sm:p-8 pt-12 relative flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-background shadow-md flex items-center justify-center border-4 border-card relative z-10 shrink-0">
                            <span className="font-bold text-3xl text-primary">{blindHiring ? "?" : candidateData.initial}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-foreground tracking-tight">
                                    {blindHiring ? `Candidate #${id || '1042'}` : candidateData.name}
                                </h1>
                                {candidateData.status === 'shortlisted' && (
                                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-200 dark:border-emerald-800/50">Shortlisted</span>
                                )}
                            </div>
                            <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary/70" /> {candidateData.role}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {blindHiring ? "Hidden email" : candidateData.email}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {blindHiring ? "Hidden Location" : candidateData.location}</span>
                                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-500" /> Active Candidate</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-4 min-w-[200px]">
                        <div className="flex items-end gap-3 text-right">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">AI Match Score</span>
                                <span className="text-5xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-600">
                                    {candidateData.score}<span className="text-2xl text-emerald-600/50">%</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-4 py-2 bg-background border border-border hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-sm font-semibold transition-all shadow-sm">
                                Reject
                            </button>
                            <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Shortlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: AI Analysis & Skills */}
                <div className="lg:col-span-1 space-y-6">
                    {/* AI Executive Summary */}
                    <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
                        <h3 className="font-semibold flex items-center gap-2 mb-3 text-indigo-900 dark:text-indigo-300">
                            <Sparkles className="w-5 h-5 text-indigo-500" /> AI Executive Summary
                        </h3>
                        <p className="text-sm leading-relaxed text-indigo-950/70 dark:text-indigo-200/70 font-medium">
                            {candidateData.aiSummary}
                        </p>
                    </div>

                    {/* Skill Gap Analysis */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Target className="w-4 h-4 text-primary" /> Skill Match Analysis
                            </h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div>
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched Requirements
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {candidateData.matchingSkills.map(skill => (
                                        <span key={skill} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-md text-xs font-semibold shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-border" />

                            <div>
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
                                    <AlertCircle className="w-3.5 h-3.5" /> Missing Requirements
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {candidateData.missingSkills.map(skill => (
                                        <span key={skill} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-md text-xs font-semibold shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Interview Prep */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" /> AI Interview Prep
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-xs text-muted-foreground font-medium mb-2">Suggested questions to probe weak areas:</p>

                            <div className="space-y-3">
                                {candidateData.missingSkills.map((skill, index) => (
                                    <div key={skill} className="bg-muted/30 rounded-lg p-3 border border-border text-sm">
                                        <span className="font-bold text-foreground text-xs uppercase tracking-wider block mb-1.5 flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">{index + 1}</span>
                                            Probe: {skill}
                                        </span>
                                        <p className="text-muted-foreground italic leading-relaxed">
                                            "Can you discuss a time when you needed to understand or integrate with {skill}? How did you approach learning it?"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Internal Notes & Rating (HR ONLY) */}
                    <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 rounded-xl shadow-sm overflow-hidden mt-6">
                        <div className="p-4 border-b border-amber-200/50 dark:border-amber-500/20 bg-amber-100/30 dark:bg-amber-500/10">
                            <h3 className="font-semibold text-amber-900 dark:text-amber-500 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Internal HR Notes
                            </h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-amber-900/70 dark:text-amber-500/70">Candidate Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} className={`p-1 hover:scale-110 transition-transform ${star <= 4 ? 'text-amber-500' : 'text-amber-200 dark:text-amber-900'}`}>
                                            <Star className="w-6 h-6 fill-current" />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-semibold text-amber-700/80 dark:text-amber-500/80 self-center">4.0 / 5</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-amber-900/70 dark:text-amber-500/70 block">Private Comments</label>
                                <textarea
                                    placeholder="Add notes about culture fit, salary expectations, etc..."
                                    className="w-full h-24 bg-background border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none text-foreground placeholder:text-muted-foreground/50"
                                    defaultValue="Strong technical skills. Culture fit is excellent."
                                ></textarea>
                                <button className="w-full mt-2 py-2 bg-amber-200/50 hover:bg-amber-300/50 border border-amber-300 dark:bg-amber-500/20 dark:border-amber-500/30 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-400 font-semibold rounded-lg text-sm transition-colors shadow-sm">
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Resume Details (Experience & Education) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between sticky top-0 z-10">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Extracted Resume Details
                            </h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-xs font-semibold hover:bg-muted transition-colors shadow-sm text-foreground">
                                <Download className="w-3.5 h-3.5" /> Original PDF
                            </button>
                        </div>

                        <div className="p-6 md:p-8 space-y-10 flex-1 overflow-y-auto">
                            {/* Experience Section */}
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                                    <Briefcase className="w-4 h-4 text-primary" /> Work Experience
                                </h4>

                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                    {candidateData.experience.map((exp, index) => (
                                        <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            {/* Timeline dot */}
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-125">
                                                <div className="w-1.5 h-1.5 bg-background rounded-full"></div>
                                            </div>

                                            {/* Content card */}
                                            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-5 rounded-xl border border-border bg-background shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                                    <div>
                                                        <h5 className="font-bold text-foreground text-base tracking-tight">{exp.role}</h5>
                                                        <span className="text-sm font-medium text-primary flex items-center gap-1.5 mt-0.5">
                                                            <Building2 className="w-3.5 h-3.5" /> {exp.company}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col sm:items-end text-xs font-semibold text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-md w-fit">
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.duration}</span>
                                                    </div>
                                                </div>
                                                <ul className="space-y-2 mt-4">
                                                    {exp.points.map((point, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground/90 group-hover:text-foreground transition-colors">
                                                            <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                            <span className="leading-relaxed">{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-border border-dashed" />

                            {/* Education Section */}
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                                    <GraduationCap className="w-4 h-4 text-primary" /> Education
                                </h4>

                                <div className="space-y-6">
                                    {candidateData.education.map(edu => (
                                        <div key={edu.id} className="p-5 rounded-xl border border-border bg-background shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                                                    <GraduationCap className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-foreground">{edu.degree}</h5>
                                                    <p className="text-sm font-medium text-muted-foreground">{edu.school}</p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md w-fit">
                                                {edu.duration}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
