"use client";

import { useRef, type KeyboardEvent, type FormEvent } from "react";

interface Props {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  stop: () => void;
}

export function ChatInput({ input, setInput, onSubmit, isLoading, stop }: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as FormEvent);
      }
    }
  }

  function handleInput() {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-end gap-2 border-t border-[var(--hairline)] bg-background px-4 py-3"
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          handleInput();
        }}
        onKeyDown={handleKeyDown}
        placeholder="ASK KEVIN ANYTHING"
        rows={1}
        className="flex-1 resize-none bg-transparent text-foreground small-caps text-xs tracking-widest placeholder:text-muted outline-none px-2 py-2.5 leading-tight"
      />
      {isLoading ? (
        <button
          type="button"
          onClick={stop}
          className="shrink-0 small-caps text-xs tracking-widest border border-[var(--hairline)] text-muted hover:text-foreground hover:border-accent px-3 py-2.5 transition-colors"
          aria-label="Stop generating"
        >
          STOP
        </button>
      ) : (
        <button
          type="submit"
          disabled={!input.trim()}
          className="shrink-0 small-caps text-xs tracking-widest border border-accent text-accent hover:bg-accent hover:text-background disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2.5 transition-colors"
          aria-label="Send message"
        >
          SEND
        </button>
      )}
    </form>
  );
}
