"use client";

import { presetQuestions } from "@/lib/config";

interface Props {
  onSelect: (question: string) => void;
  isLoading?: boolean;
}

export function ChatLanding({ onSelect, isLoading = false }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-8 relative">
      <div className="text-center space-y-3 max-w-md">
        <div className="small-caps text-[11px] tracking-[0.2em] text-muted">
          TRY ONE OF THESE
        </div>
        <p className="text-sm text-muted leading-relaxed">
          Short, grounded answers pulled from my notes. Pick a preset or ask your own.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {presetQuestions.map((q) => (
          <button
            key={q.label}
            onClick={() => onSelect(q.label)}
            disabled={isLoading}
            className="small-caps text-xs tracking-widest border border-[var(--hairline)] text-muted hover:text-foreground hover:border-accent px-4 py-3 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
