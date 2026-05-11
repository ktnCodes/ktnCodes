'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatContext } from './chat-context';

const PRESETS = [
  'Show me your projects',
  "What's the ICM thing?",
  'Walk me through your AI workflow',
];

/**
 * Light/glass chat panel. Fills its parent container vertically (parent
 * sizes the slot — see BrandBand `min-h`). AI responses render as bubble
 * cards (Pawel-style); user messages are solid dark pills.
 */
export function ChatPanel() {
  const { messages, sendMessage, status, close } = useChatContext();
  const [input, setInput] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isBusy = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput('');
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(input);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit(input);
    }
  }

  return (
    <div
      className="relative h-full rounded-3xl overflow-hidden border border-hairline flex flex-col"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        boxShadow:
          '0 1px 0 var(--glass-inset-highlight) inset, 0 16px 48px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-between px-(--space-md) py-2 border-b border-hairline/60 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted font-mono font-bold">
          Chat with Kevin
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="Close chat"
          className="text-muted hover:text-foreground text-[14px] leading-none px-2 py-1"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-(--space-md) py-(--space-md) flex flex-col gap-(--space-sm)">
        {messages.length === 0 ? (
          <AiBubble>
            Hey, I&apos;m Kevin. Ask me anything about my work, my projects, or the ICM thing — or
            click any project in the Finder below and I&apos;ll walk you through it.
          </AiBubble>
        ) : (
          messages.map((m) => <Message key={m.id} message={m} />)
        )}
        {isBusy && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-(--space-md) pt-2 pb-(--space-sm) flex items-center gap-(--space-sm) flex-wrap text-[12px] text-muted shrink-0">
        {PRESETS.map((p, idx) => (
          <span key={p} className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => submit(p)}
              disabled={isBusy}
              className="hover:text-foreground transition-colors disabled:opacity-50"
            >
              {p}
            </button>
            {idx < PRESETS.length - 1 && <span aria-hidden className="text-hairline">·</span>}
          </span>
        ))}
      </div>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="px-(--space-sm) pb-(--space-sm) flex items-center gap-2 shrink-0"
      >
        <div
          className="flex-1 flex items-center gap-2 rounded-full border border-hairline px-(--space-sm) py-2"
          style={{ background: 'var(--glass-bg-input)' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything about Kevin..."
            disabled={isBusy}
            className="flex-1 bg-transparent outline-none text-[14px] text-foreground placeholder:text-muted"
          />
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted">
            <kbd className="px-1.5 py-0.5 border border-hairline rounded bg-surface/80 font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 border border-hairline rounded bg-surface/80 font-mono">↵</kbd>
          </span>
        </div>
        <button
          type="submit"
          disabled={isBusy || !input.trim()}
          aria-label="Send"
          className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-30 hover:opacity-90"
        >
          ↑
        </button>
      </form>
    </div>
  );
}

function Message({
  message,
}: {
  message: ReturnType<typeof useChatContext>['messages'][number];
}) {
  const isUser = message.role === 'user';
  const text = message.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { text: string }).text)
    .join('');

  if (isUser) {
    return (
      <div className="self-end max-w-[75%]">
        <div className="bg-foreground text-background px-(--space-sm) py-2.5 rounded-[22px_22px_6px_22px] text-[14px] leading-snug font-medium">
          {text}
        </div>
      </div>
    );
  }
  return <AiBubble>{text}</AiBubble>;
}

/** AI response styled as a soft glass bubble card (Pawel-inspired). */
function AiBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="self-start max-w-[90%]">
      <div
        className="border border-hairline rounded-[22px_22px_22px_6px] px-(--space-sm) py-3 text-[14px] leading-relaxed text-foreground whitespace-pre-wrap"
        style={{ background: 'var(--glass-bg-strong)' }}
      >
        {children}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="self-start inline-flex items-center gap-2 text-muted text-[13px] px-1">
      <span className="flex gap-1">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </span>
      Kevin is thinking...
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-foreground/50 inline-block"
      style={{
        animation: 'chat-dot 1.2s ease-in-out infinite',
        animationDelay: `${delay}ms`,
      }}
    />
  );
}
