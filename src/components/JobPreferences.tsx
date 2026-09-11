import { useState } from 'react';
import { 
  Briefcase, 
  X, 
  Plus, 
  MapPin, 
  DollarSign, 
  GraduationCap,
  Tag,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { JobPreference } from '../App';

interface JobPreferencesProps {
  preferences: JobPreference;
  setPreferences: (prefs: JobPreference) => void;
}

const AVAILABLE_DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Cybersecurity',
  'Web Development',
  'Mobile Development',
  'Cloud Computing',
  'Artificial Intelligence',
  'Machine Learning',
  'Database Administration',
  'Network Engineering',
  'Systems Administration',
  'DevOps',
  'Quality Assurance',
  'Business Intelligence',
  'Electrical Engineering',
  'Mechanical Engineering',
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance', 'Temporary'];
const LOCATIONS = ['Remote', 'Hybrid', 'On-site', 'Relocation OK'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead', 'Manager'];

export default function JobPreferences({ preferences, setPreferences }: JobPreferencesProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [showAllDepts, setShowAllDepts] = useState(false);

  const toggleDepartment = (dept: string) => {
    const departments = preferences.departments.includes(dept)
      ? preferences.departments.filter(d => d !== dept)
      : [...preferences.departments, dept];
    setPreferences({ ...preferences, departments });
  };

  const toggleJobType = (type: string) => {
    const jobTypes = preferences.jobTypes.includes(type)
      ? preferences.jobTypes.filter(t => t !== type)
      : [...preferences.jobTypes, type];
    setPreferences({ ...preferences, jobTypes });
  };

  const toggleLocation = (loc: string) => {
    const locations = preferences.locations.includes(loc)
      ? preferences.locations.filter(l => l !== loc)
      : [...preferences.locations, loc];
    setPreferences({ ...preferences, locations });
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !preferences.keywords.includes(newKeyword.trim())) {
      setPreferences({ ...preferences, keywords: [...preferences.keywords, newKeyword.trim()] });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setPreferences({ ...preferences, keywords: preferences.keywords.filter(k => k !== keyword) });
  };

  const displayedDepts = showAllDepts ? AVAILABLE_DEPARTMENTS : AVAILABLE_DEPARTMENTS.slice(0, 8);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Target Departments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Target Departments</h3>
            <p className="text-sm text-gray-500">Select departments you want to apply for (default: CS, IT, SE)</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {displayedDepts.map((dept) => (
            <button
              key={dept}
              onClick={() => toggleDepartment(dept)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${preferences.departments.includes(dept)
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {preferences.departments.includes(dept) && <span className="mr-1">✓</span>}
              {dept}
            </button>
          ))}
          {!showAllDepts && AVAILABLE_DEPARTMENTS.length > 8 && (
            <button
              onClick={() => setShowAllDepts(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              + Show All ({AVAILABLE_DEPARTMENTS.length - 8} more)
            </button>
          )}
        </div>

        {preferences.departments.length === 0 && (
          <p className="text-sm text-amber-600 mt-3 flex items-center gap-1">
            <Info className="w-4 h-4" /> Select at least one department
          </p>
        )}
      </div>

      {/* Job Types */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Job Types</h3>
            <p className="text-sm text-gray-500">What type of positions are you looking for?</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleJobType(type)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${preferences.jobTypes.includes(type)
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {preferences.jobTypes.includes(type) && <span className="mr-1">✓</span>}
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Work Location */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Work Location Preference</h3>
            <p className="text-sm text-gray-500">Where do you want to work?</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => toggleLocation(loc)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${preferences.locations.includes(loc)
                  ? 'bg-green-600 text-white shadow-md shadow-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {preferences.locations.includes(loc) && <span className="mr-1">✓</span>}
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level & Salary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Experience Level</h3>
              <p className="text-sm text-gray-500">Your target level</p>
            </div>
          </div>

          <div className="space-y-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setPreferences({ ...preferences, experienceLevel: level })}
                className={`
                  w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${preferences.experienceLevel === level
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {preferences.experienceLevel === level && <span className="mr-1">✓</span>}
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Minimum Salary</h3>
              <p className="text-sm text-gray-500">Set your minimum expected salary</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={preferences.salaryMin}
                onChange={(e) => setPreferences({ ...preferences, salaryMin: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">$0</span>
                <span className="text-lg font-bold text-indigo-600">
                  ${preferences.salaryMin.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">$200k+</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Only jobs meeting this salary threshold will be auto-applied
            </p>
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Job Keywords</h3>
            <p className="text-sm text-gray-500">Add keywords to filter matching jobs</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
            placeholder="Add a keyword (e.g., React, Python, AWS)"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={addKeyword}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {preferences.keywords.map((keyword) => (
            <span
              key={keyword}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-sm font-medium"
            >
              {keyword}
              <button onClick={() => removeKeyword(keyword)} className="hover:text-pink-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {preferences.keywords.length === 0 && (
            <p className="text-sm text-gray-400">No keywords added yet</p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="w-6 h-6 text-indigo-600" />
          <h3 className="font-semibold text-indigo-800">Preference Summary</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Departments:</span>{' '}
            <span className="font-medium text-gray-800">{preferences.departments.length} selected</span>
          </div>
          <div>
            <span className="text-gray-500">Job Types:</span>{' '}
            <span className="font-medium text-gray-800">{preferences.jobTypes.join(', ') || 'None'}</span>
          </div>
          <div>
            <span className="text-gray-500">Location:</span>{' '}
            <span className="font-medium text-gray-800">{preferences.locations.join(', ') || 'None'}</span>
          </div>
          <div>
            <span className="text-gray-500">Experience:</span>{' '}
            <span className="font-medium text-gray-800">{preferences.experienceLevel}</span>
          </div>
          <div>
            <span className="text-gray-500">Min Salary:</span>{' '}
            <span className="font-medium text-gray-800">${preferences.salaryMin.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Keywords:</span>{' '}
            <span className="font-medium text-gray-800">{preferences.keywords.length} tags</span>
          </div>
        </div>
      </div>
    </div>
  );
}
