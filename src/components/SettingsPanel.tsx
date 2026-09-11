import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Settings, 
  Power, 
  Clock, 
  Mail, 
  Bell,
  Play,
  Pause,
  RefreshCw,
  Zap,
  AlertTriangle,
  Globe,
  Search,
  FileCheck
} from 'lucide-react';
import type { AutomationSettings, UserProfile, JobPreference, AppliedJob } from '../App';
import JobApplicationAgent, { JobListing, checkInternetConnection } from '../agents/JobAgent';

interface SettingsPanelProps {
  settings: AutomationSettings;
  setSettings: (settings: AutomationSettings) => void;
  lastRunTime: string;
  setLastRunTime: (time: string) => void;
  profile?: UserProfile;
  preferences?: JobPreference;
  onJobApplied?: (job: AppliedJob) => void;
}

// Sample job data for simulation
const SAMPLE_COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'Nvidia',
  'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'Cisco', 'Dell', 'HP',
  'Stripe', 'Shopify', 'Spotify', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Slack',
  'GitHub', 'GitLab', 'Atlassian', 'Twilio', 'Datadog', 'Snowflake', 'Palantir', 'CrowdStrike'
];

const SAMPLE_POSITIONS = [
  'Junior Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Analyst', 'DevOps Engineer', 'Cloud Engineer', 'QA Engineer',
  'Systems Administrator', 'Network Engineer', 'Security Analyst', 'Database Administrator',
  'Mobile Developer', 'UI/UX Developer', 'Machine Learning Engineer', 'AI Research Intern',
  'IT Support Specialist', 'Technical Writer', 'Product Analyst', 'Solutions Engineer'
];

const SAMPLE_LOCATIONS = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Denver, CO', 'Hybrid - LA', 'Hybrid - Miami'];

const SAMPLE_DEPARTMENTS = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Cybersecurity', 'Web Development', 'Cloud Computing', 'DevOps'];

const SAMPLE_SALARIES = ['$45,000 - $65,000', '$50,000 - $70,000', '$55,000 - $80,000', '$60,000 - $85,000', '$65,000 - $90,000', '$70,000 - $95,000', '$75,000 - $100,000', '$80,000 - $110,000'];

