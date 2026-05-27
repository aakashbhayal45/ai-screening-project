import { useState, useEffect } from 'react';
import { User, Mail, Bell, Shield, Key, Smartphone, Globe, Save, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function AccountSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        jobTitle: '',
        portfolioUrl: '',
        address: '',
        isVisibleToRecruiters: true
    });

    const [userInitial, setUserInitial] = useState('U');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data?.data) {
                    const user = res.data.data;
                    const nameParts = (user.name || '').split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.slice(1).join(' ') || '';

                    setUserInitial(firstName.substring(0, 2).toUpperCase() || 'U');

                    setFormData({
                        firstName,
                        lastName,
                        jobTitle: user.jobTitle || '',
                        portfolioUrl: user.portfolioUrl || '',
                        address: user.address || '',
                        isVisibleToRecruiters: user.isVisibleToRecruiters !== false
                    });
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                jobTitle: formData.jobTitle,
                portfolioUrl: formData.portfolioUrl,
                address: formData.address,
                isVisibleToRecruiters: formData.isVisibleToRecruiters
            };

            await axios.put('/api/users/profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Artificial delay to show success state
            setTimeout(() => setIsSaving(false), 1000);
        } catch (error) {
            console.error('Failed to update profile', error);
            setIsSaving(false);
            alert('Failed to update profile');
        }
    };

    const tabs = [
        { id: 'profile', name: 'Public Profile', icon: User },
        { id: 'account', name: 'Account Details', icon: Mail },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Shield },
    ];

    if (isLoading) {
        return <div className="max-w-5xl mx-auto py-24 text-center animate-pulse text-muted-foreground">Loading Settings...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
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

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
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

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Avatar Section */}
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center border-4 border-background shadow-md shrink-0">
                                    <span className="font-bold text-3xl">{userInitial}</span>
                                </div>
                                <div className="space-y-3 text-center sm:text-left">
                                    <h3 className="font-semibold text-foreground text-lg">Profile Picture</h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">Upload a professional photo. JPEGs and PNGs up to 5MB are supported.</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-3">
                                        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm">Upload Image</button>
                                        <button className="px-4 py-2 bg-background border border-border text-sm font-medium rounded-lg hover:bg-muted text-foreground transition-colors shadow-sm">Remove</button>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border">
                                    <h3 className="font-semibold text-foreground">Basic Information</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">First Name</label>
                                            <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Last Name</label>
                                            <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Professional Tagline</label>
                                        <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Senior React Developer" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-semibold text-foreground"><Globe className="w-4 h-4 text-muted-foreground" /> Personal Website</label>
                                            <input name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://alexj.dev" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Location</label>
                                            <input name="address" value={formData.address} onChange={handleChange} placeholder="San Francisco, CA" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2 text-sm">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input name="isVisibleToRecruiters" type="checkbox" checked={formData.isVisibleToRecruiters} onChange={handleChange} className="sr-only peer" />
                                                <div className="w-5 h-5 border-2 border-border rounded-md peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">Make profile visible to recruiters</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border flex items-center gap-2">
                                    <Key className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold text-foreground">Password & Authentication</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2 mb-6">
                                        <label className="text-sm font-semibold text-foreground">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full max-w-md bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Smartphone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-primary">Two-Factor Authentication (2FA)</h3>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">Add an extra layer of security to your account by requiring an authentication code upon login.</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm shrink-0">Enable 2FA</button>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'account' || activeTab === 'notifications') && (
                        <div className="bg-card border border-border rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                            <Shield className="w-12 h-12 text-muted-foreground/30 mb-4" />
                            <h2 className="text-xl font-bold text-foreground mb-2">{tabs.find(t => t.id === activeTab)?.name}</h2>
                            <p className="text-muted-foreground max-w-sm">Manage your {tabs.find(t => t.id === activeTab)?.name.toLowerCase()} securely from this panel.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
