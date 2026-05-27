import { useState, useEffect } from 'react';
import { Building2, UploadCloud, MapPin, Globe, Briefcase, Users, Plus, Save, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function CompanyProfile() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        industry: 'Technology & Software',
        description: '',
        website: '',
        linkedin: '',
        location: '',
        remoteAllowed: false,
        benefits: ['Health Insurance', '401(k) Match', 'Flexible Hours']
    });

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return setIsLoading(false);

                const res = await axios.get('/api/companies/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success && res.data.data) {
                    const comp = res.data.data;
                    setFormData({
                        name: comp.name || '',
                        industry: comp.industry || 'Technology & Software',
                        description: comp.description || '',
                        website: comp.links?.website || '', // Schema is basic, map to what fits
                        linkedin: comp.links?.linkedin || '',
                        location: comp.location || '',
                        remoteAllowed: comp.preferences?.remoteAllowed || false,
                        benefits: comp.preferences?.benefits?.length ? comp.preferences.benefits : ['Health Insurance', '401(k) Match', 'Flexible Hours']
                    });
                }
            } catch (error) {
                console.error('Failed to fetch company profile', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompany();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login first");
                return;
            }

            const payload = {
                name: formData.name,
                industry: formData.industry,
                description: formData.description,
                location: formData.location,
                links: {
                    website: formData.website,
                    linkedin: formData.linkedin
                },
                preferences: {
                    remoteAllowed: formData.remoteAllowed,
                    benefits: formData.benefits
                }
            };

            const res = await axios.post('/api/companies', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.data.success) throw new Error(res.data.message);
        } catch (error) {
            console.error(error);
            alert("Failed to save profile. Make sure required fields are filled.");
        } finally {
            setTimeout(() => setIsSaving(false), 1000); // Visual delay for UX
        }
    };

    if (isLoading) {
        return <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Company Profile</h1>
                    <p className="text-muted-foreground mt-1">Manage your organization details and default hiring preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70"
                >
                    {isSaving ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {isSaving ? "Saved!" : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">Basic Information</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Logo Upload */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center shrink-0 hover:bg-muted/70 transition-colors cursor-pointer group">
                                    <div className="text-center">
                                        <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary mx-auto mb-1 transition-colors" />
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Logo</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h4 className="text-sm font-semibold text-foreground">Company Logo</h4>
                                    <p className="text-xs text-muted-foreground max-w-[280px]">Upload your company logo. 400x400px minimum. PNG or JPG.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Company Name</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="TechCorp Global" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Industry</label>
                                    <select value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 appearance-none">
                                        <option>Technology & Software</option>
                                        <option>Financial Services</option>
                                        <option>Healthcare</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-semibold text-foreground">Short Description</label>
                                    <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="We are a leading provider of innovative software solutions..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links & Location */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">Links & Location</h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        <input value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://techcorp.example.com" className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-foreground">LinkedIn Page</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} placeholder="linkedin.com/company/techcorp" className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-semibold text-foreground">Headquarters Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                        <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="San Francisco, CA (Remote Friendly)" className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Hiring Preferences */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-primary/10">
                            <h3 className="font-bold text-primary flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Hiring Preferences
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">Default settings for new job descriptions.</p>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Work Modes</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-primary/30 text-primary focus:ring-primary" />
                                        <span className="font-medium text-foreground">On-site</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-primary/30 text-primary focus:ring-primary" />
                                        <span className="font-medium text-foreground">Hybrid</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={formData.remoteAllowed} onChange={e => setFormData({ ...formData, remoteAllowed: e.target.checked })} className="rounded border-primary/30 text-primary focus:ring-primary" />
                                        <span className="font-medium text-foreground">100% Remote</span>
                                    </label>
                                </div>
                            </div>

                            <hr className="border-primary/10" />

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Benefits / Perks</h4>
                                <div className="flex flex-wrap gap-2">
                                    {formData.benefits.map((perk, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-background border border-border rounded-md text-xs font-medium">{perk}</span>
                                    ))}
                                    <button className="px-2.5 py-1 border border-dashed border-primary/40 text-primary rounded-md text-xs font-bold hover:bg-primary/10 transition-colors flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> Add Perk
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
