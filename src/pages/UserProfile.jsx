import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Briefcase, Building2,
    Award, ShieldCheck, Lock, Globe, Bell, Fingerprint,
    Smartphone, FileText, CheckCircle2, ChevronRight,
    Camera, Upload, Eye, EyeOff, Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function UserProfile() {
    const { role } = useOutletContext();
    const [activeTab, setActiveTab] = useState('basic');
    const [showPassword, setShowPassword] = useState(false);

    // Server State
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setProfile(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? true : false) : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/api/users/profile', profile, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data.success) {
                setProfile(res.data.data);
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to update profile.";
            alert("Error: " + errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('field', field);

        try {
            const token = localStorage.getItem('token');
const res = await axios.post('/api/users/profile/upload', formData, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
            if (res.data.success) {
                setProfile(res.data.data);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        } finally {
            setIsUploading(false);
        }
    };

    // Derived User Data for display defaults
    const displayAvatar = profile.profilePhoto
        ? (profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `${profile.profilePhoto}`)
        : null;
    const displayBanner = profile.bannerUrl
        ? (profile.bannerUrl.startsWith('http') ? profile.bannerUrl : `${profile.bannerUrl}`)
        : null;
    const displayInitials = (profile.name || role === 'recruiter' ? 'JD' : 'AS').substring(0, 2).toUpperCase();

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: User },
        { id: 'contact', label: 'Contact Details', icon: Mail },
        { id: 'account', label: 'Account Info', icon: ShieldCheck },
        { id: 'professional', label: 'Professional Info', icon: Briefcase },
        { id: 'security', label: 'Security Settings', icon: Lock },
        { id: 'preferences', label: 'Preferences', icon: Globe },
        { id: 'documents', label: 'Documents', icon: FileText }
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-muted-foreground gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="font-medium animate-pulse">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="relative bg-card border border-border rounded-2xl p-6 shadow-sm overflow-hidden min-h-[160px] md:min-h-[200px]">
                {/* Banner Background */}
                <div
                    className="absolute top-0 left-0 w-full h-32 md:h-40 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/10 transition-all duration-500 bg-cover bg-center"
                    style={displayBanner ? { backgroundImage: `url('${displayBanner}')` } : {}}
                ></div>

                {/* Banner Upload Button */}
                <div className="absolute top-4 right-4 z-20">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={bannerInputRef}
                        onChange={(e) => handleFileUpload(e, 'bannerUrl')}
                    />
                    <button
                        onClick={() => bannerInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                    >
                        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                        {displayBanner ? 'Change Banner' : 'Add Banner'}
                    </button>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 pt-12 md:pt-16">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-lg shadow-primary/20 ring-4 ring-background overflow-hidden relative">
                            {displayAvatar ? (
                                <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                displayInitials
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shadow-sm group-hover:scale-110 disabled:opacity-50">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Top Right Verification Badge */}
                    {profile.idProofVerified && (
                        <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm z-20">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified Profile
                        </div>
                    )}

                    {/* Info Title */}
                    <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{profile.name || "Set Name"}</h1>
                        </div>
                        <p className="text-lg text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-2">
                            <Briefcase className="w-4 h-4" /> {profile.jobTitle || "Add Job Title"}
                            <span className="text-border">•</span>
                            <MapPin className="w-4 h-4" /> {profile.address ? profile.address.split(',')[0] : "Set Base Location"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Split */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="lg:w-64 shrink-0">
                    <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar sticky top-24">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
                                    activeTab === tab.id
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <tab.icon className="w-5 h-5 shrink-0" />
                                {tab.label}
                                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto hidden lg:block opacity-50" />}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm min-h-[500px]">
                    <div className="p-6 md:p-8">

                        {/* 1. Basic Information */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Basic Information</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Manage your personal identity details.</p>
                                </div>
                                <hr className="border-border" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                                        <input type="text" name="name" value={profile.name || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Gender</label>
                                        <select name="gender" value={profile.gender || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium appearance-none">
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Date of Birth</label>
                                        <input type="date" name="dateOfBirth" value={profile.dateOfBirth ? profile.dateOfBirth.substring(0, 10) : ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium text-foreground" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Nationality</label>
                                        <input type="text" name="nationality" value={profile.nationality || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null} Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 2. Contact Details */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Contact Details</h2>
                                    <p className="text-sm text-muted-foreground mt-1">How we can reach you.</p>
                                </div>
                                <hr className="border-border" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Email Address (Read-only)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <input type="email" value={profile.identifier || ''} readOnly className="w-full bg-muted/30 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <input type="tel" name="phone" value={profile.phone || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Alternate Phone (Optional)</label>
                                        <input type="tel" name="alternatePhone" value={profile.alternatePhone || ''} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">ZIP / Postal Code</label>
                                        <input type="text" name="zipCode" value={profile.zipCode || ''} onChange={handleInputChange} placeholder="94105" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Address (City, State, Country)</label>
                                        <input type="text" name="address" value={profile.address || ''} onChange={handleInputChange} placeholder="San Francisco, CA, USA" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium" />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null} Save Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 3. Account Information */}
                        {activeTab === 'account' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Account Information</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Your system identity and status.</p>
                                </div>
                                <hr className="border-border" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Username</label>
                                        <span className="text-foreground font-semibold">{profile.identifier}</span>
                                    </div>
                                    <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">User ID (Auto-generated)</label>
                                        <span className="text-foreground font-mono text-sm">{profile._id}</span>
                                    </div>
                                    <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Role</label>
                                        <span className="inline-flex px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-500/20">{profile.role?.toUpperCase()}</span>
                                    </div>
                                    <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Account Status</label>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                                            <div className={cn("w-2 h-2 rounded-full", profile.accountStatus === 'Inactive' ? "bg-red-500" : "bg-emerald-500")}></div>
                                            {profile.accountStatus || 'Active'}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Date of Registration</label>
                                        <span className="text-foreground font-medium text-sm">{new Date(profile.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="p-4 bg-muted/40 rounded-xl border border-border/50">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Last Login</label>
                                        <span className="text-foreground font-medium text-sm">{new Date(profile.lastLogin).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Professional Information */}
                        {activeTab === 'professional' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Professional Information</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Your career timeline and expertise.</p>
                                </div>
                                <hr className="border-border" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Current Job Title</label>
                                        <input type="text" name="jobTitle" value={profile.jobTitle || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Company Name</label>
                                        <input type="text" name="companyName" value={profile.companyName || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Years of Experience</label>
                                        <input type="number" name="experienceYears" value={profile.experienceYears || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Industry</label>
                                        <input type="text" name="industry" value={profile.industry || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Skills (Comma separated)</label>
                                        <input type="text" name="skills" value={Array.isArray(profile.skills) ? profile.skills.join(', ') : (profile.skills || '')} onChange={(e) => setProfile(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Certifications</label>
                                        <input type="text" name="certifications" value={profile.certifications || ''} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-muted-foreground">LinkedIn Profile</label>
                                        <input type="url" name="linkedinUrl" value={profile.linkedinUrl || ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/profile" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-blue-500 focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-muted-foreground">Portfolio / Website</label>
                                        <input type="url" name="portfolioUrl" value={profile.portfolioUrl || ''} onChange={handleInputChange} placeholder="https://yourwebsite.com" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-blue-500 focus:outline-none focus:border-primary/50 transition-all font-medium" />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null} Update Professional Profile
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 5. Security Settings */}
                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Security Settings</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Keep your account safe.</p>
                                </div>
                                <hr className="border-border" />

                                <div className="space-y-6">
                                    <div className="p-5 border border-border rounded-xl bg-card space-y-4">
                                        <h3 className="font-semibold text-foreground flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Change Password</h3>
                                        <div className="space-y-3 max-w-sm">
                                            <div className="relative">
                                                <input type={showPassword ? "text" : "password"} placeholder="Current Password" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50" />
                                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <input type="password" placeholder="New Password" className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50" />
                                            <button className="px-4 py-2 bg-foreground text-background font-medium rounded-lg text-sm hover:bg-foreground/90 transition-colors">Update Password</button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-5 border border-border rounded-xl bg-card">
                                        <div>
                                            <h3 className="font-semibold text-foreground flex items-center gap-2"><Fingerprint className="w-4 h-4 text-primary" /> Two-Factor Authentication (2FA)</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium rounded-lg text-sm">Enable 2FA</button>
                                    </div>

                                    <div className="flex items-center justify-between p-5 border border-border rounded-xl bg-card">
                                        <div>
                                            <h3 className="font-semibold text-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Security Questions</h3>
                                            <p className="text-sm text-muted-foreground mt-1">For account recovery.</p>
                                        </div>
                                        <button className="px-4 py-2 border border-border hover:bg-muted transition-colors font-medium rounded-lg text-sm">Configure</button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/20 border border-border rounded-xl">
                                            <h4 className="text-sm font-semibold mb-2">Login History</h4>
                                            <div className="text-sm text-muted-foreground space-y-2">
                                                <div className="flex justify-between"><span>SF, USA</span><span className="text-foreground">Today</span></div>
                                                <div className="flex justify-between"><span>NY, USA</span><span className="text-foreground">Oct 12</span></div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-muted/20 border border-border rounded-xl">
                                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Device Activity</h4>
                                            <div className="text-sm text-muted-foreground space-y-2">
                                                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium"><span>MacBook Pro (Active)</span></div>
                                                <div className="flex justify-between"><span>iPhone 13</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 6. Preferences */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Preferences</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Customize your system experience.</p>
                                </div>
                                <hr className="border-border" />

                                <div className="space-y-6 max-w-xl">
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Language Preference</label>
                                        <select name="language" value={profile.language || 'English (US)'} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 appearance-none cursor-pointer">
                                            <option value="English (US)">English (US)</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                            <option value="German">German</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-foreground">Theme Settings</label>
                                        <p className="text-xs text-muted-foreground mb-2">Select a theme to preview instantly. Don't forget to save your preferences.</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { id: 'System Default', label: 'System Default', class: 'bg-muted/50 text-foreground' },
                                                { id: 'Light Mode', label: 'Light Mode', class: 'bg-white text-black border-border' },
                                                { id: 'Dark Mode', label: 'Dark Mode', class: 'bg-slate-900 text-white border-slate-700' },
                                                { id: 'Midnight Blue', label: 'Midnight Blue', class: 'bg-[#0f172a] text-blue-400 border-blue-900/50' },
                                                { id: 'Forest Green', label: 'Forest Green', class: 'bg-[#f1f8f3] text-emerald-700 border-emerald-200' },
                                                { id: 'Sunset Orange', label: 'Sunset Orange', class: 'bg-[#fffdfa] text-orange-600 border-orange-200' },
                                                { id: 'Rose Gold', label: 'Rose Gold', class: 'bg-[#fff8fc] text-rose-600 border-rose-200' },
                                                { id: 'Cyberpunk', label: 'Cyberpunk', class: 'bg-black text-fuchsia-400 border-fuchsia-900/50' }
                                            ].map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => {
                                                        setProfile(p => ({ ...p, theme: t.id }));
                                                        window.dispatchEvent(new CustomEvent('theme-updated', { detail: t.id }));
                                                    }}
                                                    className={cn(
                                                        "py-2.5 px-3 border rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1.5",
                                                        profile.theme === t.id || (!profile.theme && t.id === 'System Default')
                                                            ? "border-primary ring-1 ring-primary overflow-hidden shadow-sm scale-[1.02]"
                                                            : "border-border hover:border-primary/50 opacity-80 hover:opacity-100",
                                                        t.class
                                                    )}
                                                >
                                                    <span className="w-4 h-4 rounded-full shadow-sm block bg-current opacity-20 mb-0.5"></span>
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <label className="text-sm font-semibold text-foreground flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Notification Settings</label>

                                        <label className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                                            <div>
                                                <span className="font-medium text-sm text-foreground">Email Notifications</span>
                                                <p className="text-xs text-muted-foreground">Receive daily digests and updates.</p>
                                            </div>
                                            <input type="checkbox" name="emailNotifications" checked={profile.emailNotifications === undefined ? true : profile.emailNotifications} onChange={handleInputChange} className="w-4 h-4 accent-primary" />
                                        </label>
                                        <label className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                                            <div>
                                                <span className="font-medium text-sm text-foreground">SMS Notifications</span>
                                                <p className="text-xs text-muted-foreground">For critical alerts only.</p>
                                            </div>
                                            <input type="checkbox" name="smsNotifications" checked={profile.smsNotifications || false} onChange={handleInputChange} className="w-4 h-4 accent-primary" />
                                        </label>
                                        <label className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                                            <div>
                                                <span className="font-medium text-sm text-foreground">Push Notifications</span>
                                                <p className="text-xs text-muted-foreground">In-app browser alerts.</p>
                                            </div>
                                            <input type="checkbox" name="pushNotifications" checked={profile.pushNotifications === undefined ? true : profile.pushNotifications} onChange={handleInputChange} className="w-4 h-4 accent-primary" />
                                        </label>
                                    </div>
                                    <div className="pt-2">
                                        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50">
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null} Save Preferences
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 7. Documents Section */}
                        {activeTab === 'documents' && (
                            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Documents Section</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Manage your uploaded files and verifications.</p>
                                </div>
                                <hr className="border-border" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Resume */}
                                    <div className="border border-border rounded-xl p-5 bg-card hover:border-primary/30 transition-colors group">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-foreground">Primary Resume</h3>
                                        <p className="text-sm text-muted-foreground mb-4 truncate">{profile.resumeUrl ? profile.resumeUrl.split('/').pop() : 'No resume uploaded'}</p>
                                        <div className="flex gap-2">
                                            {profile.resumeUrl && <a href={`${profile.resumeUrl}`} target="_blank" rel="noreferrer" className="flex-1 py-1.5 bg-muted text-foreground text-xs font-semibold rounded-md hover:bg-muted/80 text-center flex items-center justify-center">View</a>}
                                            <div className="flex-1 relative">
                                                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resumeUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Upload Resume" />
                                                <button className="w-full h-full py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-md hover:bg-primary/20 flex items-center justify-center gap-1"><Upload className="w-3 h-3" /> {profile.resumeUrl ? 'Update' : 'Upload'}</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ID Proof */}
                                    <div className="border border-border rounded-xl p-5 bg-card hover:border-primary/30 transition-colors group">
                                        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                                            <Fingerprint className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-semibold text-foreground flex items-center gap-2">ID Proof {profile.idProofVerified && <span className="bg-emerald-500/10 text-emerald-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Verified</span>}</h3>
                                        <p className="text-sm text-muted-foreground mb-4 truncate">{profile.idProofUrl ? profile.idProofUrl.split('/').pop() : 'No ID proof uploaded'}</p>
                                        <div className="flex gap-2">
                                            {profile.idProofUrl && <a href={`${profile.idProofUrl}`} target="_blank" rel="noreferrer" className="flex-1 py-1.5 bg-muted text-foreground text-xs font-semibold rounded-md hover:bg-muted/80 text-center flex items-center justify-center">View</a>}
                                            <div className="flex-1 relative">
                                                <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'idProofUrl')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Upload ID Proof" />
                                                <button className="w-full h-full py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-md hover:bg-primary/20 flex items-center justify-center gap-1"><Upload className="w-3 h-3" /> {profile.idProofUrl ? 'Replace' : 'Upload'}</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certificates */}
                                    <div className="border border-border border-dashed rounded-xl p-6 bg-muted/10 flex flex-col items-center justify-center text-center hover:bg-muted/20 hover:border-primary/50 transition-colors cursor-pointer md:col-span-2 min-h-[160px]">
                                        <Award className="w-8 h-8 text-muted-foreground mb-3" />
                                        <h3 className="font-semibold text-foreground">Add Certificates</h3>
                                        <p className="text-xs text-muted-foreground mt-1 mb-3">Upload achievement badges or PDF certificates.</p>
                                        <button className="px-4 py-1.5 bg-background border border-border rounded-lg text-sm font-medium shadow-sm hover:text-primary hover:border-primary/50 transition-colors">Browse Files</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
