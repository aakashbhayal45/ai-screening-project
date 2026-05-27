import { FileText, Target, Zap, ArrowRight, CheckCircle2, AlertCircle, FileCode, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { cn } from '../lib/utils';

export default function CandidateDashboard() {
    const aiScoreData = [
        { name: 'Mon', score: 65 },
        { name: 'Tue', score: 68 },
        { name: 'Wed', score: 72 },
        { name: 'Thu', score: 70 },
        { name: 'Fri', score: 85 },
        { name: 'Sat', score: 89 },
        { name: 'Sun', score: 92 },
    ];

    const radarData = [
        { subject: 'Frontend', A: 90, fullMark: 100 },
        { subject: 'Backend', A: 60, fullMark: 100 },
        { subject: 'UI/UX', A: 75, fullMark: 100 },
        { subject: 'DevOps', A: 40, fullMark: 100 },
        { subject: 'Testing', A: 85, fullMark: 100 },
        { subject: 'Architecture', A: 65, fullMark: 100 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">My Dashboard</h1>
                <p className="text-lg text-muted-foreground mt-1">Track your AI resume performance and apply to dream jobs.</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Target className="w-24 h-24 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-indigo-800/70 dark:text-indigo-300 mb-1">Overall AI Score</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black font-mono tracking-tighter text-indigo-600 dark:text-indigo-400">92<span className="text-2xl text-indigo-400 dark:text-indigo-600">%</span></span>
                        </div>
                        <p className="text-xs text-indigo-900/60 dark:text-indigo-200/60 mt-2 font-medium">Top 5% of React Developer candidates</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between group">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Profile Status</p>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                        <span className="text-3xl font-bold text-foreground">Ready to Apply</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground">Last updated: 2 hrs ago</span>
                        <Link to="/candidate/builder" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                            Edit Resume <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between transition-colors">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Active Applications</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-foreground">4</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2 border-t border-border pt-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">In Review</span>
                            <span className="font-bold text-foreground">2</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Interviewing</span>
                            <span className="font-bold text-primary">1</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts & Tasks area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Score History */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border flex items-center justify-between">
                        <h2 className="font-bold text-foreground">AI Score Improvement</h2>
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold rounded-md">+27% this week</span>
                    </div>
                    <div className="h-64 w-full p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={aiScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Radar */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border">
                        <h2 className="font-bold text-foreground">Skill Breakdown</h2>
                    </div>
                    <div className="h-64 w-full p-4 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="hsl(var(--border))" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: AI Suggestions & Matches */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-border bg-muted/20">
                        <h2 className="font-bold text-foreground flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-500" /> AI Suggestions to Reach 99%
                        </h2>
                    </div>
                    <div className="p-5 space-y-4 flex-1">
                        <div className="group flex gap-4 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer bg-background">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <FileCode className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Quantify your achievements</h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">AI detected 'improved performance'. Try specifying 'improved performance by 40% using Code Splitting'.</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary ml-auto self-center transition-colors" />
                        </div>

                        <div className="group flex gap-4 p-4 rounded-xl border border-border hover:border-amber-500/30 hover:shadow-md transition-all cursor-pointer bg-background">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground text-sm group-hover:text-amber-600 transition-colors">Missing Keywords: 'AWS', 'Docker'</h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">45% of Senior React roles matching your profile mention AWS. Consider adding it if you have experience.</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-amber-500 ml-auto self-center transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
                        <h2 className="font-bold text-foreground flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" /> Top Job Matches
                        </h2>
                        <Link to="/candidate/tracker" className="text-xs font-bold text-primary hover:underline">View All</Link>
                    </div>
                    <div className="p-0 flex-1">
                        <ul className="divide-y divide-border">
                            {[
                                { title: 'Senior Frontend Engineer', company: 'NovaTech', location: 'Remote', score: 95 },
                                { title: 'React Developer', company: 'Finserve App', location: 'New York (Hybrid)', score: 88 }
                            ].map((job, i) => (
                                <li key={i} className="p-5 hover:bg-muted/30 transition-colors group cursor-pointer flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1 font-medium">{job.company} • {job.location}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{job.score}%</span>
                                        <button className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline">Apply Now</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ensure ChevronRight is imported (was missing in original import)
import { ChevronRight } from 'lucide-react';
