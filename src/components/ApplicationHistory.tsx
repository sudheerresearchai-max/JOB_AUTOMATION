import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign,
  ExternalLink,
  Trash2,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import type { AppliedJob } from '../App';

interface ApplicationHistoryProps {
  appliedJobs: AppliedJob[];
  setAppliedJobs: (jobs: AppliedJob[]) => void;
}

type StatusFilter = 'all' | 'applied' | 'reviewing' | 'interview' | 'rejected' | 'accepted';

export default function ApplicationHistory({ appliedJobs, setAppliedJobs }: ApplicationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<'date' | 'company'>('date');

  const filteredJobs = appliedJobs
    .filter(job => {
      const matchesSearch = job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      return a.company.localeCompare(b.company);
    });

  const removeJob = (id: string) => {
    setAppliedJobs(appliedJobs.filter(j => j.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="w-4 h-4" />;
      case 'reviewing': return <AlertCircle className="w-4 h-4" />;
      case 'interview': return <TrendingUp className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'accepted': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'reviewing': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'interview': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'accepted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const statusCounts = {
    all: appliedJobs.length,
    applied: appliedJobs.filter(j => j.status === 'applied').length,
    reviewing: appliedJobs.filter(j => j.status === 'reviewing').length,
    interview: appliedJobs.filter(j => j.status === 'interview').length,
    rejected: appliedJobs.filter(j => j.status === 'rejected').length,
    accepted: appliedJobs.filter(j => j.status === 'accepted').length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: statusCounts.all, color: 'bg-gray-100 text-gray-700' },
          { label: 'Applied', value: statusCounts.applied, color: 'bg-blue-50 text-blue-700' },
          { label: 'Reviewing', value: statusCounts.reviewing, color: 'bg-amber-50 text-amber-700' },
          { label: 'Interviews', value: statusCounts.interview, color: 'bg-green-50 text-green-700' },
          { label: 'Accepted', value: statusCounts.accepted, color: 'bg-emerald-50 text-emerald-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, position, or department..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="reviewing">Reviewing</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'company' : 'date')}
              className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">{sortBy === 'date' ? 'By Date' : 'By Company'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            {appliedJobs.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
          </h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            {appliedJobs.length === 0
              ? 'Your job applications will appear here once automation starts running. Complete your profile and enable automation to get started.'
              : 'Try adjusting your search or filter criteria'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {job.company.charAt(0)}
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-gray-800">{job.position}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(job.appliedDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                        {job.department}
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <button
                    onClick={() => removeJob(job.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination info */}
      {filteredJobs.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredJobs.length} of {appliedJobs.length} applications
        </div>
      )}
    </div>
  );
}
