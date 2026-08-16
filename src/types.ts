export type NavTab = 
  | 'dashboard'
  | 'talent-search'
  | 'bookings'
  | 'analytics'
  | 'pipeline'
  | 'training'
  | 'settings';

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  rating: number;
  reviewCount: number;
  completedShifts: number;
  status: 'Available Now' | 'Busy till 4PM' | 'On Shift' | 'Unavailable';
  matchScore: number;
  hourlyRate: number; // in RM
  skills: string[];
  certifications: string[];
  verified: boolean;
  careerLevel: string;
  idCode: string;
  recentEvents?: {
    name: string;
    role: string;
    date: string;
  }[];
  careerProgression?: {
    title: string;
    level: string;
    completedShifts?: number;
    current?: boolean;
  }[];
  recommendedRoles?: string[];
  experienceYears: number;
}

export interface UrgentEvent {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  workersNeeded: number;
  confirmed: number;
  fillRate: number;
  status: 'At Risk' | 'On Track' | 'Critical' | 'Completed';
  category: string;
  budgetRM: number;
}

export interface BookingStep {
  id: number;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface PipelineTalent {
  id: string;
  idCode: string;
  name: string;
  avatar: string;
  careerLevel: string;
  shifts: number;
  rating: number;
  certificationsCount: number;
  skills: string[];
  stage: 'Flagged' | 'Shortlisted' | 'Interview' | 'Offer';
  recommendedRoles: string;
  verified: boolean;
  recentMajorEvents: {
    title: string;
    role: string;
    date: string;
  }[];
}

export interface PayoutTransaction {
  id: string;
  referenceId: string;
  totalAmount: number;
  workerCount: number;
  bankAccount: string;
  authorizedTime: string;
  status: 'Authorized' | 'Processing' | 'Completed';
  eventName: string;
}
