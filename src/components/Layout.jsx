import { Outlet, NavLink, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileEdit, Settings, User, FileText, Target, Building2, Calendar, Search, Bell, EyeOff, ArrowLeft, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function Layout() {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const [blindHiring, setBlindHiring] = useState(false);
    const [role, setRole] = useState('recruiter'); // 'recruiter' | 'candidate'
    const [userProfile, setUserProfile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setUserProfile(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching profile in Layout:", error);
            }
        };
        fetchProfile();
    }, []);

    // Auto-switch role if navigating directly to a candidate URL
    useEffect(() => {
        // Prevent matching /candidates (recruiter view) by strictly checking trailing slash or exact path
        if (location.pathname.startsWith('/candidate/') || location.pathname === '/candidate') {
            setRole('candidate');
        } else {
            setRole('recruiter');
        }
    }, [location.pathname]);

    const handleRoleSwitch = (newRole) => {
        setRole(newRole);
        if (newRole === 'recruiter') {
            navigate('/');
        } else {
            navigate('/candidate/dashboard');
        }
    };

    const recruiterNavItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Interviews', path: '/interviews', icon: Calendar },
        { name: 'Candidates', path: '/candidates', icon: Users },
        { name: 'JD Manager', path: '/jds', icon: FileEdit },
        { name: 'Company', path: '/company-profile', icon: Building2 },
        { name: 'AI Chatbot', path: '/chat', icon: Bot },
        { name: 'Settings', path: '/settings/admin', icon: Settings },
    ];

    const candidateNavItems = [
        { name: 'My Dashboard', icon: LayoutDashboard, path: '/candidate/dashboard' },
        { name: 'Resume Builder', icon: Target, path: '/candidate/builder' },
        { name: 'App Tracker', icon: FileText, path: '/candidate/tracker' },
        { name: 'Account Settings', icon: User, path: '/candidate/settings' },
        { name: 'Back to Admin', icon: ArrowLeft, path: '/' },
    ];

    const navItems = role === 'recruiter' ? recruiterNavItems : candidateNavItems;

    const filteredSuggestions = query => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return navItems.filter(item => item.name.toLowerCase().includes(lowerQuery));
    };

    const suggestions = filteredSuggestions(searchQuery);

    const handleSearchSelect = (path) => {
        navigate(path);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    return (
        <div className="flex h-screen w-full bg-background text-foreground font-sans">
            {/* Sidebar - Premium Light Theme */}
            <aside className="w-72 bg-white/60 backdrop-blur-2xl text-slate-600 border-r border-slate-200/60 flex flex-col shrink-0 z-30 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                {/* Profile Section */}
                <Link to="/profile" className="p-6 border-b border-slate-200/60 flex items-center gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                        {userProfile?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-800 tracking-wide">{userProfile?.name || 'Loading...'}</h2>
                        <p className="text-xs text-indigo-600 font-medium">{userProfile?.jobTitle || userProfile?.role || (role === 'recruiter' ? 'Administrator' : 'Candidate')}</p>
                    </div>
                </Link>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 px-3">Main Menu</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-indigo-50 to-purple-50/50 text-indigo-700 shadow-sm border border-indigo-100"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1"
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={cn(
                                        "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0 bg-indigo-600 rounded-r-full transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.4)]",
                                        isActive ? "h-8 opacity-100" : "opacity-0"
                                    )} />
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-transform duration-300 z-10",
                                        isActive ? "text-indigo-600 scale-110" : "group-hover:text-indigo-500 group-hover:scale-110"
                                    )} />
                                    <span className="z-10">{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-background/50 relative">
                {/* Background Decorators */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Top Header */}
                <header className="absolute top-0 left-0 w-full h-16 border-b border-border bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-6 z-20 shadow-sm">
                    <div className="flex items-center gap-6">
                        {/* AI Resume Icon */}
                        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight hidden md:flex">
                            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20">
                                A
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">AI Resume</span>
                        </div>

                        <div className="relative">
                            <div className="flex items-center gap-4 bg-muted/40 rounded-full px-4 py-2 w-72 border border-border/40 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder={role === 'recruiter' ? "Search candidates or features..." : "Search jobs or features..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && searchQuery.trim() !== '') {
                                            const query = searchQuery.trim().toLowerCase();
                                            if (role === 'recruiter') {
                                                if (['dashboard', 'home'].includes(query)) navigate('/');
                                                else if (['interview', 'interviews', 'calendar', 'schedule'].includes(query)) navigate('/interviews');
                                                else if (['candidate', 'candidates'].includes(query)) navigate('/candidates');
                                                else if (['jd', 'jds', 'job', 'jobs', 'manager', 'add job'].includes(query)) navigate('/jds');
                                                else if (['company', 'profile', 'building'].includes(query)) navigate('/company-profile');
                                                else if (['setting', 'settings', 'admin'].includes(query)) navigate('/settings/admin');
                                                else navigate(`/candidates?search=${encodeURIComponent(searchQuery.trim())}`);
                                            } else {
                                                if (['dashboard', 'home'].includes(query)) navigate('/candidate/dashboard');
                                                else if (['resume', 'builder', 'cv'].includes(query)) navigate('/candidate/builder');
                                                else if (['tracker', 'applications', 'status'].includes(query)) navigate('/candidate/tracker');
                                                else if (['setting', 'settings', 'account'].includes(query)) navigate('/candidate/settings');
                                                else navigate(`/candidate/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
                                            }
                                            setSearchQuery('');
                                            setIsSearchFocused(false);
                                        }
                                    }}
                                />
                            </div>

                            {/* Autocomplete Dropdown */}
                            {isSearchFocused && searchQuery && (
                                <div className="absolute top-12 left-0 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-2">Features</div>
                                    {suggestions.length > 0 ? (
                                        suggestions.map(item => (
                                            <button
                                                key={item.name}
                                                onClick={() => handleSearchSelect(item.path)}
                                                className="w-full text-left px-4 py-2 hover:bg-muted/80 flex items-center gap-3 transition-colors"
                                            >
                                                <item.icon className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                            Search for "{searchQuery}" in {role === 'recruiter' ? 'Candidates' : 'Jobs'} &rarr;
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Blind Hiring Toggle - Only for recruiters */}
                        {role === 'recruiter' && (
                            <div className="flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 transition-colors hover:bg-primary/10">
                                <EyeOff className={cn("w-4 h-4 transition-colors", blindHiring ? "text-primary" : "text-muted-foreground")} />
                                <span className="text-xs font-semibold select-none flex items-center gap-2">
                                    Blind Hiring
                                    <button
                                        onClick={() => setBlindHiring(!blindHiring)}
                                        className={cn("w-8 h-4 rounded-full transition-all relative flex items-center", blindHiring ? "bg-primary" : "bg-muted-foreground/30")}>
                                        <span className={cn("absolute rounded-full w-3 h-3 bg-white shadow-sm transition-transform duration-300", blindHiring ? "translate-x-4" : "translate-x-0.5")} />
                                    </button>
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <button className="relative text-muted-foreground hover:text-foreground transition-all duration-200 p-2 hover:bg-muted rounded-full">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
                            </button>
                            <Link to={role === 'recruiter' ? '/settings/admin' : '/candidate/settings'} className="text-muted-foreground hover:text-primary transition-all duration-200 p-2 hover:bg-muted rounded-full ml-1" title="View Profile">
                                <User className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-24 md:pt-28 scroll-smooth will-change-transform">
                    <Outlet context={{ blindHiring, role }} />
                </div>
            </main>
        </div>
    );
}
