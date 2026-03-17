export interface WriteupRecord {
  id: string;
  title?: string;
  competition?: string;
  category?: string;
  difficulty?: string;
  date?: string;
  summary?: string;
  content?: string;
  flag?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRecord {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  projectUrl?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AchievementRecord {
  id: string;
  title?: string;
  issuer?: string;
  platform?: string;
  description?: string;
  imageUrl?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SecureMessageRecord {
  id: string;
  title?: string;
  content?: string;
  createdAt?: string;
  username?: string;
}

export interface AccessLogRecord {
  id: string;
  username?: string;
  accessedAt?: string;
  accessSuccessful?: boolean;
  ip?: string;
}

export interface LatestActivityRecord {
  type: 'WRITE-UP' | 'PROJECT' | 'ACHIEVEMENT';
  title: string;
  date: string;
}

export interface HomeSummaryResponse {
  writeupCount: number;
  projectCount: number;
  achievementCount: number;
  latestActivity: LatestActivityRecord | null;
}