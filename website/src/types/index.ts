export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  links?: {
    github?: string;
    demo?: string;
  };
}

export interface Stat {
  label: string;
  value: string;
}

export interface Certification {
  title: string;
  year: string;
}

export interface NavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
} 