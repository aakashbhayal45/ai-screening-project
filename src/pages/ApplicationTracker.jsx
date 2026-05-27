import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Calendar, MapPin, Building2, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function ApplicationTracker() {
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState([]);

    const [columns] = useState([
        { id: 'pending', title: 'Applied (Pending)', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
        { id: 'shortlisted', title: 'Shortlisted', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
        { id: 'interview', title: 'Interviewing', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20' },
        { id: 'rejected', title: 'Rejected', color: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20' },
    ]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/applications/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data?.data) {
                    const mappedApps = res.data.data.map(app => ({
                        id: app._id,
                        company: app.jobId?.companyId?.name || 'Unknown Company',
                        role: app.jobId?.title || 'Unknown Role',
                        status: app.status || 'pending',
                        location: app.jobId?.location || 'Unspecified',
                        appliedDate: new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        logo: app.jobId?.companyId?.logoUrl || (app.jobId?.companyId?.name ? app.jobId.companyId.name.substring(0, 1).toUpperCase() : 'C')
                    }));
                    setApplications(mappedApps);
                }
            } catch (err) {
                console.error('Failed to fetch applications', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (isLoading) {
        return <div className="max-w-6xl mx-auto py-24 text-center animate-pulse text-muted-foreground">Loading Applications...</div>;
    }

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col -m-6 md:-m-8 animate-in fade-in duration-500 bg-background text-foreground overflow-hidden">
            {/* Header */}
            <div className="h-20 border-b border-border bg-card flex items-center justify-between px-6 sm:px-8 shrink-0 shadow-sm z-10">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Application Tracker</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your job search pipeline.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Application</span>
                </button>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 sm:p-8 custom-scrollbar bg-muted/20">
                <div className="flex gap-6 h-full min-w-max pb-4">
                    {columns.map(column => {
                        const colApps = applications.filter(app => app.status === column.id);

                        return (
                            <div key={column.id} className="w-80 flex flex-col h-full bg-card border border-border rounded-xl shadow-sm shrink-0">
                                {/* Column Header */}
                                <div className="p-4 flex items-center justify-between border-b border-border/50 bg-muted/10 rounded-t-xl">
                                    <h3 className={cn("px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border", column.color)}>
                                        {column.title} <span className="ml-1 opacity-70">({colApps.length})</span>
                                    </h3>
                                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Cards */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar">
                                    {colApps.map(app => (
                                        <div key={app.id} className="bg-background border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
                                                    {app.logo}
                                                </div>
                                                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <h4 className="font-bold text-foreground text-sm leading-tight mb-1">{app.role}</h4>
                                            <p className="text-xs font-medium text-primary flex items-center gap-1.5 mb-3">
                                                <Building2 className="w-3.5 h-3.5" /> {app.company}
                                            </p>

                                            <div className="space-y-2 mt-4 text-xs font-medium text-muted-foreground">
                                                <div className="flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {app.location}</span>
                                                    <ExternalLink className="w-3.5 h-3.5 hover:text-primary cursor-pointer transition-colors" />
                                                </div>
                                                {app.appliedDate && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" /> {app.appliedDate}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {colApps.length === 0 && (
                                        <div className="p-4 text-center border-2 border-dashed border-border rounded-lg text-muted-foreground text-sm font-medium">
                                            No applications here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
