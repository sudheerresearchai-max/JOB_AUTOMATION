import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  AlertCircle,
  Play,
  Pause,
  ArrowRight,
  Calendar,
  Building2,
  MapPin
} from 'lucide-react';
import type { UserProfile, JobPreference, AppliedJob, AutomationSettings } from '../App';

interface DashboardProps {
  profile: UserProfile;
  preferences: JobPreference;
  appliedJobs: AppliedJob[];
  settings: AutomationSettings;
  lastRunTime: string;
  onNavigate: (tab: 'dashboard' | 'profile' | 'preferences' | 'history' | 'settings') => void;
}

export default function Dashboard({ profile, preferences, appliedJobs, settings, lastRunTime, onNavigate }: DashboardProps) {
  const [timeUntilNextRun, setTimeUntilNextRun] = useState('');
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (settings.enabled && lastRunTime) {
      const interval = setInterval(() => {
        const lastRun = new Date(lastRunTime).getTime();
        const nextRun = lastRun + settings.intervalHours * 60 * 60 * 1000;
        const now = Date.now();
        const remaining = nextRun - now;

        if (remaining <= 0) {
          setTimeUntilNextRun('Running now...');
          setCountdown(0);
        } else {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeUntilNextRun(`${hours}h ${minutes}m ${seconds}s`);
          setCountdown(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [settings.enabled, lastRunTime, settings.intervalHours]);

  const stats = [
    {
      label: 'Total Applications',
      value: appliedJobs.length,
      icon: Briefcase,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Under Review',
      value: appliedJobs.filter(j => j.status === 'reviewing').length,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: 'Interviews',
      value: appliedJobs.filter(j => j.status === 'interview').length,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'This Week',
      value: appliedJobs.filter(j => {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return new Date(j.appliedDate).getTime() > weekAgo;
      }).length,
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  const recentJobs = appliedJobs.slice(0, 5);

  const isProfileComplete = profile.fullName && profile.email && profile.resumeUploaded;
  const progress = [
    { label: 'Profile Setup', done: !!(profile.fullName && profile.email) },
    { label: 'Resume Uploaded', done: profile.resumeUploaded },
    { label: 'Job Preferences Set', done: preferences.departments.length > 0 },
    { label: 'Automation Enabled', done: settings.enabled },
  ];
  const completedSteps = progress.filter(p => p.done).length;

  return (
    <div className="space-y-6">
      {/* Setup Progress Banner */}
      {!isProfileComplete && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Complete Your Setup</h3>
                <p className="text-sm text-amber-600 mt-1">
                  Finish setting up your profile to start automated job applications
                </p>
                <div className="flex gap-3 mt-3 flex-wrap">
                  {progress.map((step, i) => (
                    <div key={i} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${step.done ? 'bg-green-100 text-green-700' : 'bg-white text-gray-600 border'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${step.done ? 'text-green-500' : 'text-gray-400'}`} />
                      {step.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors flex items-center gap-2 self-start md:self-center"
            >
              Complete Setup <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Automation Status & Next Run */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Automation Status</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${settings.enabled ? 'bg-green-100' : 'bg-gray-200'}`}>
                {settings.enabled ? (
                  <Play className="w-7 h-7 text-green-600" />
                ) : (
                  <Pause className="w-7 h-7 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {settings.enabled ? 'Automation Running' : 'Automation Paused'}
                </p>
                <p className="text-sm text-gray-500">
                  {settings.enabled 
                    ? `Applying every ${settings.intervalHours} hours • Max ${settings.maxApplicationsPerDay}/day`
                    : 'Enable automation to start applying automatically'}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('settings')}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                settings.enabled 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              {settings.enabled ? 'Pause' : 'Enable'}
            </button>
          </div>

          {settings.enabled && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-indigo-800">Next Application Run</p>
                  <p className="text-lg font-bold text-indigo-600 font-mono">{timeUntilNextRun || 'Calculating...'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Target Departments */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Target Departments</h4>
            <div className="flex flex-wrap gap-2">
              {preferences.departments.map((dept, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Update Profile</p>
                <p className="text-xs text-gray-500">Edit your details & resume</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('preferences')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Change Preferences</p>
                <p className="text-xs text-gray-500">Adjust target departments</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">View Applications</p>
                <p className="text-xs text-gray-500">{appliedJobs.length} total applications</p>
              </div>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">Automation Settings</p>
                <p className="text-xs text-gray-500">Configure schedule</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {recentJobs.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No applications yet</p>
            <p className="text-sm text-gray-400 mt-1">Complete your setup and enable automation to start applying</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {job.company.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{job.position}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    job.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'reviewing' ? 'bg-amber-100 text-amber-700' :
                    job.status === 'interview' ? 'bg-green-100 text-green-700' :
                    job.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{new Date(job.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
