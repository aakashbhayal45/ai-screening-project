import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Video, Mail, MoreHorizontal, User, CheckCircle2, XCircle, Plus, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

export default function Interviews() {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [interviews, setInterviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Scheduling Modal State
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [newInterview, setNewInterview] = useState({
        candidateId: '',
        applicationId: '',
        roundType: 'HR',
        date: '',
        time: '',
        duration: 30,
        interviewerIds: [],
        locationOrLink: '',
        candidateName: '',
        candidateEmail: ''
    });

    const [feedbackForm, setFeedbackForm] = useState({
        rating: 3,
        notes: '',
        decision: 'Pending'
    });

    useEffect(() => {
        const fetchInterviewsAndCandidates = async () => {
            try {
                const token = localStorage.getItem('token');

                // Fetch Interviews
                const resInterviews = await axios.get('/api/interviews', {
                    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
                });

                if (resInterviews.data.success) {
                    setInterviews(resInterviews.data.data);
                }

                // Fetch Candidates for the dropdown (assuming hr/admin role here for scheduling)
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (userObj && (userObj.role === 'admin' || userObj.role === 'hr')) {
                    const resCandidates = await axios.get('/api/candidates', {
                        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
                    });
                    if (resCandidates.data.success) {
                        setCandidates(resCandidates.data.data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInterviewsAndCandidates();
    }, []);

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // Basic validation - ensure applicationId is set if candidate is selected
            // For now, if no application, we might fake an application ID or backend must handle. 
            // In a real app, you'd fetch the candidate's active application.
            // Let's assume the candidate list includes their active Application ID.

            const selectedCand = candidates.find(c => (c.user && c.user._id === newInterview.candidateId) || c.id === newInterview.candidateId);
            const dataToSubmit = {
                ...newInterview,
                // Mock application ID if not found for testing, ideally backend handles or candidates list provides it
                applicationId: selectedCand?.applications?.[0]?._id || selectedCand?.id || '000000000000000000000000',
                candidateName: newInterview.candidateName || selectedCand?.user?.name || selectedCand?.name || 'Unknown Candidate',
                candidateEmail: newInterview.candidateEmail || selectedCand?.user?.email || selectedCand?.email || ''
            };

            const res = await axios.post('/api/interviews', dataToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setIsScheduleModalOpen(false);
                // Refresh list
                window.location.reload();
            }
        } catch (error) {
            console.error('Error scheduling:', error);
            alert('Failed to schedule interview.');
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!selectedInterviewForFeedback) return;

        try {
            const token = localStorage.getItem('token');
            const dataToSubmit = {
                status: 'completed',
                feedback: feedbackForm
            };

            const res = await axios.put(`/api/interviews/${selectedInterviewForFeedback}`, dataToSubmit, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setIsFeedbackModalOpen(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback.');
        }
    };

    const openFeedbackModal = (interviewId) => {
        setSelectedInterviewForFeedback(interviewId);
        setFeedbackForm({ rating: 3, notes: '', decision: 'Pending' });
        setIsFeedbackModalOpen(true);
    };

    const currentInterviews = activeTab === 'all' ? interviews : interviews.filter(i => i.status === activeTab);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Interviews</h1>
                    <p className="text-muted-foreground mt-1">Schedule and manage candidate interviews and communication.</p>
                </div>
                <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" /> Schedule Interview
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Col - Calendar & List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">

                        {/* Tab Header */}
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                            <div className="flex bg-background border border-border rounded-lg p-1 w-fit shadow-sm">
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", activeTab === 'upcoming' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() => setActiveTab('past')}
                                    className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", activeTab === 'past' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                                >
                                    Past
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <button className="p-1.5 hover:bg-muted rounded text-muted-foreground transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                <span>February 2026</span>
                                <button className="p-1.5 hover:bg-muted rounded text-muted-foreground transition-colors"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="p-4 flex-1 overflow-y-auto space-y-4">
                            {currentInterviews.length > 0 ? currentInterviews.map((interview) => (
                                <div key={interview.id} className="relative p-5 rounded-xl border border-border bg-background shadow-sm hover:border-primary/30 transition-all flex flex-col sm:flex-row gap-5 group">
                                    <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg min-w-[90px] text-center border border-border">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{interview.date ? interview.date.split(',')[0] : 'TBD'}</span>
                                        <span className="text-lg font-bold text-foreground">{interview.time || 'TBD'}</span>
                                        <span className="text-[10px] font-medium text-muted-foreground mt-1">{interview.duration} min</span>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-foreground truncate">{interview.candidate}</h3>
                                                <p className="text-sm font-medium text-primary mt-0.5">{interview.role}</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 hover:bg-muted text-muted-foreground rounded-md transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border border-dashed">
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                                <User className="w-3.5 h-3.5" /> {interview.type}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                                <Video className="w-3.5 h-3.5" /> {interview.location}
                                            </span>
                                        </div>
                                    </div>

                                    {activeTab === 'upcoming' && (
                                        <div className="flex border-t sm:border-none border-border pt-4 sm:pt-0 mt-4 sm:mt-0 items-center justify-end shrink-0 pl-4 gap-2">
                                            <button className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs rounded-lg transition-colors">
                                                Join Call
                                            </button>
                                            <button
                                                onClick={() => openFeedbackModal(interview.id)}
                                                className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs rounded-lg transition-colors border border-border"
                                            >
                                                Complete & Rate
                                            </button>
                                        </div>
                                    )}
                                    {activeTab === 'completed' && interview.feedback && (
                                        <div className="flex flex-col border-l border-border pl-4 justify-center shrink-0">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-bold uppercase text-muted-foreground">Decision</span>
                                                <span className={cn("text-sm font-bold",
                                                    interview.feedback.decision === 'Hire' ? 'text-emerald-500' :
                                                        interview.feedback.decision === 'Reject' ? 'text-red-500' : 'text-amber-500'
                                                )}>
                                                    {interview.feedback.decision}
                                                </span>
                                                <span className="text-xs mt-1 text-muted-foreground">Rating: {interview.feedback.rating}/5</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                                    <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="font-medium text-foreground">No interviews found</p>
                                    <p className="text-sm">You have no {activeTab} interviews scheduled.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Col - Communication / Email Templates */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-border bg-muted/20">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" /> Communication
                            </h3>
                        </div>

                        <div className="p-5 flex-1 flex flex-col gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Template</label>
                                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 appearance-none">
                                    <option>Interview Invitation</option>
                                    <option>Offer Letter</option>
                                    <option>Standard Rejection</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To</label>
                                <input type="text" placeholder="candidate@example.com" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" />
                            </div>

                            <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                                <textarea
                                    className="w-full flex-1 bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none"
                                    defaultValue={""}
                                />
                            </div>

                            <div className="pt-2">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                                    <Send className="w-4 h-4" /> Send Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Schedule modal */}
            {isScheduleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in p-4">
                    <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
                            <h2 className="text-xl font-bold text-foreground">Schedule Interview</h2>
                            <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleScheduleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Select Candidate <span className="text-red-500">*</span></label>
                                <input
                                    list="candidate-list"
                                    required
                                    placeholder="Type candidate name or select from list..."
                                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    value={newInterview.candidateName}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const selectedCand = candidates.find(c => (c.user?.name === val) || (c.name === val));
                                        setNewInterview({
                                            ...newInterview,
                                            candidateName: val,
                                            candidateId: selectedCand ? (selectedCand.user?._id || selectedCand.id) : `manual-${Date.now()}`,
                                            candidateEmail: selectedCand ? (selectedCand.user?.email || selectedCand.email) : ''
                                        });
                                    }}
                                />
                                <datalist id="candidate-list">
                                    {candidates.map(cand => (
                                        <option key={cand.id} value={cand.user?.name || cand.name}>
                                            {cand.user?.email || cand.email}
                                        </option>
                                    ))}
                                </datalist>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Round Type <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={newInterview.roundType}
                                        onChange={(e) => setNewInterview({ ...newInterview, roundType: e.target.value })}
                                    >
                                        <option value="HR">HR Round</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Managerial">Managerial</option>
                                        <option value="Final">Final Round</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Duration <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={newInterview.duration}
                                        onChange={(e) => setNewInterview({ ...newInterview, duration: Number(e.target.value) })}
                                    >
                                        <option value={15}>15 Minutes</option>
                                        <option value={30}>30 Minutes</option>
                                        <option value={45}>45 Minutes</option>
                                        <option value={60}>60 Minutes</option>
                                        <option value={90}>90 Minutes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={newInterview.date}
                                        onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Time <span className="text-red-500">*</span></label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={newInterview.time}
                                        onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Meeting Link / Location</label>
                                <div className="relative">
                                    <Video className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="https://zoom.us/j/..."
                                        className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={newInterview.locationOrLink}
                                        onChange={(e) => setNewInterview({ ...newInterview, locationOrLink: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Add a Google Meet, Zoom, or Teams link.</p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsScheduleModalOpen(false)}
                                    className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    Confirm Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Feedback modal */}
            {isFeedbackModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in p-4">
                    <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
                            <h2 className="text-xl font-bold text-foreground">Complete Interview</h2>
                            <button onClick={() => setIsFeedbackModalOpen(false)} className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFeedbackSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Candidate Rating (1-5)</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center border font-bold transition-all",
                                                    feedbackForm.rating >= star
                                                        ? "bg-amber-500 text-white border-amber-600 shadow-md transform scale-105"
                                                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                                )}
                                            >
                                                {star}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Final Decision <span className="text-red-500">*</span></label>
                                    <select
                                        required
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        value={feedbackForm.decision}
                                        onChange={(e) => setFeedbackForm({ ...feedbackForm, decision: e.target.value })}
                                    >
                                        <option value="Pending">Still Deciding (Pending)</option>
                                        <option value="Hire">Hire / Move to Next Round</option>
                                        <option value="Hold">Keep on Hold</option>
                                        <option value="Reject">Reject</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Interview Notes</label>
                                    <textarea
                                        placeholder="Record your thoughts on their technical skills, cultural fit, etc."
                                        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px] resize-y"
                                        value={feedbackForm.notes}
                                        onChange={(e) => setFeedbackForm({ ...feedbackForm, notes: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground">These notes are internal and won't be visible to the candidate.</p>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsFeedbackModalOpen(false)}
                                    className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    Save Feedback
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div >
    );
}
