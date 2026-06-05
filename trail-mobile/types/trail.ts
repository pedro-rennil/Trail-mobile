export interface TrailResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  challengesCount: number;
  level: string | null;
  estimatedHours: number | null;
}

export interface ChallengeResponse {
  id: string;
  trailId: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  isCompleted: boolean;
  lastSubmissionAt: string | null;
  lastSubmissionStatus: string | null;
  youtubeUrl: string | null;
  mentorComment: string | null;
}
