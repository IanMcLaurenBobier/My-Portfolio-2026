export type AccentTheme = 'red' | 'blue' | 'purple' | 'green' | 'orange';

export interface ThemeOption {
  id: AccentTheme;
  label: string;
  swatchHex: string;
  threeColor: number;
}

export type FamiliarityTier = 'Used in Projects' | 'Hands-on Experience' | 'Familiar With' | 'Technical Interest';

export interface TechBadgeItem {
  id: string;
  name: string;
  category: TechCategory;
  tier: FamiliarityTier;
  summary: string;
}

export type TechCategory =
  | 'Programming Languages'
  | 'Frontend Development'
  | 'Backend Development'
  | 'Database Management'
  | 'UI/UX Design'
  | 'IT Support & Infrastructure'
  | 'Networking'
  | 'AI & Automation';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Featured' | 'Additional';
  domain: string;
  summary: string;
  architectureNotes: string;
  features: string[];
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  repoPlaceholder?: string;
  year: string;
}

export interface ExperiencePillar {
  title: string;
  items: string[];
}

export interface NetworkNode {
  id: string;
  label: string;
  role: string;
  ip: string;
  vlan: string;
  x: number;
  y: number;
  notes: string;
  status: 'Active' | 'Simulated';
}

export interface NetworkLink {
  id: string;
  from: string;
  to: string;
  bandwidth: string;
  protocol: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
