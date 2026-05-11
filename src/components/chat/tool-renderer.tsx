import { Presentation } from "@/components/tools/presentation";
import { Projects } from "@/components/tools/projects";
import { Skills } from "@/components/tools/skills";
import { Resume } from "@/components/tools/resume";
import { Contact } from "@/components/tools/contact";
import { BlogPosts } from "@/components/tools/blog-posts";
import { ToolDisclosure } from "./tool-disclosure";

interface ToolPart {
  type: string;
  state: string;
  output?: Record<string, unknown>;
}

function getLabel(toolName: string, data: Record<string, unknown>): string {
  switch (toolName) {
    case "getPresentation":
      return "About Kevin";
    case "getProjects":
      return `Projects (${(data.projects as unknown[]).length})`;
    case "getBlogPosts": {
      const posts = data.posts as unknown[];
      const q = data.query as string;
      return q === "recent"
        ? `Recent posts (${posts.length})`
        : `Posts related to "${q}" (${posts.length})`;
    }
    case "getResume":
      return "Resume";
    case "getSkills":
      return "Skills";
    case "getContact":
      return "Contact info";
    default:
      return "Details";
  }
}

export function ToolRenderer({ part }: { part: ToolPart }) {
  if (part.state !== "output-available" || !part.output) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted py-2">
        <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        Loading...
      </div>
    );
  }

  const data = part.output;
  const toolName = part.type.replace(/^tool-/, "");
  const label = getLabel(toolName, data);

  let content: React.ReactNode = null;

  switch (toolName) {
    case "getPresentation":
      content = (
        <Presentation
          personal={data.personal as never}
          education={data.education as never}
        />
      );
      break;
    case "getProjects":
      content = <Projects projects={data.projects as never} />;
      break;
    case "getSkills":
      content = <Skills skills={data.skills as never} />;
      break;
    case "getResume":
      content = (
        <Resume
          experience={data.experience as never}
          education={data.education as never}
          resumeUrl={data.resumeUrl as string}
        />
      );
      break;
    case "getContact":
      content = (
        <Contact email={data.email as string} social={data.social as never} />
      );
      break;
    case "getBlogPosts":
      content = (
        <BlogPosts
          posts={data.posts as never}
          query={data.query as string}
        />
      );
      break;
    default:
      return null;
  }

  return <ToolDisclosure label={label}>{content}</ToolDisclosure>;
}
