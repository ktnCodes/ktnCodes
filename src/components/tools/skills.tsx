import type { Skills as SkillsType } from "@/types/portfolio";
import { formatSkillCategory } from "@/lib/skills";

interface Props {
  skills: SkillsType;
}

export function Skills({ skills }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      {Object.entries(skills).map(([category, items]) => (
        <div key={category}>
          <h4 className="text-xs font-medium text-muted mb-1.5">
            {formatSkillCategory(category)}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {items.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-xs rounded bg-background border border-border text-foreground/80"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
