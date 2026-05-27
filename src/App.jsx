import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Recruiter Pages
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/CandidateDetail';
import JDManager from './pages/JDManager';
import AdminSettings from './pages/AdminSettings';
import CompanyProfile from './pages/CompanyProfile';
import Interviews from './pages/Interviews';
import AIChatbot from './pages/AIChatbot';

// Candidate Pages
import CandidateDashboard from './pages/CandidateDashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ApplicationTracker from './pages/ApplicationTracker';
import AccountSettings from './pages/AccountSettings';

// Shared Pages
import UserProfile from './pages/UserProfile';

function App() {
  useEffect(() => {
    const applyTheme = async () => {
      try {
        let theme = 'System Default';

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          const userRes = await axios.get('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (userRes.data?.success && userRes.data?.data?.theme) {
            theme = userRes.data.data.theme;
          }
        } else {
          // Fallback to global settings if not logged in
          const res = await axios.get('/api/settings');
          theme = res.data?.general?.theme || 'System Default';
        }

        const root = document.documentElement;
        // Remove ALL possible theme classes first
        root.className = '';

        if (theme === 'Dark Mode') {
          root.classList.add('dark');
        } else if (theme === 'Midnight Blue') {
          root.classList.add('theme-midnight');
        } else if (theme === 'Forest Green') {
          root.classList.add('theme-forest');
        } else if (theme === 'Sunset Orange') {
          root.classList.add('theme-sunset');
        } else if (theme === 'Rose Gold') {
          root.classList.add('theme-rose');
        } else if (theme === 'Cyberpunk') {
          root.classList.add('theme-cyberpunk');
        } else if (theme === 'System Default') {
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark');
          }
        }
      } catch (error) {
        console.error('Failed to fetch theme', error);
      }
    };

    applyTheme();

    // Listen for a custom event from UserProfile to update instantly
    const handleThemeChange = (e) => {
      const theme = e.detail;
      const root = document.documentElement;
      root.className = '';
      if (theme === 'Dark Mode') root.classList.add('dark');
      else if (theme === 'Midnight Blue') root.classList.add('theme-midnight');
      else if (theme === 'Forest Green') root.classList.add('theme-forest');
      else if (theme === 'Sunset Orange') root.classList.add('theme-sunset');
      else if (theme === 'Rose Gold') root.classList.add('theme-rose');
      else if (theme === 'Cyberpunk') root.classList.add('theme-cyberpunk');
      else if (theme === 'System Default' && window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark');
    };

    window.addEventListener('theme-updated', handleThemeChange);
    return () => window.removeEventListener('theme-updated', handleThemeChange);
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Layout />}>
            {/* Recruiter Routes */}
            <Route index element={<Dashboard />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="candidates/:id" element={<CandidateDetail />} />
            <Route path="jds" element={<JDManager />} />
            <Route path="company-profile" element={<CompanyProfile />} />
            <Route path="chat" element={<AIChatbot />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="settings/admin" element={<AdminSettings />} />

            {/* Candidate Routes */}
            <Route path="candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="candidate/builder" element={<ResumeBuilder />} />
            <Route path="candidate/tracker" element={<ApplicationTracker />} />
            <Route path="candidate/settings" element={<AccountSettings />} />

            {/* Shared Routes */}
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
