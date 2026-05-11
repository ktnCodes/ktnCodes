import type { PersonalInfo, Education } from "@/types/portfolio";

interface Props {
  personal: PersonalInfo;
  education: Education;
}

export function Presentation({ personal, education }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
      <div>
        <h3 className="text-lg font-semibold">{personal.name}</h3>
        <p className="text-accent text-sm">{personal.title}</p>
        <p className="text-muted text-xs">{personal.location}</p>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{personal.bio}</p>
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted">
          {education.degree} &middot; {education.institution} &middot;{" "}
          {education.graduationDate}
        </p>
      </div>
    </div>
  );
}