export default function SettingsPanel({ settings, setSettings, lastRunTime, setLastRunTime, profile, preferences, onJobApplied }: SettingsPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [runLog, setRunLog] = useState<string[]>(() => {
    const saved = localStorage.getItem('autoapply_runlog');
    return saved ? JSON.parse(saved) : [];
  });
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [internetStatus, setInternetStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [foundJobs, setFoundJobs] = useState<JobListing[]>([]);
  const agentRef = useRef<JobApplicationAgent | null>(null);

  // Check internet connection on mount
  useEffect(() => {
    checkInternetConnection()
      .then(() => setInternetStatus('connected'))
      .catch(() => setInternetStatus('disconnected'));
    
    const interval = setInterval(() => {
      checkInternetConnection()
        .then(() => setInternetStatus('connected'))
        .catch(() => setInternetStatus('disconnected'));
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize agent when settings change
  useEffect(() => {
    if (agentRef.current) {
      agentRef.current.stop();
      agentRef.current = null;
    }

    if (settings.enabled && profile && preferences) {
      agentRef.current = new JobApplicationAgent(
        {
          keywords: preferences.keywords,
          locations: preferences.locations,
          departments: preferences.departments,
          minSalary: preferences.salaryMin,
          maxApplicationsPerDay: settings.maxApplicationsPerDay,
        },
        profile
      );

      agentRef.current.setLogCallback((message) => {
        setRunLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 50));
      });

      agentRef.current.setJobFoundCallback((job) => {
        setFoundJobs(prev => [job, ...prev].slice(0, 20));
      });

      agentRef.current.setApplicationCallback((job, applicationId) => {
        const newJob: AppliedJob = {
          id: applicationId,
          company: job.company,
          position: job.title,
          department: job.department,
          appliedDate: new Date().toISOString(),
          status: 'applied',
          location: job.location,
          salary: job.salary,
        };
        
        // Update applied jobs in localStorage
        const savedJobs = localStorage.getItem('autoapply_jobs');
        const jobs: AppliedJob[] = savedJobs ? JSON.parse(savedJobs) : [];
        jobs.push(newJob);
        localStorage.setItem('autoapply_jobs', JSON.stringify(jobs));
        
        if (onJobApplied) {
          onJobApplied(newJob);
        }
      });

      agentRef.current.start();
    }

    return () => {
      if (agentRef.current) {
        agentRef.current.stop();
      }
    };
  }, [settings.enabled, settings.maxApplicationsPerDay, profile, preferences, onJobApplied]);

  useEffect(() => {
    localStorage.setItem('autoapply_runlog', JSON.stringify(runLog));
  }, [runLog]);

  const simulateJobApplication = useCallback(() => {
    const savedJobs = localStorage.getItem('autoapply_jobs');
    const jobs: AppliedJob[] = savedJobs ? JSON.parse(savedJobs) : [];
    const prefs = localStorage.getItem('autoapply_preferences');
    const preferences: JobPreference = prefs ? JSON.parse(prefs) : { departments: ['Computer Science'], jobTypes: ['Full-time'], locations: ['Remote'], salaryMin: 30000, experienceLevel: 'Entry Level', keywords: [] };

    const numToApply = Math.min(
      Math.floor(Math.random() * 5) + 1,
      settings.maxApplicationsPerDay
    );

    const newLogs: string[] = [];
    newLogs.push(`[${new Date().toLocaleTimeString()}] Starting application cycle...`);

    for (let i = 0; i < numToApply; i++) {
      const company = SAMPLE_COMPANIES[Math.floor(Math.random() * SAMPLE_COMPANIES.length)];
      const position = SAMPLE_POSITIONS[Math.floor(Math.random() * SAMPLE_POSITIONS.length)];
      const location = SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)];
      const department = preferences.departments[Math.floor(Math.random() * preferences.departments.length)] || SAMPLE_DEPARTMENTS[Math.floor(Math.random() * SAMPLE_DEPARTMENTS.length)];
      const salary = SAMPLE_SALARIES[Math.floor(Math.random() * SAMPLE_SALARIES.length)];

      const newJob: AppliedJob = {
        id: `job_${Date.now()}_${i}`,
        company,
        position,
        department,
        appliedDate: new Date().toISOString(),
        status: 'applied',
        location,
        salary,
      };

      jobs.push(newJob);
      newLogs.push(`[${new Date().toLocaleTimeString()}] ✓ Applied to ${position} at ${company} (${department})`);
    }

    newLogs.push(`[${new Date().toLocaleTimeString()}] Cycle complete: ${numToApply} applications submitted`);
    
    localStorage.setItem('autoapply_jobs', JSON.stringify(jobs));
    setRunLog(prev => [...newLogs, ...prev].slice(0, 50));
    setLastRunTime(new Date().toISOString());
    setIsRunning(false);
  }, [settings.maxApplicationsPerDay, setLastRunTime]);

  const handleToggleAutomation = () => {
    const newSettings = { ...settings, enabled: !settings.enabled };
    setSettings(newSettings);
    
    if (!settings.enabled) {
      // Starting automation
      setLastRunTime(new Date().toISOString());
      setRunLog(prev => [`[${new Date().toLocaleTimeString()}] 🚀 Automation started`, ...prev].slice(0, 50));
    } else {
      setRunLog(prev => [`[${new Date().toLocaleTimeString()}] ⏸️ Automation paused`, ...prev].slice(0, 50));
    }
  };

  const handleRunNow = () => {
    setIsRunning(true);
    setRunLog(prev => [`[${new Date().toLocaleTimeString()}] ⚡ Manual run triggered...`, ...prev].slice(0, 50));
    setTimeout(() => {
      simulateJobApplication();
    }, 2000);
  };

  const handleClearHistory = () => {
    localStorage.setItem('autoapply_jobs', JSON.stringify([]));
    localStorage.setItem('autoapply_runlog', JSON.stringify([]));
    setRunLog([]);
    setShowConfirmReset(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Toggle */}
      <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
        settings.enabled 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              settings.enabled ? 'bg-green-100 shadow-lg shadow-green-200' : 'bg-gray-200'
            }`}>
              <Power className={`w-8 h-8 ${settings.enabled ? 'text-green-600' : 'text-gray-500'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {settings.enabled ? 'Automation is Active' : 'Automation is Paused'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {settings.enabled 
                  ? `Applying every ${settings.intervalHours} hours • Max ${settings.maxApplicationsPerDay}/day`
                  : 'Enable to start automatic job applications'}
              </p>
              {settings.enabled && lastRunTime && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last run: {new Date(lastRunTime).toLocaleString()}
                </p>
              )}
              {/* Internet Status Indicator */}
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${
                  internetStatus === 'connected' ? 'bg-green-500' :
                  internetStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-xs text-gray-600">
                  {internetStatus === 'connected' ? 'Internet Connected' :
                   internetStatus === 'disconnected' ? 'No Internet' : 'Checking...'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRunNow}
              disabled={!settings.enabled || isRunning}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                settings.enabled && !isRunning
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Run Now
                </>
              )}
            </button>
            <button
              onClick={handleToggleAutomation}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                settings.enabled 
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200' 
                  : 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200'
              }`}
            >
              {settings.enabled ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Enable
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Agent Status & Found Jobs */}
      {settings.enabled && (
        <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Agent Status</h3>
              <p className="text-sm text-gray-500">Live job search and application tracking</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Jobs Found</span>
              </div>
              <p className="text-2xl font-bold text-green-800 mt-1">{foundJobs.length}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">Applications</span>
              </div>
              <p className="text-2xl font-bold text-blue-800 mt-1">{runLog.filter(l => l.includes('✓')).length}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700">Agent Status</span>
              </div>
              <p className="text-sm font-bold text-purple-800 mt-1">
                {agentRef.current?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {foundJobs.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recently Found Jobs</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {foundJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{job.title}</p>
                        <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
                      </div>
                      <span className="text-xs text-green-600 font-medium">{job.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schedule Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Schedule Configuration</h3>
            <p className="text-sm text-gray-500">Set how often and how many applications to submit</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Interval
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="48"
                value={settings.intervalHours}
                onChange={(e) => setSettings({ ...settings, intervalHours: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-24 text-center">
                <span className="text-lg font-bold text-indigo-600">{settings.intervalHours}h</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {settings.intervalHours === 24 
                ? 'Default: Runs once every 24 hours' 
                : `Will run every ${settings.intervalHours} hours`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Applications Per Run
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="25"
                value={settings.maxApplicationsPerDay}
                onChange={(e) => setSettings({ ...settings, maxApplicationsPerDay: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-24 text-center">
                <span className="text-lg font-bold text-indigo-600">{settings.maxApplicationsPerDay}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maximum number of job applications per automation cycle
            </p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <p className="text-sm text-gray-500">Configure how you receive updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-500">Get notified about application status changes</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, notifyEmail: !settings.notifyEmail })}
              className={`w-12 h-7 rounded-full transition-all duration-200 ${
                settings.notifyEmail ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                settings.notifyEmail ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Auto-Apply</p>
                <p className="text-sm text-gray-500">Automatically apply to matching jobs</p>
              </div>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoApply: !settings.autoApply })}
              className={`w-12 h-7 rounded-full transition-all duration-200 ${
                settings.autoApply ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                settings.autoApply ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Danger Zone</h3>
            <p className="text-sm text-red-600">Irreversible actions</p>
          </div>
        </div>

        {showConfirmReset ? (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <p className="text-sm text-red-700 font-medium mb-3">
              Are you sure? This will delete all application history and cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Yes, Clear Everything
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Clear All Application History
          </button>
        )}
      </div>

      {/* Run Log */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Activity Log</h3>
            <p className="text-sm text-gray-500">Recent automation activity</p>
          </div>
        </div>

        {runLog.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No activity yet. Enable automation to see logs here.</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl p-4 max-h-64 overflow-y-auto">
            {runLog.map((log, i) => (
              <div key={i} className="text-sm font-mono text-green-400 py-0.5">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
