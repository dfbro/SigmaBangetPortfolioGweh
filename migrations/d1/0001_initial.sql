CREATE TABLE IF NOT EXISTS writeups (
  id TEXT PRIMARY KEY,
  title TEXT,
  competition TEXT,
  category TEXT,
  difficulty TEXT,
  date TEXT,
  summary TEXT,
  content TEXT,
  flag TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  category TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT,
  issuer TEXT,
  platform TEXT,
  description TEXT,
  image_url TEXT,
  date TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS secure_messages (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  username TEXT,
  source TEXT
);

CREATE TABLE IF NOT EXISTS access_logs (
  id TEXT PRIMARY KEY,
  username TEXT,
  accessed_at TEXT NOT NULL,
  access_successful INTEGER NOT NULL,
  ip TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profile_settings (
  id TEXT PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  website_url TEXT,
  github_url TEXT,
  instagram_url TEXT,
  profile_image_url TEXT,
  about_text TEXT,
  philosophy_text TEXT,
  technical_arsenal_json TEXT NOT NULL DEFAULT '[]',
  professional_journey_json TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO profile_settings (
  id,
  display_name,
  email,
  website_url,
  github_url,
  instagram_url,
  profile_image_url,
  about_text,
  philosophy_text,
  technical_arsenal_json,
  professional_journey_json,
  updated_at
)
VALUES (
  'main',
  'My Name',
  'email@domain.tld',
  'https://domain.tld',
  'http://github.com/github',
  'https://www.instagram.com',
  '/profile.jpg',
  'I''m a student passionate about cybersecurity, software, and web development. I enjoy solving complex problems, building projects, and exploring new technologies. Through Capture The Flag (CTF) challenges and coding projects, I continuously sharpen my skills in analysis, problem-solving, and developing practical solutions, while also improving my communication, collaboration, and adaptability.',
  '"Sorry, Wish We Could Go To The Moon Together." -D. M.',
  '[]',
  '[]',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
);

CREATE INDEX IF NOT EXISTS idx_writeups_created_at ON writeups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_created_at ON achievements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_secure_messages_created_at ON secure_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_accessed_at ON access_logs(accessed_at DESC);
