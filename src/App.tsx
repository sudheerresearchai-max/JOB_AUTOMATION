import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  History, 
  Settings, 
  Menu, 
  X,
  Zap
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import JobPreferences from './components/JobPreferences';
import ApplicationHistory from './components/ApplicationHistory';
import SettingsPanel from './components/SettingsPanel';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  resumeFileName: string;
  resumeUploaded: boolean;
  linkedinUrl: string;
  portfolioUrl: string;
}

export interface JobPreference {
  departments: string[];
  jobTypes: string[];
  locations: string[];
  salaryMin: number;
  experienceLevel: string;
  keywords: string[];
}

export interface AppliedJob {
  id: string;
  company: string;
  position: string;
  department: string;
  appliedDate: string;
  status: 'applied' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  location: string;
  salary: string;
}

export interface AutomationSettings {
  enabled: boolean;
  intervalHours: number;
  maxApplicationsPerDay: number;
  autoApply: boolean;
  notifyEmail: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  resumeFileName: '',
  resumeUploaded: false,
  linkedinUrl: '',
  portfolioUrl: '',
};

const DEFAULT_PREFERENCES: JobPreference = {
  departments: ['Computer Science', 'Information Technology', 'Software Engineering'],
  jobTypes: ['Full-time', 'Internship', 'Part-time'],
  locations: ['Remote', 'Hybrid'],
  salaryMin: 30000,
  experienceLevel: 'Entry Level',
  keywords: ['developer', 'engineer', 'analyst', 'programmer'],
};

const DEFAULT_SETTINGS: AutomationSettings = {
  enabled: false,
  intervalHours: 24,
  maxApplicationsPerDay: 10,
  autoApply: true,
  notifyEmail: true,
};

type TabType = 'dashboard' | 'profile' | 'preferences' | 'history' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('autoapply_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [preferences, setPreferences] = useState<JobPreference>(() => {
    const saved = localStorage.getItem('autoapply_preferences');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>(() => {
    const saved = localStorage.getItem('autoapply_jobs');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<AutomationSettings>(() => {
    const saved = localStorage.getItem('autoapply_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [lastRunTime, setLastRunTime] = useState<string>(() => {
    return localStorage.getItem('autoapply_lastRun') || '';
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('autoapply_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('autoapply_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('autoapply_jobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  useEffect(() => {
    localStorage.setItem('autoapply_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (lastRunTime) {
      localStorage.setItem('autoapply_lastRun', lastRunTime);
    }
  }, [lastRunTime]);

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile' as TabType, label: 'Profile & Resume', icon: UserCircle },
    { id: 'preferences' as TabType, label: 'Job Preferences', icon: Briefcase },
    { id: 'history' as TabType, label: 'Application History', icon: History },
    { id: 'settings' as TabType, label: 'Automation Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            profile={profile} 
            preferences={preferences}
            appliedJobs={appliedJobs} 
            settings={settings}
            lastRunTime={lastRunTime}
            onNavigate={setActiveTab}
          />
        );
      case 'profile':
        return <ProfileSetup profile={profile} setProfile={setProfile} />;
      case 'preferences':
        return <JobPreferences preferences={preferences} setPreferences={setPreferences} />;
      case 'history':
        return <ApplicationHistory appliedJobs={appliedJobs} setAppliedJobs={setAppliedJobs} />;
      case 'settings':
        return (
          <SettingsPanel 
            settings={settings} 
            setSettings={setSettings}
            lastRunTime={lastRunTime}
            setLastRunTime={setLastRunTime}
          />
        );
      default:
        return <Dashboard profile={profile} preferences={preferences} appliedJobs={appliedJobs} settings={settings} lastRunTime={lastRunTime} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-gradient-to-b from-indigo-900 to-purple-900 
        text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AutoApply</h1>
              <p className="text-xs text-indigo-200">Job Automation Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className={`px-4 py-3 rounded-xl ${settings.enabled ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${settings.enabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-sm font-medium">
                {settings.enabled ? 'Automation Active' : 'Automation Paused'}
              </span>
            </div>
            {settings.enabled && lastRunTime && (
              <p className="text-xs text-indigo-200 mt-1">
                Last run: {new Date(lastRunTime).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeTab === 'dashboard' && 'Overview of your job application automation'}
                  {activeTab === 'profile' && 'Set up your profile and upload your resume'}
                  {activeTab === 'preferences' && 'Configure your target job departments and filters'}
                  {activeTab === 'history' && 'Track all your job applications'}
                  {activeTab === 'settings' && 'Configure automation schedule and preferences'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile.resumeUploaded && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Resume Ready
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
