"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ToolDisclosure({ label, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-xs text-muted hover:text-foreground hover:border-accent/40 active:scale-95 transition-all"
      >
        {label}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* grid-rows 0fr→1fr animates height without JS measurement */}
      <div
        className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
