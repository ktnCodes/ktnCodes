import type { Experience, Education } from "@/types/portfolio";

interface Props {
  experience: Experience[];
  education: Education;
  resumeUrl: string;
}

export function Resume({ experience, education, resumeUrl }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Experience</h3>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 rounded-md bg-accent text-background font-medium hover:bg-accent-hover transition-colors"
        >
          Download Resume
        </a>
      </div>

      <div className="space-y-4">
        {experience.map((exp, i) => (
          <div key={i} className="pl-4 border-l-2 border-border">
            <h4 className="font-medium text-sm">{exp.position}</h4>
            <p className="text-accent text-xs">
              {exp.company} &middot; {exp.location}
            </p>
            <p className="text-muted text-xs mb-1">{exp.duration}</p>
            <p className="text-xs text-foreground/70 leading-relaxed">
              {exp.description}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted">
          {education.degree} &middot; {education.institution} &middot;{" "}
          {education.graduationDate}
        </p>
      </div>
    </div>
  );
}
