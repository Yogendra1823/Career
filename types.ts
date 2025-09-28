import { ReactNode } from 'react';

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  COUNSELOR = 'counselor',
}

export enum AcademicLevel {
  HIGH_SCHOOL = 'High School',
  UNDERGRADUATE = 'Undergraduate',
  POSTGRADUATE = 'Postgraduate',
}

export enum ApplicationStatus {
  PLANNING = 'Planning to Apply',
  APPLIED = 'Applied',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  WAITLISTED = 'Waitlisted',
}

export type LearningStyle = 'Visual' | 'Auditory' | 'Reading/Writing' | 'Kinesthetic';
export const LearningStyles: LearningStyle[] = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];


export interface Progress {
  quizCompleted: boolean;
  collegesSearched: number;
  recommendationsViewed: number;
}

export interface NotificationSettings {
  emailOnNewRecommendation: boolean;
  emailOnApplicationDeadline: boolean;
}

export interface CollegeApplication {
  id: string;
  collegeName: string;
  status: ApplicationStatus;
  deadline?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  avatar?: string;
  interests?: string[];
  academicLevel?: AcademicLevel;
  quizHistory?: QuizResult[];
  academicGoals?: string;
  learningStyle?: LearningStyle;
  notificationSettings?: NotificationSettings;
  progress?: Progress;
  applications?: CollegeApplication[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CareerRecommendation {
  recommendedStream: string;
  reasoning: string;
  suggestedSubjects: string[];
  potentialCareers: string[];
  confidenceScore: number;
  feedback?: string; 
}

export interface QuizResult {
  date: string;
  answers: { question: string; answer: string }[];
  recommendation: CareerRecommendation;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}