// Map skill display name -> simple-icons icon. Where no icon exists (concept-
// level skills, proprietary tools), the consumer renders a text-only chip.
//
// Single source of truth is `portfolio-config.json -> skills`. This file only
// maps names that exist in that file. New skills added to the config without a
// matching entry here gracefully render as plain text.

import {
  siC,
  siClaude,
  siCmake,
  siCplusplus,
  siDocker,
  siGit,
  siGithubactions,
  siGithubcopilot,
  siGnu,
  siHtml5,
  siHugo,
  siJavascript,
  siJenkins,
  siLinux,
  siLlvm,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siObsidian,
  siOpenjdk,
  siPython,
  siQt,
  siReact,
  siTailwindcss,
  siTypescript,
  siUbuntu,
  siVercel,
  siXml,
} from "simple-icons";

interface SimpleIcon {
  title: string;
  slug: string;
  hex: string;
  path: string;
}

const ICON_MAP: Record<string, SimpleIcon> = {
  // Languages
  "C++14": siCplusplus,
  C: siC,
  Python: siPython,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  Java: siOpenjdk,
  SQL: siMysql,

  // AI & Agentic
  "Claude Code": siClaude,
  "GitHub Copilot": siGithubcopilot,
  "Vercel AI SDK": siVercel,
  "Obsidian/PKM": siObsidian,

  // Embedded & Platform
  Qt5: siQt,
  XML: siXml,
  CMake: siCmake,
  "Embedded Linux": siLinux,

  // Web & Cloud
  HTML: siHtml5,
  React: siReact,
  "Next.js": siNextdotjs,
  "Tailwind CSS": siTailwindcss,
  "Node.js": siNodedotjs,
  Hugo: siHugo,

  // Debugging & Testing
  GDB: siGnu,
  "clang-static-analyzer": siLlvm,

  // DevOps & Tools
  Git: siGit,
  "GitHub Actions": siGithubactions,
  Jenkins: siJenkins,
  Docker: siDocker,
  "Ubuntu Linux": siUbuntu,
};

export function getSkillIcon(name: string): SimpleIcon | null {
  return ICON_MAP[name] ?? null;
}
