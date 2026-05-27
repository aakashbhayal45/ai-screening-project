import { useState, useEffect } from 'react';
import { Download, Sparkles, FileText, Briefcase, GraduationCap, LayoutTemplate, Settings2, Plus, PenTool, ExternalLink, Zap, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';
import { TemplateModernATS, TemplateClassic, TemplateExecutive, TemplateTechnical, TemplateMinimalist } from '../components/ResumeTemplates';

export default function ResumeBuilder() {
    const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'templates', 'ai'
    const [activeTemplate, setActiveTemplate] = useState('modern-ats');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [resumeData, setResumeData] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        summary: '',
        experience: [],
        skills: '',
        education: [],
        projects: [],
        certifications: []
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/candidates/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data?.data) {
                    const profile = res.data.data;
                    setResumeData({
                        name: profile.name || '',
                        role: profile.role || '',
                        email: profile.contact?.email || '',
                        phone: profile.contact?.phone || '',
                        location: profile.location || '',
                        linkedin: profile.contact?.linkedin || '',
                        portfolio: profile.contact?.portfolio || '',
                        summary: profile.aiSummary || '',
                        experience: profile.parsedData?.experience || [],
                        skills: profile.parsedData?.skills?.join(', ') || '',
                        education: profile.parsedData?.education || []
                    });
                }
            } catch (err) {
                console.log('No profile found or error fetching', err);
                // Leave defaults
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setResumeData({ ...resumeData, [e.target.name]: e.target.value });
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...resumeData.experience];
        newExperience[index][field] = value;
        setResumeData({ ...resumeData, experience: newExperience });
    };

    const addExperience = () => {
        setResumeData({
            ...resumeData,
            experience: [...resumeData.experience, { role: '', company: '', duration: '', location: '', points: [''] }]
        });
    };

    const removeExperience = (index) => {
        const newExperience = resumeData.experience.filter((_, i) => i !== index);
        setResumeData({ ...resumeData, experience: newExperience });
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...(resumeData.projects || [])];
        newProjects[index][field] = value;
        setResumeData({ ...resumeData, projects: newProjects });
    };

    const addProject = () => {
        setResumeData({
            ...resumeData,
            projects: [...(resumeData.projects || []), { name: '', tech: '', link: '', description: '' }]
        });
    };

    const removeProject = (index) => {
        const newProjects = (resumeData.projects || []).filter((_, i) => i !== index);
        setResumeData({ ...resumeData, projects: newProjects });
    };

    const handleCertificationChange = (index, field, value) => {
        const newCerts = [...(resumeData.certifications || [])];
        newCerts[index][field] = value;
        setResumeData({ ...resumeData, certifications: newCerts });
    };

    const addCertification = () => {
        setResumeData({
            ...resumeData,
            certifications: [...(resumeData.certifications || []), { name: '', issuer: '', date: '' }]
        });
    };

    const removeCertification = (index) => {
        const newCerts = (resumeData.certifications || []).filter((_, i) => i !== index);
        setResumeData({ ...resumeData, certifications: newCerts });
    };

    const [isGenerating, setIsGenerating] = useState(false);

    const handleAIEnhance = () => {
        if (isGenerating) return;
        setIsGenerating(true);
        setTimeout(() => {
            setResumeData(prev => ({
                ...prev,
                summary: 'Highly driven professional with expertise in architecting and delivering scalable, high-performance solutions. Demonstrated success in leading complex projects and driving continuous improvement. Passionate about establishing robust technical standards and achieving peak execution.'
            }));
            setIsGenerating(false);
        }, 1500);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const expArray = Array.isArray(resumeData.experience) ? resumeData.experience : [];
            const expTransformed = expArray.map(e => ({
                role: e.role,
                company: e.company,
                duration: e.duration,
                location: e.location,
                points: typeof e.points === 'string' ? e.points.split('\n') : (e.points || [])
            }));

            const payload = {
                name: resumeData.name,
                role: resumeData.role,
                location: resumeData.location,
                aiSummary: resumeData.summary,
                initial: resumeData.name ? resumeData.name.substring(0, 2).toUpperCase() : 'ME',
                contact: {
                    email: resumeData.email,
                    phone: resumeData.phone,
                    linkedin: resumeData.linkedin,
                    portfolio: resumeData.portfolio
                },
                parsedData: {
                    skills: resumeData.skills.split(',').map(s => s.trim()).filter(s => s),
                    experience: expTransformed,
                    education: resumeData.education || []
                }
            };

            await axios.post('/api/candidates', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTimeout(() => setIsSaving(false), 1000);
        } catch (error) {
            console.error('Failed to save', error);
            setIsSaving(false);
            alert('Failed to save profile');
        }
    };

    if (isLoading) {
        return <div className="max-w-6xl mx-auto py-24 text-center animate-pulse text-muted-foreground">Loading Resume Studio...</div>;
    }

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col -m-6 md:-m-8 animate-in fade-in duration-500 bg-background text-foreground overflow-hidden">
            {/* Toolbar */}
            <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <PenTool className="w-5 h-5 text-primary" /> Studio
                    </h1>
                    <div className="h-6 w-px bg-border hidden sm:block"></div>
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">Draft: {resumeData.role || 'New Role'}</span>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
                    <button onClick={() => setActiveTab('editor')} className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'editor' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}>Editor</button>
                    <button onClick={() => setActiveTab('templates')} className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'templates' ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground")}>Templates</button>
                    <button onClick={() => setActiveTab('ai')} className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5", activeTab === 'ai' ? "bg-primary/10 text-primary shadow-sm" : "text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30")}>
                        <Sparkles className="w-3.5 h-3.5" /> AI Tools
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm shadow-md disabled:opacity-70"
                    >
                        {isSaving ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isSaving ? "Saved" : "Save Resume"}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-background border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-sm shadow-sm hidden md:flex">
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            {/* Main Content Split */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Editor/Tools */}
                <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col border-r border-border bg-card shrink-0">
                    {activeTab === 'editor' && (
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
                            {/* Personal Details */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" /> Personal Info
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Full Name</label>
                                        <input name="name" value={resumeData.name} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Job Title</label>
                                        <input name="role" value={resumeData.role} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Email</label>
                                        <input name="email" value={resumeData.email} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Phone</label>
                                        <input name="phone" value={resumeData.phone} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">Location</label>
                                        <input name="location" value={resumeData.location} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-foreground">LinkedIn</label>
                                        <input name="linkedin" value={resumeData.linkedin} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-border/50" />

                            {/* Summary */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-primary" /> Professional Summary
                                    </h3>
                                    <button
                                        onClick={handleAIEnhance}
                                        disabled={isGenerating}
                                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
                                    >
                                        {isGenerating ? "Enhancing..." : <><Sparkles className="w-3 h-3" /> Auto-Rewrite</>}
                                    </button>
                                </div>
                                <textarea name="summary" value={resumeData.summary} onChange={handleChange} rows="4" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 leading-relaxed"></textarea>
                            </section>

                            <hr className="border-border/50" />

                            {/* Experience */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-primary" /> Experience
                                    </h3>
                                    <button onClick={addExperience} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                        <Plus className="w-3 h-3" /> Add Role
                                    </button>
                                </div>

                                <div className="space-y-6 flex flex-col">
                                    {(resumeData.experience || []).map((exp, index) => (
                                        <div key={index} className="p-4 bg-muted/40 border border-border rounded-lg space-y-4 relative group">
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => removeExperience(index)} className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded">Remove</button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Role</label>
                                                    <input value={exp.role || ''} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Company</label>
                                                    <input value={exp.company || ''} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Duration</label>
                                                    <input value={exp.duration || ''} onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)} placeholder="e.g. Jan 2021 - Present" className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Location</label>
                                                    <input value={exp.location || ''} onChange={(e) => handleExperienceChange(index, 'location', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Responsibilities</label>
                                                    <button className="text-[10px] font-bold text-indigo-500 flex items-center gap-1 hover:underline"><Sparkles className="w-3 h-3" /> Improve Bullets</button>
                                                </div>
                                                <textarea value={Array.isArray(exp.points) ? exp.points.join('\n') : exp.points} onChange={(e) => handleExperienceChange(index, 'points', e.target.value)} rows="3" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 leading-relaxed font-mono text-xs"></textarea>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <hr className="border-border/50" />

                            {/* Skills */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-primary" /> Skills
                                </h3>
                                <textarea name="skills" value={resumeData.skills} onChange={handleChange} rows="3" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 leading-relaxed font-mono text-xs"></textarea>
                                <p className="text-[11px] text-muted-foreground">Separate skills with commas.</p>
                            </section>
                            
                            {/* Dynamic Sections Based on Template */}
                            {(activeTemplate === 'technical' || activeTemplate === 'modern-ats') && (
                                <>
                                    <hr className="border-border/50" />
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" /> Technical Projects
                                            </h3>
                                            <button onClick={addProject} className="text-xs font-bold text-indigo-500 flex items-center gap-1 hover:underline">
                                                <Plus className="w-3 h-3" /> Add Project
                                            </button>
                                        </div>
                                        {/* Contextual Hint based on template */}
                                        <p className="text-xs text-muted-foreground bg-indigo-50/50 dark:bg-indigo-900/10 p-2 rounded-md border border-indigo-100 dark:border-indigo-900/50">
                                            <AlertCircle className="inline-block w-3 h-3 mr-1 text-indigo-400" />
                                            The <strong>{activeTemplate.replace('-', ' ')}</strong> template highlights technical projects prominently. Ensure you include repository links and tech stack.
                                        </p>
                                        <div className="space-y-6 flex flex-col">
                                            {(resumeData.projects || []).map((proj, index) => (
                                                <div key={index} className="p-4 bg-muted/40 border border-border rounded-lg space-y-4 relative group">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => removeProject(index)} className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded">Remove</button>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Project Name</label>
                                                            <input value={proj.name} onChange={(e) => handleProjectChange(index, 'name', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500" />
                                                        </div>
                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tech Stack</label>
                                                            <input value={proj.tech} onChange={(e) => handleProjectChange(index, 'tech', e.target.value)} placeholder="React, Node, MongoDB..." className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5 flex flex-col">
                                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Project Link</label>
                                                        <input value={proj.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500" />
                                                    </div>
                                                    <div className="space-y-1.5 flex flex-col">
                                                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                                                        <textarea value={proj.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} rows="2" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </>
                            )}

                            {(activeTemplate === 'executive' || activeTemplate === 'classic') && (
                                <>
                                    <hr className="border-border/50" />
                                    <section className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4" /> Certifications
                                            </h3>
                                            <button onClick={addCertification} className="text-xs font-bold text-slate-600 flex items-center gap-1 hover:underline">
                                                <Plus className="w-3 h-3" /> Add Cert
                                            </button>
                                        </div>
                                        <p className="text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                                            <AlertCircle className="inline-block w-3 h-3 mr-1 text-slate-400" />
                                            The <strong>{activeTemplate}</strong> template emphasizes external credentials and certifications to establish authority.
                                        </p>
                                        <div className="space-y-4 flex flex-col">
                                            {(resumeData.certifications || []).map((cert, index) => (
                                                <div key={index} className="p-4 bg-muted/40 border border-border rounded-lg space-y-4 relative group">
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => removeCertification(index)} className="text-[10px] uppercase font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded">Remove</button>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                                                            <input value={cert.name} onChange={(e) => handleCertificationChange(index, 'name', e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-slate-500" />
                                                        </div>
                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Issuer</label>
                                                            <input value={cert.issuer} onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)} placeholder="e.g. Amazon Web Services" className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-slate-500" />
                                                        </div>
                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
                                                            <input value={cert.date} onChange={(e) => handleCertificationChange(index, 'date', e.target.value)} placeholder="e.g. 2023" className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-slate-500" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'templates' && (
                        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar flex items-center justify-center text-center flex-col">
                            <LayoutTemplate className="w-16 h-16 text-muted-foreground/20 mb-4" />
                            <h3 className="text-lg font-bold">Template Gallery</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">Select from dozens of ATS-optimized templates tailored for specific industries.</p>
                            <button className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold">Browse Templates</button>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar bg-indigo-50/30 dark:bg-indigo-950/10">
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-card border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-5 shadow-sm">
                                    <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-indigo-500" /> Target Job Description
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-4">Paste a job description to tailor your resume specifically for that role.</p>
                                    <textarea placeholder="Paste JD here..." rows="4" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none"></textarea>
                                    <button className="w-full mt-3 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-sm rounded-lg transition-colors">
                                        Analyze Match Score
                                    </button>
                                </div>

                                <div className="bg-white dark:bg-card border border-border rounded-xl p-5 shadow-sm">
                                    <h3 className="font-bold text-foreground mb-3 border-b border-border pb-2">AI Optimization Checklist</h3>
                                    <ul className="space-y-3">
                                        <li className="flex gap-3 items-start">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">Action Verbs Used</p>
                                                <p className="text-[11px] text-muted-foreground">Strong start to bullet points.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-3 items-start">
                                            <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"><AlertCircle className="w-3 h-3" /></div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">Quantify Impact</p>
                                                <p className="text-[11px] text-muted-foreground">Try to add more metrics (%, $, time) to Experience.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Live Preview */}
                <div className="hidden lg:flex flex-1 bg-muted/30 overflow-y-auto items-start justify-center p-8 hide-scrollbar relative">
                    {/* Floating tools */}
                    <div className="fixed bottom-8 right-8 flex gap-2 z-20">
                        <button className="w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors" title="Zoom In">+</button>
                        <button className="w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors" title="Zoom Out">-</button>
                        <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors" title="Preview Full Screen"><ExternalLink className="w-4 h-4" /></button>
                    </div>

                    {/* A4 Paper rendering dynamically based on activeTemplate */}
                    {activeTemplate === 'modern-ats' && <TemplateModernATS data={resumeData} />}
                    {activeTemplate === 'classic' && <TemplateClassic data={resumeData} />}
                    {activeTemplate === 'executive' && <TemplateExecutive data={resumeData} />}
                    {activeTemplate === 'technical' && <TemplateTechnical data={resumeData} />}
                    {activeTemplate === 'minimalist' && <TemplateMinimalist data={resumeData} />}

                </div>
            </div>
        </div>
    );
}
