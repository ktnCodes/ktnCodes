"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { ChatLanding } from "./chat-landing";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useChatContext } from "./chat-context";

export function Chat() {
  const { messages, sendMessage, status, stop, error } = useChatContext();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;
  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  }

  function handlePresetSelect(question: string) {
    sendMessage({ text: question });
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!hasMessages ? (
        <ChatLanding onSelect={handlePresetSelect} isLoading={isLoading} />
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-surface border border-border px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

            {error && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-surface border border-border px-4 py-3 space-y-1.5">
                  {error.message === "rate_limit" ? (
                    <>
                      <p className="text-sm font-medium">Rate limit reached</p>
                      <p className="text-xs text-muted">
                        The free tier allows 15 requests/min. Wait about a minute and try again — or use one of the preset buttons which don&apos;t count toward the limit until they call the AI.
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted">Something went wrong. Please try again.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
        />
      </div>
    </div>
  );
}
