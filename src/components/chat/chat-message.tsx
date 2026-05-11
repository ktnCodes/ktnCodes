import { ToolRenderer } from "./tool-renderer";
import type { UIMessage } from "ai";

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    const text = message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");

    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] border border-accent bg-[var(--surface)] text-foreground px-4 py-3">
          <p className="text-sm whitespace-pre-wrap">{text}</p>
        </div>
      </div>
    );
  }

  const parts = message.parts;

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-3">
        {parts.map((part, i) => {
          if (part.type === "text" && part.text.trim()) {
            // If the previous non-null part was a tool, render as inline caption
            const prevTool = parts
              .slice(0, i)
              .reverse()
              .find((p) => p.type !== "text");
            const isCaption = prevTool?.type.startsWith("tool-");

            if (isCaption) {
              return (
                <p key={i} className="text-sm text-muted/80 leading-relaxed px-1">
                  {part.text}
                </p>
              );
            }

            return (
              <div
                key={i}
                className="border border-[var(--hairline)] bg-[var(--surface)] text-foreground px-4 py-3"
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {part.text}
                </p>
              </div>
            );
          }
          if (part.type.startsWith("tool-")) {
            return (
              <div key={i} className="w-full">
                <ToolRenderer part={part as never} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
