import {
    Settings,
    Link as LinkIcon,
    Users,
    Shield,
    Database,
    Bell,
    Save,
    CheckCircle2,
    Briefcase,
    Brain,
    LayoutDashboard,
    Globe,
    BarChart3,
    Upload
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/settings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSettings(res.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to fetch settings', err);
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/settings', settings, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Apply theme immediately after saving
            const theme = settings.general?.theme || 'System Default';
            const root = document.documentElement;
            root.classList.remove('dark');
            if (theme === 'Dark Mode') {
                root.classList.add('dark');
            } else if (theme === 'System Default') {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    root.classList.add('dark');
                }
            }

            setTimeout(() => setIsSaving(false), 1000);
        } catch (err) {
            console.error('Failed to save settings', err);
            setIsSaving(false);
        }
    };

    const handleChange = (category, field, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const tabs = [
        { id: 'general', name: 'General Settings', icon: Settings },
        { id: 'screening', name: 'Job & Screening', icon: Briefcase },
        { id: 'ai', name: 'AI Model Settings', icon: Brain },
        { id: 'notifications', name: 'Email & Notifications', icon: Bell },
        { id: 'team', name: 'User & Roles', icon: Users },
        { id: 'dashboard', name: 'Dashboard Customization', icon: LayoutDashboard },
        { id: 'security', name: 'Security Settings', icon: Shield },
        { id: 'data', name: 'Resume Database', icon: Database },
        { id: 'integrations', name: 'Integration Settings', icon: LinkIcon },
        { id: 'analytics', name: 'Analytics Settings', icon: BarChart3 },
    ];

    const integrations = [
        { name: 'Workday', status: 'Connected', logo: 'W', color: 'bg-blue-600', text: 'text-white' },
        { name: 'Greenhouse', status: 'Disconnected', logo: 'Gh', color: 'bg-emerald-500', text: 'text-white' },
        { name: 'Lever', status: 'Disconnected', logo: 'L', color: 'bg-indigo-500', text: 'text-white' },
        { name: 'BambooHR', status: 'Connected', logo: 'B', color: 'bg-green-500', text: 'text-white' },
    ];

    if (isLoading || !settings) {
        return <div className="max-w-6xl mx-auto py-24 text-center text-muted-foreground animate-pulse">Loading configurations...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage all aspects of your organization's recruiting platform.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70"
                >
                    {isSaving ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {isSaving ? "Saved Settings" : "Save All Changes"}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-card border border-border text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                                )}
                            >
                                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    {/* 1. General Settings */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                                <h2 className="text-xl font-bold text-foreground mb-4">Organization Profile</h2>

                                <div className="flex items-center gap-6 pb-6 border-b border-border">
                                    <div className="w-20 h-20 rounded-xl bg-muted border border-border flex items-center justify-center shrink-0">
                                        <Briefcase className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Company Logo</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Upload a high-res square logo (PNG or JPG).</p>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border font-medium text-sm rounded-lg hover:bg-muted"><Upload className="w-4 h-4" /> Upload</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Company Name</label>
                                        <input value={settings.general.companyName} onChange={e => handleChange('general', 'companyName', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Default Language</label>
                                        <select value={settings.general.defaultLanguage} onChange={e => handleChange('general', 'defaultLanguage', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none">
                                            <option>English (US)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Time Zone</label>
                                        <select value={settings.general.timeZone} onChange={e => handleChange('general', 'timeZone', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none">
                                            <option>(UTC-08:00) Pacific Time</option>
                                            <option>(UTC-05:00) Eastern Time</option>
                                            <option>(UTC+00:00) London</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">System Date & Time Format</label>
                                        <select value={settings.general.dateTimeFormat} onChange={e => handleChange('general', 'dateTimeFormat', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none">
                                            <option>MM/DD/YYYY, 12-hour</option>
                                            <option>DD/MM/YYYY, 24-hour</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-foreground">Email Notifications</h4>
                                            <p className="text-sm text-muted-foreground">Receive daily summaries for system activities.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={settings.general.emailNotifications} onChange={e => handleChange('general', 'emailNotifications', e.target.checked)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-foreground">Dark/Light Mode Default</h4>
                                            <p className="text-sm text-muted-foreground">Set the default appearance for all users.</p>
                                        </div>
                                        <select value={settings.general.theme} onChange={e => handleChange('general', 'theme', e.target.value)} className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none">
                                            <option>System Default</option>
                                            <option>Light Mode</option>
                                            <option>Dark Mode</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Job & Screening Settings */}
                    {activeTab === 'screening' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                                <h2 className="text-xl font-bold text-foreground mb-4">Job & Screening Engine Settings</h2>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-foreground pb-2 border-b border-border">Scoring Configuration</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground">Skills (%)</label>
                                            <input type="number" value={settings.screening.skillsWeight} onChange={e => handleChange('screening', 'skillsWeight', Number(e.target.value))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-center text-sm focus:ring-1 focus:ring-primary focus:outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground">Experience (%)</label>
                                            <input type="number" value={settings.screening.experienceWeight} onChange={e => handleChange('screening', 'experienceWeight', Number(e.target.value))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-center text-sm focus:ring-1 focus:ring-primary focus:outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground">Education (%)</label>
                                            <input type="number" value={settings.screening.educationWeight} onChange={e => handleChange('screening', 'educationWeight', Number(e.target.value))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-center text-sm focus:ring-1 focus:ring-primary focus:outline-none" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-muted-foreground">Certifications (%)</label>
                                            <input type="number" value={settings.screening.certificationsWeight} onChange={e => handleChange('screening', 'certificationsWeight', Number(e.target.value))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-center text-sm focus:ring-1 focus:ring-primary focus:outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Minimum Score Threshold</label>
                                            <p className="text-xs text-muted-foreground">Auto-reject candidates scoring below this.</p>
                                            <input type="number" value={settings.screening.minScoreThreshold} onChange={e => handleChange('screening', 'minScoreThreshold', Number(e.target.value))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" placeholder="e.g. 60" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Custom Ranking Formula</label>
                                            <select value={settings.screening.rankingFormula} onChange={e => handleChange('screening', 'rankingFormula', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                                <option>Standard Balanced</option>
                                                <option>Heavy Skills Focus</option>
                                                <option>Heavy Experience Focus</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h3 className="font-semibold text-foreground pb-2 border-b border-border">Keyword Matching</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Required Global Keywords</label>
                                            <input value={settings.screening.requiredKeywords} onChange={e => handleChange('screening', 'requiredKeywords', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Preferred Global Keywords</label>
                                            <input value={settings.screening.preferredKeywords} onChange={e => handleChange('screening', 'preferredKeywords', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer group">
                                            <input type="checkbox" checked={settings.screening.enableSynonyms} onChange={e => handleChange('screening', 'enableSynonyms', e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                            <span>Enable Synonym Matching</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer group">
                                            <input type="checkbox" checked={settings.screening.exactMatchOnly} onChange={e => handleChange('screening', 'exactMatchOnly', e.target.checked)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                            <span>Require Exact Matches Only</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h3 className="font-semibold text-foreground pb-2 border-b border-border">Experience & Education Rules</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Default Min. Experience (Years)</label>
                                            <input type="number" value={settings.screening.minExperience} onChange={e => handleChange('screening', 'minExperience', Number(e.target.value))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Count Internships as Experience</label>
                                            <select value={settings.screening.internshipCredit} onChange={e => handleChange('screening', 'internshipCredit', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                                <option>Yes, 50% credit</option>
                                                <option>Yes, full credit</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Tier-1 College Boost</label>
                                            <select value={settings.screening.collegeBoost} onChange={e => handleChange('screening', 'collegeBoost', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                                <option>Apply +15% Boost</option>
                                                <option>Apply +5% Boost</option>
                                                <option>None</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Default Required Degree</label>
                                            <input value={settings.screening.defaultDegree} onChange={e => handleChange('screening', 'defaultDegree', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. AI Model Settings */}
                    {activeTab === 'ai' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                                <h2 className="text-xl font-bold text-foreground mb-4">AI Model Configuration</h2>
                                <p className="text-sm text-muted-foreground mt-1 mb-6">Tune how the AI evaluates resumes and generates insights.</p>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">AI Strictness Level</label>
                                        <p className="text-xs text-muted-foreground mb-2">Dictates how heavily the AI penalizes missing requirements.</p>
                                        <div className="flex gap-4">
                                            {['Low', 'Medium', 'High'].map((level) => (
                                                <label key={level} className="flex-1">
                                                    <input type="radio" name="strictness" value={level} checked={settings.ai.strictness === level} onChange={e => handleChange('ai', 'strictness', e.target.value)} className="peer sr-only" />
                                                    <div className="px-4 py-3 text-center border border-border rounded-lg cursor-pointer peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary hover:bg-muted font-medium text-sm transition-colors">
                                                        {level}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <label className="text-sm font-semibold text-foreground">Bias Reduction Mode</label>
                                        <p className="text-xs text-muted-foreground mb-2">Masks names, genders, and pictures during AI initial parsing.</p>
                                        <select value={settings.ai.biasReduction} onChange={e => handleChange('ai', 'biasReduction', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                            <option>Strict (Mask All PII)</option>
                                            <option>Moderate (Mask Names & Photos)</option>
                                            <option>Off</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <label className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <h4 className="font-medium text-foreground">Auto Resume Parsing</h4>
                                                <p className="text-sm text-muted-foreground">Run OCR and parsing instantly upon upload.</p>
                                            </div>
                                            <input type="checkbox" checked={settings.ai.autoParse} onChange={e => handleChange('ai', 'autoParse', e.target.checked)} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                                        </label>
                                        <label className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <h4 className="font-medium text-foreground">Duplicate Resume Detection</h4>
                                                <p className="text-sm text-muted-foreground">Flag applications if similarity &gt; 95%.</p>
                                            </div>
                                            <input type="checkbox" checked={settings.ai.duplicateDetection} onChange={e => handleChange('ai', 'duplicateDetection', e.target.checked)} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                                        </label>
                                        <label className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <h4 className="font-medium text-foreground">AI Feedback Generation</h4>
                                                <p className="text-sm text-muted-foreground">Auto-generate feedback summaries for rejected candidates.</p>
                                            </div>
                                            <input type="checkbox" checked={settings.ai.feedbackGeneration} onChange={e => handleChange('ai', 'feedbackGeneration', e.target.checked)} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                                        </label>
                                        <label className="flex items-center justify-between group cursor-pointer">
                                            <div>
                                                <h4 className="font-medium text-foreground">Resume Red Flag Detection</h4>
                                                <p className="text-sm text-muted-foreground">Detect large employment gaps and frequent job hopping.</p>
                                            </div>
                                            <input type="checkbox" checked={settings.ai.redFlagDetection} onChange={e => handleChange('ai', 'redFlagDetection', e.target.checked)} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Email & Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                                <h2 className="text-xl font-bold text-foreground mb-4">Email & Communication</h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Auto Interview Shortlist Template</label>
                                        <textarea value={settings.notifications.shortlistTemplate} onChange={e => handleChange('notifications', 'shortlistTemplate', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary h-24" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Rejection Email Template</label>
                                        <textarea value={settings.notifications.rejectionTemplate} onChange={e => handleChange('notifications', 'rejectionTemplate', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary h-24" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Interview Reminder Template</label>
                                        <textarea value={settings.notifications.reminderTemplate} onChange={e => handleChange('notifications', 'reminderTemplate', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary h-20" />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-border">
                                    <h3 className="font-medium text-foreground">HR Notification Alerts</h3>
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" checked={settings.notifications.alertApply} onChange={e => handleChange('notifications', 'alertApply', e.target.checked)} className="w-4 h-4 rounded text-primary" />
                                        <span className="text-sm text-foreground">Email when Candidate Applies</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" checked={settings.notifications.alertStatus} onChange={e => handleChange('notifications', 'alertStatus', e.target.checked)} className="w-4 h-4 rounded text-primary" />
                                        <span className="text-sm text-foreground">Candidate Status Update Alerts</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" checked={settings.notifications.alertDigest} onChange={e => handleChange('notifications', 'alertDigest', e.target.checked)} className="w-4 h-4 rounded text-primary" />
                                        <span className="text-sm text-foreground">Daily Digest of Hiring Activities</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 5. User & Role Management */}
                    {activeTab === 'team' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-foreground">User & Role Management</h2>
                                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90">Invite User</button>
                                </div>

                                <div className="border border-border rounded-lg overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted text-muted-foreground border-b border-border">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Name</th>
                                                <th className="px-4 py-3 font-medium">Email</th>
                                                <th className="px-4 py-3 font-medium">Role</th>
                                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border bg-card">
                                            <tr>
                                                <td className="px-4 py-3 text-foreground font-medium">Admin User</td>
                                                <td className="px-4 py-3 text-muted-foreground">admin@acme.com</td>
                                                <td className="px-4 py-3"><span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">Super Admin</span></td>
                                                <td className="px-4 py-3 text-right"><button className="text-primary hover:underline text-xs">Edit</button></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-foreground font-medium">Sarah HR</td>
                                                <td className="px-4 py-3 text-muted-foreground">sarah@acme.com</td>
                                                <td className="px-4 py-3"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs font-semibold">HR</span></td>
                                                <td className="px-4 py-3 text-right"><button className="text-primary hover:underline text-xs">Edit</button></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-foreground font-medium">Mike Recruiter</td>
                                                <td className="px-4 py-3 text-muted-foreground">mike@acme.com</td>
                                                <td className="px-4 py-3"><span className="px-2 py-1 bg-indigo-500/10 text-indigo-600 rounded text-xs font-semibold">Recruiter</span></td>
                                                <td className="px-4 py-3 text-right"><button className="text-primary hover:underline text-xs">Edit</button></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-foreground font-medium">John Manager</td>
                                                <td className="px-4 py-3 text-muted-foreground">john@acme.com</td>
                                                <td className="px-4 py-3"><span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded text-xs font-semibold">Hiring Manager</span></td>
                                                <td className="px-4 py-3 text-right"><button className="text-primary hover:underline text-xs">Edit</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <h3 className="font-semibold text-foreground">Audit & Activity</h3>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-muted"><Database className="w-4 h-4" /> Download Activity Logs (CSV)</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. Dashboard Customization */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                                <h2 className="text-xl font-bold text-foreground mb-4">Dashboard Customization</h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Default Dashboard View</label>
                                        <select value={settings.dashboard.defaultView} onChange={e => handleChange('dashboard', 'defaultView', e.target.value)} className="w-full max-w-sm bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                            <option>Cards Grid View</option>
                                            <option>List / Table View</option>
                                            <option>Pipeline Kanban Board</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Visible Table Columns (List View)</label>
                                        <p className="text-xs text-muted-foreground mb-2">Select what information is shown by default.</p>
                                        <div className="flex flex-wrap gap-3">
                                            {['Name', 'Score', 'Status', 'Applied Date', 'Experience', 'Education', 'Actions'].map(col => (
                                                <label key={col} className="flex items-center gap-2 p-2 border border-border rounded hover:bg-muted cursor-pointer shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={settings.dashboard.visibleColumns.includes(col)}
                                                        onChange={e => {
                                                            const newCols = e.target.checked
                                                                ? [...settings.dashboard.visibleColumns, col]
                                                                : settings.dashboard.visibleColumns.filter(c => c !== col);
                                                            handleChange('dashboard', 'visibleColumns', newCols);
                                                        }}
                                                        className="w-4 h-4 rounded text-primary"
                                                    />
                                                    <span className="text-sm">{col}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-4 border-t border-border">
                                        <label className="text-sm font-semibold text-foreground">Default Export Format</label>
                                        <select value={settings.dashboard.exportFormat} onChange={e => handleChange('dashboard', 'exportFormat', e.target.value)} className="w-full max-w-sm bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                            <option>CSV Data</option>
                                            <option>Excel Worksheet</option>
                                            <option>PDF Report</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center justify-between group cursor-pointer max-w-md">
                                        <div>
                                            <h4 className="font-medium text-foreground">Auto Report Generation</h4>
                                            <p className="text-xs text-muted-foreground">Automatically compile end-of-week hiring reports.</p>
                                        </div>
                                        <input type="checkbox" checked={settings.dashboard.autoReport} onChange={e => handleChange('dashboard', 'autoReport', e.target.checked)} className="w-5 h-5 rounded border-border text-primary" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 7. Security Settings */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
                                <h2 className="text-xl font-bold text-foreground">Security Policies</h2>

                                <div className="space-y-6">
                                    <label className="flex items-center justify-between group cursor-pointer border-b border-border pb-4">
                                        <div>
                                            <h4 className="font-medium text-foreground">Force Two-Factor Authentication (2FA)</h4>
                                            <p className="text-sm text-muted-foreground">Require all staff users to configure 2FA.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={settings.security.force2FA} onChange={e => handleChange('security', 'force2FA', e.target.checked)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-border">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Password Policy Set</label>
                                            <select value={settings.security.passwordPolicy} onChange={e => handleChange('security', 'passwordPolicy', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                                <option>Strict (8+ chars, num, symbol, uppercase)</option>
                                                <option>Standard (8+ chars, num)</option>
                                                <option>Basic (6+ chars)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Session Timeout Duration</label>
                                            <select value={settings.security.sessionTimeout} onChange={e => handleChange('security', 'sessionTimeout', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                                <option>15 Minutes Idle</option>
                                                <option>30 Minutes Idle</option>
                                                <option>1 Hour Idle</option>
                                                <option>24 Hours (Persistent)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pb-4 border-b border-border">
                                        <label className="text-sm font-semibold text-foreground">IP Restriction Allowlist (CIDR)</label>
                                        <p className="text-xs text-muted-foreground mb-2">Restrict HR dashboard access to corporate VPN IPs.</p>
                                        <input type="text" value={settings.security.ipAllowlist} onChange={e => handleChange('security', 'ipAllowlist', e.target.value)} placeholder="e.g. 192.168.1.0/24 (Leave blank for everywhere)" className="w-full max-w-md bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Data Encryption Settings</label>
                                        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm">
                                            <Shield className="w-4 h-4" /> AES-256 Encryption at Rest is Active
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 8. Resume Database Settings */}
                    {activeTab === 'data' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                                <h2 className="text-xl font-bold text-foreground mb-4">Resume Database & Compliance</h2>

                                <div className="space-y-4 max-w-xl">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Candidate Data Retention Period</label>
                                        <select value={settings.data.retentionPeriod} onChange={e => handleChange('data', 'retentionPeriod', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                                            <option>6 Months</option>
                                            <option>1 Year</option>
                                            <option>2 Years</option>
                                            <option>Indefinitely</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center justify-between group cursor-pointer pt-2">
                                        <div>
                                            <h4 className="font-medium text-foreground">Auto Delete After Policy Expires</h4>
                                            <p className="text-xs text-muted-foreground">Hard delete resumes past retention date.</p>
                                        </div>
                                        <input type="checkbox" checked={settings.data.autoDelete} onChange={e => handleChange('data', 'autoDelete', e.target.checked)} className="w-5 h-5 rounded border-border text-primary" />
                                    </label>

                                    <div className="space-y-2 pt-4 border-t border-border">
                                        <label className="text-sm font-semibold text-foreground">GDPR/CCPA Compliance Mode</label>
                                        <p className="text-xs text-muted-foreground mb-2">Requires express consent checkboxes on application forms.</p>
                                        <select value={settings.data.complianceMode} onChange={e => handleChange('data', 'complianceMode', e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary">
                                            <option>Strict (Consent Required & Data Portable)</option>
                                            <option>Standard</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-border">
                                        <label className="text-sm font-semibold text-foreground pb-2 block">System Archival</label>
                                        <div className="flex gap-4">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border text-sm font-medium rounded-lg hover:bg-muted shadow-sm">Backup Database Now</button>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-rose-200 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-50 shadow-sm">Restore from Backup</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 9. Integration Settings */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h2 className="text-xl font-bold text-foreground">Applicant Tracking Systems (ATS)</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Connect your existing ATS to automatically sync candidate data.</p>
                                </div>
                                <div className="divide-y divide-border">
                                    {integrations.map(integration => (
                                        <div key={integration.name} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${integration.color} ${integration.text}`}>
                                                    {integration.logo}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground text-base">{integration.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            integration.status === 'Connected' ? "bg-emerald-500" : "bg-muted-foreground"
                                                        )}></span>
                                                        <span className="text-sm font-medium text-muted-foreground">{integration.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className={cn(
                                                "px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto",
                                                integration.status === 'Connected'
                                                    ? "bg-background border border-border hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                                    : "bg-primary/10 text-primary hover:bg-primary/20"
                                            )}>
                                                {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
                                <h2 className="text-xl font-bold text-foreground pb-2 border-b border-border">Other Integrations</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-border rounded-lg bg-background hover:bg-muted/50 cursor-pointer transition-colors flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-semibold text-sm">LinkedIn Recruiter</h4>
                                            <p className="text-xs text-muted-foreground">Import profiles instantly</p>
                                        </div>
                                        <span className="text-primary text-sm font-medium">Connect</span>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg bg-background hover:bg-muted/50 cursor-pointer transition-colors flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-semibold text-sm">Google Workspace</h4>
                                            <p className="text-xs text-muted-foreground">Calendar interview syncing</p>
                                        </div>
                                        <span className="text-emerald-600 text-sm font-medium">Connected</span>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg bg-background hover:bg-muted/50 cursor-pointer transition-colors flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-semibold text-sm">Zoom Setup</h4>
                                            <p className="text-xs text-muted-foreground">Generate meeting links</p>
                                        </div>
                                        <span className="text-primary text-sm font-medium">Connect</span>
                                    </div>
                                    <div className="p-4 border border-border rounded-lg bg-background hover:bg-muted/50 cursor-pointer transition-colors flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-semibold text-sm">Job Portal Webhooks</h4>
                                            <p className="text-xs text-muted-foreground">Indeed/Glassdoor API</p>
                                        </div>
                                        <span className="text-primary text-sm font-medium">Configure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 10. Analytics Settings */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
                                <h2 className="text-xl font-bold text-foreground mb-4">Analytics & Reporting</h2>

                                <div className="space-y-4">
                                    <label className="flex items-center justify-between group cursor-pointer border-b border-border pb-4">
                                        <div>
                                            <h4 className="font-medium text-foreground">Hiring Funnel Tracking</h4>
                                            <p className="text-sm text-muted-foreground">Monitor drop-off rates at each interview stage.</p>
                                        </div>
                                        <input type="checkbox" checked={settings.analytics.funnelTracking} onChange={e => handleChange('analytics', 'funnelTracking', e.target.checked)} className="w-5 h-5 rounded border-border text-primary" />
                                    </label>
                                    <label className="flex items-center justify-between group cursor-pointer border-b border-border pb-4">
                                        <div>
                                            <h4 className="font-medium text-foreground">Diversity Metrics Collection</h4>
                                            <p className="text-sm text-muted-foreground">Enable anonymous EEO data reporting widgets.</p>
                                        </div>
                                        <input type="checkbox" checked={settings.analytics.diversityMetrics} onChange={e => handleChange('analytics', 'diversityMetrics', e.target.checked)} className="w-5 h-5 rounded border-border text-primary" />
                                    </label>
                                    <label className="flex items-center justify-between group cursor-pointer border-b border-border pb-4">
                                        <div>
                                            <h4 className="font-medium text-foreground">AI Output Accuracy Monitoring</h4>
                                            <p className="text-sm text-muted-foreground">Track false positives/negatives in AI scoring vs human decisions.</p>
                                        </div>
                                        <input type="checkbox" checked={settings.analytics.aiMonitoring} onChange={e => handleChange('analytics', 'aiMonitoring', e.target.checked)} className="w-5 h-5 rounded border-border text-primary" />
                                    </label>
                                    <div className="pt-2">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 shadow-sm"><BarChart3 className="w-4 h-4" /> Open Custom Report Builder</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
