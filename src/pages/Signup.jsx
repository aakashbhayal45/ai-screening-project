import { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Building2, UserCircle, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { cn } from '../lib/utils';

export default function Signup() {
    const [step, setStep] = useState(1); // 1: Role, 2: Details
    const [role, setRole] = useState('hr'); // 'hr', 'candidate'
    const [formData, setFormData] = useState({ name: '', identifier: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (tokenResponse) => {
        setIsLoading(true);
        try {
            // Pass the currently selected role to the backend
            const res = await axios.post('/api/auth/google', {
                googleToken: tokenResponse.credential || tokenResponse.access_token,
                role: role // 'hr' or 'candidate'
            });

            if (res.data.success) {
                // Store token
                localStorage.setItem('token', res.data.token);

                // Redirect based on the returned user role
                if (res.data.user.role === 'hr' || res.data.user.role === 'admin') {
                    navigate('/');
                } else {
                    navigate('/candidate/dashboard');
                }
            }
        } catch (error) {
            console.error('Google signup failed:', error);
            alert('Google signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => {
            console.error('Google Signup Failed');
            alert('Google Signup Failed');
        }
    });

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/register', {
                ...formData,
                role
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                if (res.data.user.role === 'hr' || res.data.user.role === 'admin') {
                    navigate('/');
                } else {
                    navigate('/candidate/dashboard');
                }
            }
        } catch (error) {
            console.error('Signup failed:', error);
            alert(error.response?.data?.message || 'Signup failed. Please try again or use a different email.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <div className="w-full max-w-[480px] bg-card border border-border shadow-xl rounded-2xl p-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">

                <div className="flex flex-col items-center justify-center mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
                    <p className="text-sm text-muted-foreground mt-1">Join the AI-powered recruitment platform.</p>
                </div>

                {step === 1 ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-foreground block mb-2">How do you want to use the platform?</label>

                            <button
                                onClick={() => setRole('hr')}
                                className={cn(
                                    "w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                                    role === 'hr' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                                )}
                            >
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", role === 'hr' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn("font-bold text-base mb-0.5", role === 'hr' ? "text-primary" : "text-foreground")}>I'm hiring people</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Screen resumes, manage job postings, and find the best candidates using AI.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setRole('candidate')}
                                className={cn(
                                    "w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                                    role === 'candidate' ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                                )}
                            >
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", role === 'candidate' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                                    <UserCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn("font-bold text-base mb-0.5", role === 'candidate' ? "text-primary" : "text-foreground")}>I'm looking for a job</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">Build a resume, optimize it for ATS, and track your applications.</p>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] mt-4"
                        >
                            Continue <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-foreground">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-foreground">Email or Mobile Number</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    value={formData.identifier}
                                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                    placeholder="name@company.com or +1 234 567 890"
                                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-foreground">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a strong password"
                                    className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                disabled={isLoading}
                                className="w-1/3 py-2.5 bg-background border border-border text-foreground rounded-lg text-sm font-semibold hover:bg-muted transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-2/3 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                ) : (
                                    <><UserPlus className="w-4 h-4" /> Create Account <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-border"></div>
                            <span className="flex-shrink-0 mx-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Or continue with</span>
                            <div className="flex-grow border-t border-border"></div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                className="w-full flex items-center justify-center gap-3 bg-background border border-border text-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-muted transition-all shadow-sm active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-border flex flex-col items-center justify-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-primary hover:underline transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
