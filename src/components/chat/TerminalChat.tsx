'use client';

import { useEffect, useRef, useState } from 'react';
import { useChatContext } from './chat-context';
import { ToolRenderer } from './tool-renderer';
import { BlockArt } from './BlockArt';

const PRESETS = [
  'Show me your projects',
  'What is this position-addressed thingy?',
  'Walk me through your AI workflow',
  'Can I see your resume?',
];

/**
 * Terminal-styled chat surface. Shares state with the rest of the site via
 * useChatContext() so the same messages, sendMessage, and AI SDK stream
 * power both this and any other chat UI mounted in the tree.
 *
 * All colors come from --term-* CSS vars defined in globals.css so the
 * surface flips with the site's [data-theme] attribute.
 */
export function TerminalChat() {
  const { messages, sendMessage, status, close } = useChatContext();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isBusy = status === 'streaming' || status === 'submitted';
  const isEmpty = messages.length === 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isBusy]);

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  }

  function handlePreset(q: string) {
    if (isBusy) return;
    submit(q);
    inputRef.current?.focus();
  }

  return (
    <div
      className="relative h-full rounded-3xl overflow-hidden border flex flex-col"
      style={{
        background: 'var(--term-bg)',
        borderColor: 'var(--term-hairline)',
        boxShadow: '0 24px 60px -20px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Titlebar with traffic lights. Red closes; yellow/green are decorative. */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-b shrink-0"
        style={{
          background: 'var(--term-titlebar-bg)',
          borderColor: 'var(--term-hairline)',
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close chat"
          className="w-3 h-3 rounded-full p-0 border-0 cursor-pointer"
          style={{ background: '#ff5f57' }}
        />
        <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} aria-hidden />
        <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} aria-hidden />
        <span
          className="mx-auto text-xs font-mono"
          style={{ color: 'var(--term-titlebar-fg)' }}
        >
          kevin@ktncodes ~ -- chat
        </span>
      </div>

      {/* Scrolling body: either the empty-state boot screen or the message log */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-5 py-4 font-mono text-[13px]"
        style={{ color: 'var(--term-fg)' }}
      >
        {isEmpty ? (
          <BootScreen onPreset={handlePreset} isBusy={isBusy} />
        ) : (
          messages.map((m) => <TerminalMessage key={m.id} message={m} />)
        )}
        {isBusy && <TypingLine />}
      </div>

      {/* Prompt row */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 px-5 py-3 border-t shrink-0"
        style={{ borderColor: 'var(--term-hairline)' }}
      >
        <span
          className="font-mono text-[15px] leading-none"
          style={{ color: 'var(--term-accent)' }}
        >
          {'>'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about Kevin..."
          disabled={isBusy}
          className="flex-1 bg-transparent outline-none font-mono text-[13px] disabled:opacity-60"
          style={{
            color: 'var(--term-fg-strong)',
            caretColor: 'var(--term-accent)',
          }}
        />
        <span
          className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono"
          style={{ color: 'var(--term-muted)' }}
        >
          <kbd
            className="px-1.5 py-0.5 rounded border"
            style={{
              borderColor: 'var(--term-kbd-border)',
              background: 'var(--term-kbd-bg)',
            }}
          >
            enter
          </kbd>
          to send
        </span>
      </form>
    </div>
  );
}

function BootScreen({
  onPreset,
  isBusy,
}: {
  onPreset: (q: string) => void;
  isBusy: boolean;
}) {
  return (
    <div>
      <div className="space-y-0.5" style={{ color: 'var(--term-muted)' }}>
        <div>Initializing terminal...</div>
        <div>Loading profile data...</div>
        <div>Connecting to ktncodes.com...</div>
      </div>

      <div className="my-5">
        <BlockArt text="HELLO," />
        <BlockArt text="IM KEVIN." />
      </div>

      <div
        className="rounded-md px-4 py-3 my-4"
        style={{
          border: '1px solid var(--term-welcome-border)',
          background: 'var(--term-welcome-bg)',
        }}
      >
        <div style={{ color: 'var(--term-fg-strong)' }}>
          Welcome to{' '}
          <strong style={{ color: 'var(--term-welcome-strong)' }}>ktncodes</strong>{' '}
          <code style={{ color: 'var(--term-accent)' }}>v1.0.0</code>
        </div>
        <ol className="ml-5 mt-1 list-decimal" style={{ color: 'var(--term-fg)' }}>
          <li>
            Type <code style={{ color: 'var(--term-accent)' }}>/help</code> for list of
            commands
          </li>
          <li>Ask me anything about Kevin&apos;s work, projects, or AI workflow</li>
        </ol>
      </div>

      <ul
        className="list-none p-0 my-4 border-y"
        style={{ borderColor: 'var(--term-hairline)' }}
      >
        {PRESETS.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onPreset(p)}
              disabled={isBusy}
              className="term-preset-button"
            >
              <span style={{ color: 'var(--term-accent)' }}>{'> '}</span>
              {p}
            </button>
          </li>
        ))}
      </ul>

      <div className="text-[11px]" style={{ color: 'var(--term-muted)' }}>
        ? for shortcuts
      </div>
    </div>
  );
}

function TerminalMessage({
  message,
}: {
  message: ReturnType<typeof useChatContext>['messages'][number];
}) {
  const isUser = message.role === 'user';

  if (isUser) {
    const text = message.parts
      .filter((p) => p.type === 'text')
      .map((p) => (p as { text: string }).text)
      .join('');
    return (
      <div className="py-1 break-words">
        <span className="font-mono" style={{ color: 'var(--term-accent)' }}>
          {'> '}
        </span>
        <span style={{ color: 'var(--term-fg-strong)' }}>{text}</span>
      </div>
    );
  }

  return (
    <div className="py-1 space-y-2">
      {message.parts.map((part, i) => {
        if (part.type === 'text') {
          const text = (part as { text: string }).text;
          if (!text.trim()) return null;
          return (
            <div
              key={i}
              className="whitespace-pre-wrap leading-relaxed"
              style={{ color: 'var(--term-fg)' }}
            >
              {text}
            </div>
          );
        }
        if (part.type.startsWith('tool-')) {
          return (
            <div key={i} className="my-2">
              <ToolRenderer part={part as never} />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

function TypingLine() {
  return (
    <div
      className="py-1 inline-flex items-center gap-2 text-[12.5px]"
      style={{ color: 'var(--term-muted)' }}
    >
      <span style={{ color: 'var(--term-accent)' }}>kevin@ktncodes</span>
      <span>is thinking</span>
      <span className="inline-flex gap-1">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </span>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="w-1 h-1 rounded-full inline-block"
      style={{
        background: 'var(--term-accent)',
        opacity: 0.8,
        animation: 'chat-dot 1.2s ease-in-out infinite',
        animationDelay: `${delay}ms`,
      }}
    />
  );
}
