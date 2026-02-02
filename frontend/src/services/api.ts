export interface Project {
  id: number;
  title: string;
  client: string;
  progress: number;
  members: number;
  hoursAllocated: number;
  issues: number;
  startDate: string;
  endDate: string;
  color: string;
  type: string;
  stage: string;
  budget?: number;
  description?: string;
  teamMemberIds?: number[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  hoursAllocated: number;
  avatarColor: string;
  jobTitle?: string;
  email?: string;
  department?: string;
  workload?: number;
  activeProjects?: number;
  activePOCs?: number;
  certifications?: number;
  hasInterns?: boolean;
  projectIds?: number[];
  internIds?: number[];
}

export interface Intern {
  id: number;
  name: string;
  studyTrack: string;
  university: string;
  duration: string;
  skills: string[];
  progress: number;
  certifications: string[];
  nextReview: string;
  mentorId: number;
  projectId: number;
}

export interface Issue {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: string;
  reporter: string;
  reportedDate: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: number;
}

export interface POC {
  id: number;
  title: string;
  overview: string;
  technologies: string[];
  postedDate: string;
  createdBy?: number;
  status?: string;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  credentialId: string;
  memberId: number;
}

export interface Task {
  id: number;
  title: string;
  status: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  memberId: number;
  projectId: number;
}

export interface AnalyticsData {
  totalTeamMembers: number;
  totalHours: number;
  avgProgress: number;
  openIssues: number;
  resolvedIssues: number;
  teamWorkloadData: Array<{ name: string; hours: number }>;
  projectTimelineData: Array<{ month: string; projects: number }>;
}

export interface Database {
  projects: Project[];
  teamMembers: TeamMember[];
  interns: Intern[];
  issues: Issue[];
  pocs: POC[];
  certifications: Certification[];
  tasks: Task[];
  analytics: AnalyticsData;
}

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch data from JSON file - Fix the type issue
let db: Database | null = null;

const fetchDatabase = async (): Promise<Database> => {
  if (db) return db;
  
  try {
    // In development, place the db.json file in the public folder
    const response = await fetch('../data.json');
    if (!response.ok) {
      throw new Error('Failed to fetch database');
    }
    const data = await response.json();
    
    // Ensure data has all required properties
    db = {
      projects: data.projects || [],
      teamMembers: data.teamMembers || [],
      interns: data.interns || [],
      issues: data.issues || [],
      pocs: data.pocs || [],
      certifications: data.certifications || [],
      tasks: data.tasks || [],
      analytics: data.analytics || {
        totalTeamMembers: 0,
        totalHours: 0,
        avgProgress: 0,
        openIssues: 0,
        resolvedIssues: 0,
        teamWorkloadData: [],
        projectTimelineData: []
      }
    };
    
    return db;
  } catch (error) {
    console.error('Error loading database:', error);
    // Return a valid Database object, not null
    return {
      projects: [],
      teamMembers: [],
      interns: [],
      issues: [],
      pocs: [],
      certifications: [],
      tasks: [],
      analytics: {
        totalTeamMembers: 0,
        totalHours: 0,
        avgProgress: 0,
        openIssues: 0,
        resolvedIssues: 0,
        teamWorkloadData: [],
        projectTimelineData: []
      }
    };
  }
};

// API Service
export const api = {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    await delay(300);
    const database = await fetchDatabase();
    return database.projects;
  },

  // Get project by ID
  async getProject(id: number): Promise<Project | null> {
    await delay(200);
    const database = await fetchDatabase();
    const project = database.projects.find(p => p.id === id);
    return project || null;
  },

  // Get team members for a project
  async getTeamMembers(projectId: number): Promise<TeamMember[]> {
    await delay(200);
    const database = await fetchDatabase();
    const project = database.projects.find(p => p.id === projectId);
    if (!project || !project.teamMemberIds) return [];
    
    return database.teamMembers.filter(member => 
      project.teamMemberIds?.includes(member.id)
    );
  },

  // Get all team members
  async getAllTeamMembers(): Promise<TeamMember[]> {
    await delay(300);
    const database = await fetchDatabase();
    return database.teamMembers;
  },

  // Get team member by ID
  async getTeamMember(id: number): Promise<TeamMember | null> {
    await delay(200);
    const database = await fetchDatabase();
    const member = database.teamMembers.find(m => m.id === id);
    return member || null;
  },

  // Get interns for a mentor
  async getInternsByMentor(mentorId: number): Promise<Intern[]> {
    await delay(200);
    const database = await fetchDatabase();
    return database.interns.filter(intern => intern.mentorId === mentorId);
  },

  // Get intern by ID
  async getIntern(id: number): Promise<Intern | null> {
    await delay(200);
    const database = await fetchDatabase();
    const intern = database.interns.find(i => i.id === id);
    return intern || null;
  },

  // Get issues for a project
  async getIssues(projectId: number): Promise<Issue[]> {
    await delay(200);
    const database = await fetchDatabase();
    return database.issues.filter(issue => issue.projectId === projectId);
  },

  // Get all POCs
  async getPOCs(): Promise<POC[]> {
    await delay(300);
    const database = await fetchDatabase();
    return database.pocs;
  },

  // Get POCs by creator
  async getPOCsByCreator(memberId: number): Promise<POC[]> {
    await delay(200);
    const database = await fetchDatabase();
    return database.pocs.filter(poc => poc.createdBy === memberId);
  },

  // Get certifications by member
  async getCertificationsByMember(memberId: number): Promise<Certification[]> {
    await delay(200);
    const database = await fetchDatabase();
    return database.certifications.filter(cert => cert.memberId === memberId);
  },

  // Get tasks by member
  async getTasksByMember(memberId: number): Promise<Task[]> {
    await delay(200);
    const database = await fetchDatabase();
    return database.tasks.filter(task => task.memberId === memberId);
  },

  // Get analytics data
  async getAnalytics(): Promise<AnalyticsData> {
    await delay(300);
    const database = await fetchDatabase();
    return database.analytics;
  },

  // Get projects by team member
  async getProjectsByTeamMember(memberId: number): Promise<Project[]> {
    await delay(200);
    const database = await fetchDatabase();
    return database.projects.filter(project => 
      project.teamMemberIds?.includes(memberId)
    );
  },

  // Get all issues
  async getAllIssues(): Promise<Issue[]> {
    await delay(300);
    const database = await fetchDatabase();
    return database.issues;
  },

  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    await delay(300);
    const database = await fetchDatabase();
    return database.tasks;
  },

  // Get all certifications
  async getAllCertifications(): Promise<Certification[]> {
    await delay(300);
    const database = await fetchDatabase();
    return database.certifications;
  },

  // Get all interns
  async getAllInterns(): Promise<Intern[]> {
    await delay(300);
    const database = await fetchDatabase();
    return database.interns;
  },

  // Get member by project and role
  async getMemberByProjectAndRole(projectId: number, role: string): Promise<TeamMember | null> {
    await delay(200);
    const database = await fetchDatabase();
    const project = database.projects.find(p => p.id === projectId);
    if (!project || !project.teamMemberIds) return null;
    
    const member = database.teamMembers.find(m => 
      project.teamMemberIds?.includes(m.id) && m.role.toLowerCase() === role.toLowerCase()
    );
    return member || null;
  },
  // Update team member
  async updateTeamMember(id: number, data: Partial<TeamMember>): Promise<void> {
    await delay(200);
    const database = await fetchDatabase();
    const index = database.teamMembers.findIndex(m => m.id === id);
    if (index !== -1) {
      database.teamMembers[index] = { ...database.teamMembers[index], ...data };
      // Here you would save to JSON file
      console.log('Updated team member:', database.teamMembers[index]);
    }
  },

  // Update intern
  async updateIntern(id: number, data: Partial<Intern>): Promise<void> {
    await delay(200);
    const database = await fetchDatabase();
    const index = database.interns.findIndex(i => i.id === id);
    if (index !== -1) {
      database.interns[index] = { ...database.interns[index], ...data };
      // Here you would save to JSON file
      console.log('Updated intern:', database.interns[index]);
    }
  },

  // Update project team members
  async updateProjectTeamMembers(projectId: number, teamMemberIds: number[]): Promise<void> {
    await delay(200);
    const database = await fetchDatabase();
    const index = database.projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      database.projects[index].teamMemberIds = teamMemberIds;
      console.log('Updated project team members:', database.projects[index]);
    }
  }
};