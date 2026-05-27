import {
    Users, FileText, CheckCircle, AlertTriangle, Briefcase, Plus, Upload, Calendar as CalendarIcon,
    BarChart2, Zap, Target, Star, AlertCircle, Search, Download, TrendingUp, Filter
} from 'lucide-react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function TopCard({ title, value, icon: Icon, colorClass, trend }) {
    return (
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-sm hover-glow group transition-all duration-300 relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 ${colorClass.split(' ')[0]}`}>
                <Icon className="w-16 h-16" />
            </div>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold mt-2 text-foreground">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-xs font-medium text-emerald-500 relative z-10">
                    <TrendingUp className="w-3 h-3 mr-1" /> {trend} this week
                </div>
            )}
        </div>
    );
}

function ActionButton({ label, icon: Icon, primary, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-md hover:-translate-y-1 ${primary
                ? 'bg-white text-indigo-600 hover:shadow-white/20 hover:shadow-xl'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                }`}>
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}


export default function Dashboard() {
    const { blindHiring } = useOutletContext();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [jobFilter, setJobFilter] = useState('All Roles');
    const [scoreFilter, setScoreFilter] = useState(60);
    const [expFilters, setExpFilters] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const overview = data?.overviewData || {
        totalApplications: 0,
        aiScreened: 0,
        shortlisted: 0,
        rejected: 0,
        pendingReview: 0,
        activeJobs: 0
    };
    const aiRecommendations = data?.aiRecommendationsData || [];
    const jobAnalytics = data?.jobAnalyticsData || [];
    const bestMatches = data?.bestMatchesData || [];
    const candidates = data?.candidatesData || [];
    const interviews = data?.interviewData || [];
    const notifications = data?.notificationsData || [];
    const avgScore = data?.avgAiScore || 0;
    const topSkills = data?.topSkills || [];

    // --- Derived Data for Filtering ---
    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesJob = jobFilter === 'All Roles' || c.role === jobFilter;
        const matchesScore = c.score >= scoreFilter;
        // Mock experience filtering (since actual exp data isn't fully robust yet, we just check string loosely)
        const matchesExp = expFilters.length === 0 || expFilters.some(ef => {
            if (ef === '0-2 yrs') return c.exp.includes('0') || c.exp.includes('1') || c.exp.includes('2');
            if (ef === '2-5 yrs') return c.exp.includes('2') || c.exp.includes('3') || c.exp.includes('4') || c.exp.includes('5');
            if (ef === '5+ yrs') return parseInt(c.exp) >= 5;
            return false;
        });
        return matchesSearch && matchesJob && matchesScore && matchesExp;
    });

    if (loading) {
        return <div className="max-w-[1600px] mx-auto h-96 flex items-center justify-center font-medium my-10 bg-card rounded-xl border border-border">Loading dashboard metrics...</div>;
    }

    const handleGenerateReport = () => handleExportCSV();
    const handleScheduleInterview = () => navigate('/interviews');
    const handleUploadResume = () => navigate('/candidates');
    const handleAddNewJob = () => navigate('/jds');

    const handleExportCSV = () => {
        if (filteredCandidates.length === 0) {
            alert("No candidates to export.");
            return;
        }

        const headers = ["ID", "Name", "Role", "AI Score", "Experience", "Status"];
        const rows = filteredCandidates.map(c => [c.id, c.name, c.role, c.score, c.exp, c.status]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "candidates_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpdateCandidateStatus = async (applicationId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/applications/${applicationId}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(prev => ({
                ...prev,
                candidatesData: prev.candidatesData.map(c =>
                    c.id === applicationId ? { ...c, status: status.charAt(0).toUpperCase() + status.slice(1), statusColor: status === 'shortlisted' ? 'emerald' : 'rose' } : c
                )
            }));
            // Provide a small UI notification
            const notifMsg = `Candidate changed to ${status}`;
            setData(prev => ({
                ...prev,
                notificationsData: [{ text: notifMsg, time: "Just now", type: status === 'shortlisted' ? 'success' : 'alert' }, ...(prev.notificationsData || [])]
            }));
        } catch (err) {
            console.error(err);
            alert("Error updating status");
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 pb-12">

            {/* Massive Welcome Banner (New UI Overhaul) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-8 shadow-2xl shadow-indigo-500/20 text-white">
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-10 -mb-20 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold uppercase tracking-wider mb-4 shadow-inner">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            System Online
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                            HR Command Center
                        </h1>
                        <p className="text-indigo-100 text-lg md:text-xl font-medium max-w-2xl opacity-90">
                            AI-powered candidate tracking, intelligent screening, and team analytics in real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center mt-4 md:mt-0">
                        <ActionButton label="Generate Report" icon={BarChart2} onClick={handleGenerateReport} />
                        <ActionButton label="Schedule Interview" icon={CalendarIcon} onClick={handleScheduleInterview} />
                        <ActionButton label="Upload Resume" icon={Upload} onClick={handleUploadResume} />
                        <ActionButton label="Add New Job" icon={Plus} primary onClick={handleAddNewJob} />
                    </div>
                </div>
            </div>

            {/* Panel 1: HR Overview Summary (Top Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                <TopCard title="Total Applications" value={overview.totalApplications} icon={FileText} colorClass="text-blue-500 bg-blue-500/10" trend="" />
                <TopCard title="AI Screened" value={overview.aiScreened} icon={Zap} colorClass="text-indigo-500 bg-indigo-500/10" trend="" />
                <TopCard title="Shortlisted" value={overview.shortlisted} icon={CheckCircle} colorClass="text-emerald-500 bg-emerald-500/10" />
                <TopCard title="Rejected" value={overview.rejected} icon={AlertTriangle} colorClass="text-rose-500 bg-rose-500/10" />
                <TopCard title="Pending Review" value={overview.pendingReview} icon={Users} colorClass="text-amber-500 bg-amber-500/10" />
                <TopCard title="Active Jobs" value={overview.activeJobs} icon={Briefcase} colorClass="text-purple-500 bg-purple-500/10" />
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Column (2/3 width on large screens) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Panel 2 & 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Panel 2: AI Screening Insights */}
                        <div className="glass-panel rounded-2xl p-6 flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                <Zap className="w-24 h-24 text-indigo-500" />
                            </div>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                <Zap className="w-5 h-5 text-indigo-500" /> AI Screening Insights
                            </h2>
                            <div className="space-y-6 flex-1 relative z-10">
                                <div className="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                                    <span className="text-sm font-semibold text-muted-foreground">Average AI Score</span>
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{avgScore}%</span>
                                </div>

                                <div>
                                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2 block">Top Common Skills</span>
                                    <div className="flex flex-wrap gap-2">
                                        {topSkills.map((skill, idx) => (
                                            <span key={idx} className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium border border-border/50">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-2 bg-rose-500/5 p-3 rounded-lg border border-rose-500/20">
                                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 block mb-0.5">Skill Gap Alert</span>
                                            <span className="text-xs text-muted-foreground line-clamp-2">60% of 'Frontend' apps lack testing (Jest/Cypress) exp.</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2 block border-t border-border pt-4">Best Matches Discovered</span>
                                    <div className="space-y-2">
                                        {bestMatches.map((match, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground truncate pr-2">{match.name}</span>
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">{match.match}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel 4: Job-wise Analytics */}
                        <div className="glass-panel rounded-2xl p-6 flex flex-col group">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                                <Briefcase className="w-5 h-5 text-purple-500" /> Job-wise Analytics
                            </h2>
                            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                                {jobAnalytics.map((job, index) => (
                                    <div key={index} className="space-y-2 group">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{job.role}</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {job.applicants} Applicants • <span className="text-emerald-500 font-medium">{job.shortlisted} Shortlisted</span>
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold">{job.progress}%</span>
                                        </div>
                                        <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden border border-border/50">
                                            <div
                                                className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                                                style={{ width: `${job.progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Panel 3 & 7: Candidate Review Section & Smart Search */}
                    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden min-h-[500px]">
                        <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                                <Users className="w-5 h-5 text-primary" /> Candidate Review
                            </h2>
                            <div className="flex gap-2 relative">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search candidates..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
                                    />
                                </div>
                                <button className="p-2 border border-border bg-background rounded-lg hover:bg-muted transition-colors text-muted-foreground flex items-center gap-2" title="Smart Filters">
                                    <Filter className="w-4 h-4" /> <span className="text-sm font-medium hidden sm:inline">Filters</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                            {/* Panel 7 (Sidebar approach): Smart Search / Quick Filters */}
                            <div className="w-full md:w-64 border-r border-border p-4 bg-muted/10 overflow-y-auto hidden md:block">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Smart Filters</h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Job Role</label>
                                        <select
                                            value={jobFilter}
                                            onChange={(e) => setJobFilter(e.target.value)}
                                            className="w-full text-sm bg-background border border-border rounded-md p-2"
                                        >
                                            <option>All Roles</option>
                                            {/* Get unique roles from all candidates */}
                                            {[...new Set(candidates.map(c => c.role))].map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Minimum AI Score</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={scoreFilter}
                                            onChange={(e) => setScoreFilter(Number(e.target.value))}
                                            className="w-full accent-primary"
                                        />
                                        <div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>70+</span><span>100</span></div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium">Experience</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['0-2 yrs', '2-5 yrs', '5+ yrs'].map(exp => (
                                                <label key={exp} className="flex items-center gap-2 text-xs">
                                                    <input
                                                        type="checkbox"
                                                        checked={expFilters.includes(exp)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setExpFilters([...expFilters, exp]);
                                                            else setExpFilters(expFilters.filter(f => f !== exp));
                                                        }}
                                                        className="rounded border-border text-primary focus:ring-primary"
                                                    /> {exp}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border">
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setJobFilter('All Roles');
                                                setScoreFilter(0); // Resetting to 0 instead of 60 to show all
                                                setExpFilters([]);
                                            }}
                                            className="w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-xs font-bold transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Panel 3: Candidate Table */}
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground bg-muted/50 uppercase sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Candidate</th>
                                            <th className="px-4 py-3 font-medium hidden sm:table-cell">Role Applied</th>
                                            <th className="px-4 py-3 font-medium text-center">AI Score</th>
                                            <th className="px-4 py-3 font-medium hidden lg:table-cell">Exp</th>
                                            <th className="px-4 py-3 font-medium w-32">Status</th>
                                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredCandidates.length > 0 ? filteredCandidates.map((c) => (
                                            <tr key={c.id} className="hover:bg-muted/30 transition-colors group">
                                                <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                                                <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.role}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${c.score >= 90 ? 'bg-emerald-500/20 text-emerald-600' : c.score >= 60 ? 'bg-amber-500/20 text-amber-600' : 'bg-rose-500/20 text-rose-600'}`}>
                                                        {c.score}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{c.exp}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`flex justify-center items-center px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold bg-${c.statusColor}-500/10 text-${c.statusColor}-600 border border-${c.statusColor}-500/20`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => navigate('/candidates')} className="p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded" title="View CV">
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                        {c.status === 'Pending' && (
                                                            <>
                                                                <button onClick={() => handleUpdateCandidateStatus(c.id, 'shortlisted')} className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded" title="Shortlist">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleUpdateCandidateStatus(c.id, 'rejected')} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded" title="Reject">
                                                                    <AlertTriangle className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                                                    No candidates match the selected filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (1/3 width on large screens) */}
                <div className="space-y-6">

                    {/* Panel 6: AI Recommendation System */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
                            <Star className="w-5 h-5 text-amber-500" /> AI Recommendations
                        </h2>
                        <div className="space-y-4">
                            {aiRecommendations.map((rec, i) => (
                                <div key={i} className={`p-4 rounded-xl border relative overflow-hidden bg-${rec.color}-500/5 border-${rec.color}-500/20`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-foreground">{rec.name}</h3>
                                            <p className="text-xs text-muted-foreground">{rec.role}</p>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-${rec.color}-500/20 text-${rec.color}-700 dark:text-${rec.color}-400`}>
                                            {rec.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-${rec.color}-500/20 text-${rec.color}-600 dark:text-${rec.color}-400 font-bold text-xs shrink-0`}>
                                            {rec.score}
                                        </div>
                                        <p className="text-xs text-muted-foreground italic leading-tight">
                                            "{rec.reason}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Panel 5: Interview Tracking Panel */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
                            <CalendarIcon className="w-5 h-5 text-blue-500" /> Interview Tracking
                        </h2>
                        <div className="space-y-4">
                            {interviews.map((int, i) => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/50">
                                    <div className="flex gap-3 items-center">
                                        <div className={`w-2 h-2 rounded-full bg-${int.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_${int.color}]`}></div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{int.name}</p>
                                            <p className="text-xs text-muted-foreground">{int.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium">{int.time}</p>
                                        <p className={`text-[10px] uppercase tracking-wider font-bold text-${int.color}-500 mt-0.5`}>{int.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 bg-muted text-foreground hover:bg-muted/80 text-xs font-bold rounded-lg transition-colors border border-border">
                            View All Interviews
                        </button>
                    </div>

                    {/* Panel 8 & 9: Notifications & Reports Export */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col min-h-[300px]">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
                            <AlertCircle className="w-5 h-5 text-rose-500" /> Live Updates
                        </h2>

                        {/* Feed */}
                        <div className="space-y-4 flex-1">
                            {notifications.map((notif, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="mt-0.5">
                                        {notif.type === 'alert' && <Zap className="w-4 h-4 text-amber-500" />}
                                        {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                        {notif.type === 'celebrate' && <Star className="w-4 h-4 text-purple-500" />}
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground">{notif.text}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Export Actions */}
                        <div className="grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-border">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center justify-center gap-1.5 p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-lg text-xs font-bold transition-colors"
                            >
                                <Download className="w-3.5 h-3.5" /> CSV Export
                            </button>
                            <button className="flex items-center justify-center gap-1.5 p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg text-xs font-bold transition-colors">
                                <FileText className="w-3.5 h-3.5" /> AI Report
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

