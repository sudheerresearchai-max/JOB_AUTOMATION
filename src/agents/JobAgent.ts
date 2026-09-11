import axios from 'axios';
import { parse } from 'node-html-parser';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  department: string;
  salary: string;
  postedDate: string;
  applyUrl: string;
  description: string;
}

export interface SearchResults {
  jobs: JobListing[];
  totalFound: number;
  searchQuery: string;
  timestamp: string;
}

// Mock job search APIs (in production, these would connect to real job boards)
const JOB_BOARDS = [
  { name: 'TechJobs API', baseUrl: 'https://api.techjobs.example.com' },
  { name: 'DevHire API', baseUrl: 'https://api.devhire.example.com' },
  { name: 'CareerStack API', baseUrl: 'https://api.careerstack.example.com' },
];

/**
 * Searches for jobs across multiple job boards
 * Simulates internet checking and job searching
 */
export async function searchJobs(
  keywords: string[],
  locations: string[],
  departments: string[],
  minSalary: number
): Promise<SearchResults> {
  const allJobs: JobListing[] = [];
  
  // Simulate checking internet connectivity
  try {
    await checkInternetConnection();
  } catch (error) {
    console.error('No internet connection:', error);
    throw new Error('No internet connection available');
  }

  // Simulate searching multiple job boards
  for (const board of JOB_BOARDS) {
    try {
      const jobs = await searchJobBoard(board, keywords, locations, departments, minSalary);
      allJobs.push(...jobs);
    } catch (error) {
      console.warn(`Failed to search ${board.name}:`, error);
      // Continue with other job boards
    }
  }

  // Generate realistic mock jobs based on search criteria
  const mockJobs = generateMockJobs(keywords, locations, departments, minSalary, 15);
  allJobs.push(...mockJobs);

  return {
    jobs: allJobs,
    totalFound: allJobs.length,
    searchQuery: `${keywords.join(', ')} in ${locations.join(', ')}`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Checks internet connectivity
 */
export async function checkInternetConnection(): Promise<boolean> {
  try {
    // Try to reach a reliable endpoint
    await axios.get('https://httpbin.org/status/200', { timeout: 5000 });
    return true;
  } catch (error) {
    // Fallback: try another endpoint
    try {
      await axios.get('https://www.google.com', { timeout: 5000, maxRedirects: 0 });
      return true;
    } catch {
      throw new Error('Unable to connect to the internet');
    }
  }
}

/**
 * Searches a specific job board
 */
async function searchJobBoard(
  board: { name: string; baseUrl: string },
  keywords: string[],
  locations: string[],
  departments: string[],
  minSalary: number
): Promise<JobListing[]> {
  // In production, this would make actual API calls
  // For now, we simulate the response
  console.log(`Searching ${board.name} for jobs...`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
  
  return []; // Real implementation would return actual results
}

/**
 * Generates mock job listings for demonstration
 */
function generateMockJobs(
  keywords: string[],
  locations: string[],
  departments: string[],
  minSalary: number,
  count: number
): JobListing[] {
  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'Nvidia',
    'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Intel', 'Cisco', 'Dell', 'HP',
    'Stripe', 'Shopify', 'Spotify', 'Uber', 'Airbnb', 'Twitter', 'LinkedIn', 'Slack',
    'GitHub', 'GitLab', 'Atlassian', 'Twilio', 'Datadog', 'Snowflake', 'Palantir', 'CrowdStrike',
    'StartupXYZ', 'TechCorp', 'InnovateCo', 'DigitalFirst', 'CloudNative Inc', 'AI Solutions'
  ];

  const titles = [
    'Junior Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Software Developer I', 'Entry Level Engineer', 'Associate Software Engineer',
    'Data Analyst', 'DevOps Engineer', 'Cloud Engineer', 'QA Engineer',
    'Systems Administrator', 'Network Engineer', 'Security Analyst', 'Database Administrator',
    'Mobile Developer', 'UI/UX Developer', 'Machine Learning Engineer', 'AI Research Intern',
    'IT Support Specialist', 'Technical Writer', 'Product Analyst', 'Solutions Engineer',
    'Graduate Software Engineer', 'New Grad Developer', 'Rotational Engineering Program'
  ];

  const jobTypes = ['Full-time', 'Internship', 'Part-time', 'Contract'];
  
  const remoteOptions = ['Remote', 'Hybrid', 'On-site'];

  const jobs: JobListing[] = [];

  for (let i = 0; i < count; i++) {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)] || 'Software';
    const location = locations[Math.floor(Math.random() * locations.length)] || 'Remote';
    const department = departments[Math.floor(Math.random() * departments.length)] || 'Engineering';
    
    let baseLocation = location;
    if (location === 'Remote' || location === 'Hybrid') {
      const cities = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL', 'Denver, CO', 'Miami, FL'];
      baseLocation = `${location} - ${cities[Math.floor(Math.random() * cities.length)]}`;
    }

    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const salaryMin = minSalary + Math.floor(Math.random() * 30000);
    const salaryMax = salaryMin + 20000 + Math.floor(Math.random() * 30000);
    const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];

    jobs.push({
      id: `job_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${title} - ${jobType}`,
      company,
      location: baseLocation,
      department,
      salary: `$${(salaryMin / 1000).toFixed(0)}k - $${(salaryMax / 1000).toFixed(0)}k`,
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      applyUrl: `https://${company.toLowerCase().replace(/\s/g, '')}.com/careers/${title.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      description: `We are looking for a talented ${title} to join our team at ${company}. This is a ${jobType} position in our ${department} department. The ideal candidate will have experience with modern technologies and a passion for building great products.`,
    });
  }

  return jobs;
}

/**
 * Submits a job application
 * In production, this would integrate with job board APIs or browser automation
 */
export async function submitApplication(job: JobListing, profile: any): Promise<{ success: boolean; applicationId?: string; error?: string }> {
  try {
    // Check internet before applying
    await checkInternetConnection();

    console.log(`Submitting application to ${job.company} for ${job.title}...`);
    
    // Simulate application submission delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // In production, this would:
    // 1. Fill out application forms automatically
    // 2. Upload resume
    // 3. Submit the application
    // 4. Parse confirmation
    
    // Simulate successful application
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      applicationId,
    };
  } catch (error) {
    console.error(`Failed to apply to ${job.company}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Agent that continuously searches and applies to jobs
 */
export class JobApplicationAgent {
  private isActive: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private onLog?: (message: string) => void;
  private onJobFound?: (job: JobListing) => void;
  private onApplicationSubmitted?: (job: JobListing, applicationId: string) => void;
  private onError?: (error: Error) => void;

  constructor(
    private preferences: {
      keywords: string[];
      locations: string[];
      departments: string[];
      minSalary: number;
      maxApplicationsPerDay: number;
    },
    private profile: any
  ) {}

  setLogCallback(callback: (message: string) => void) {
    this.onLog = callback;
  }

  setJobFoundCallback(callback: (job: JobListing) => void) {
    this.onJobFound = callback;
  }

  setApplicationCallback(callback: (job: JobListing, applicationId: string) => void) {
    this.onApplicationSubmitted = callback;
  }

  setErrorCallback(callback: (error: Error) => void) {
    this.onError = callback;
  }

  log(message: string) {
    if (this.onLog) {
      this.onLog(message);
    }
    console.log(`[Agent] ${message}`);
  }

  /**
   * Start the agent
   */
  start() {
    if (this.isActive) {
      this.log('Agent is already running');
      return;
    }

    this.isActive = true;
    this.log('🚀 Job Application Agent started');
    this.log(`Searching for: ${this.preferences.keywords.join(', ')}`);
    this.log(`Locations: ${this.preferences.locations.join(', ')}`);
    this.log(`Max applications per day: ${this.preferences.maxApplicationsPerDay}`);

    // Run immediately
    this.runCycle();

    // Set up interval for periodic checks (every hour when active)
    this.intervalId = setInterval(() => {
      if (this.isActive) {
        this.runCycle();
      }
    }, 60 * 60 * 1000); // 1 hour
  }

  /**
   * Stop the agent
   */
  stop() {
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.log('⏸️ Job Application Agent stopped');
  }

  /**
   * Run a single cycle of search and apply
   */
  async runCycle() {
    if (!this.isActive) return;

    try {
      this.log('🔍 Starting job search cycle...');
      
      // Check internet connection
      const hasInternet = await checkInternetConnection();
      if (!hasInternet) {
        this.log('❌ No internet connection. Skipping cycle.');
        return;
      }
      this.log('✓ Internet connection verified');

      // Search for jobs
      const results = await searchJobs(
        this.preferences.keywords,
        this.preferences.locations,
        this.preferences.departments,
        this.preferences.minSalary
      );

      this.log(`Found ${results.totalFound} matching jobs`);

      // Notify about found jobs
      if (this.onJobFound) {
        for (const job of results.jobs) {
          this.onJobFound(job);
        }
      }

      // Apply to jobs (up to maxApplicationsPerDay)
      let applicationsToday = 0;
      for (const job of results.jobs) {
        if (applicationsToday >= this.preferences.maxApplicationsPerDay) {
          this.log(`Reached daily application limit (${this.preferences.maxApplicationsPerDay})`);
          break;
        }

        this.log(`Applying to ${job.title} at ${job.company}...`);
        
        const result = await submitApplication(job, this.profile);
        
        if (result.success && result.applicationId) {
          applicationsToday++;
          this.log(`✓ Successfully applied! Application ID: ${result.applicationId}`);
          
          if (this.onApplicationSubmitted) {
            this.onApplicationSubmitted(job, result.applicationId);
          }
        } else {
          this.log(`✗ Failed to apply: ${result.error}`);
        }

        // Small delay between applications to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      this.log(`✅ Cycle complete: ${applicationsToday} applications submitted`);

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.log(`❌ Error in cycle: ${err.message}`);
      if (this.onError) {
        this.onError(err);
      }
    }
  }

  /**
   * Run a single manual cycle
   */
  async runOnce() {
    this.log('⚡ Running manual job search cycle...');
    await this.runCycle();
  }
}

export default JobApplicationAgent;
