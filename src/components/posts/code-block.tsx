"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const el = children as React.ReactElement<{ children?: string }> | undefined;
    const code = el?.props?.children ?? "";
    navigator.clipboard.writeText(typeof code === "string" ? code : "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded bg-border/50 text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <pre {...props}>{children}</pre>
    </div>
  );
}
