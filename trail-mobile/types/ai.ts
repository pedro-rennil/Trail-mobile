export interface GenerateTrailRequest {
  targetRole: 'Student' | 'Mentor';
  technicalDepth: 'beginner' | 'intermediate' | 'advanced';
  weeklyHours: '<5' | '5-10' | '10-20' | '20+';
  learningStyle: 'hands-on' | 'visual' | 'theoretical' | 'mixed';
  projectGoal: string;
}

export interface GenerateTrailResult {
  trailId: string;
  title: string;
}

export interface GeneratedChallengeDto {
  title: string;
  description: string;
  searchTerms: string[];
}

export interface GeneratedTrailDto {
  title: string;
  description: string;
  estimatedHours: number;
  challenges: GeneratedChallengeDto[];
}