const categoryLabels: Record<string, string> = {
  languages: 'Languages',
  ai_agentic: 'AI & Agentic Engineering',
  embedded_systems: 'Embedded & Platform',
  web_cloud: 'Web & Cloud',
  debugging_testing: 'Debugging & Testing',
  devops_tools: 'DevOps & Tools',
};

export function formatSkillCategory(key: string): string {
  return categoryLabels[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
