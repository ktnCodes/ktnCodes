export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  bio: string;
  avatar: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduationDate: string;
  highlights: string[];
}

export interface Experience {
  company: string;
  position: string;
  link?: string;
  linkLabel?: string;
  location: string;
  duration: string;
  description: string;
  technologies: string[];
  highlights?: string[];
  impact_tag?: string;
}

export interface Skills {
  [category: string]: string[];
}

export interface Project {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  date: string;
  status: string;
  featured?: boolean;
  links: {
    github?: string;
    live?: string;
  };
}

export interface Social {
  github: string;
  linkedin: string;
}

export interface PresetQuestion {
  label: string;
  tool: string;
}

export interface PortfolioConfig {
  personal: PersonalInfo;
  education: Education;
  experience: Experience[];
  skills: Skills;
  projects: Project[];
  social: Social;
  personality: {
    traits: string[];
    interests: string[];
    workingStyle: string;
  };
  chatbot: {
    name: string;
    personality: string;
    tone: string;
    topics: string[];
  };
  personal_life: {
    cats: { name: string; description: string }[];
    relationship: string;
    hobbies: string[];
    gaming: {
      competitive: string[];
      casual: string[];
    };
    off_limits: string[];
  };
  presetQuestions: PresetQuestion[];
}
