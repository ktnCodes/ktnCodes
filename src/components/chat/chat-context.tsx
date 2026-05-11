"use client";

import { useChat } from "@ai-sdk/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const HASH = "#chat";

export type ChatLayout = "default" | "chat-active";

type ChatHook = ReturnType<typeof useChat>;

type ChatContextValue = {
  messages: ChatHook["messages"];
  sendMessage: ChatHook["sendMessage"];
  status: ChatHook["status"];
  stop: ChatHook["stop"];
  error: ChatHook["error"];
  isOpen: boolean;
  openWith: (question?: string) => void;
  close: () => void;
  layout: ChatLayout;
  setLayout: (l: ChatLayout) => void;
  /**
   * Auto-prompt the chat with `Tell me about <leafSlug>`. Used by the Finder
   * when a leaf is clicked while chat-active. No-op when chat is closed.
   */
  autoPromptLeaf: (leafSlug: string, leafName?: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { messages, sendMessage, status, stop, error } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState<ChatLayout>("default");
  const lastSentRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function sync() {
      const next = window.location.hash === HASH;
      setIsOpen(next);
      if (next) setLayout("chat-active");
    }
    window.addEventListener("hashchange", sync);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const openWith = useCallback(
    (question?: string) => {
      if (typeof window !== "undefined" && window.location.hash !== HASH) {
        history.pushState(null, "", HASH);
      }
      setIsOpen(true);
      setLayout("chat-active");
      if (!question) return;
      const isBusy = status === "streaming" || status === "submitted";
      if (isBusy) return;
      if (lastSentRef.current === question) return;
      lastSentRef.current = question;
      sendMessage({ text: question });
    },
    [sendMessage, status]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setLayout("default");
    if (typeof window === "undefined") return;
    if (window.location.hash === HASH) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const autoPromptLeaf = useCallback(
    (leafSlug: string, leafName?: string) => {
      // Only auto-prompt when chat is already active. Otherwise the click is
      // a normal Finder navigation (handled elsewhere).
      if (layout !== "chat-active") return;
      const text = `Tell me about ${leafName ?? leafSlug}.`;
      const isBusy = status === "streaming" || status === "submitted";
      if (isBusy) return;
      lastSentRef.current = text;
      sendMessage({ text });
    },
    [layout, sendMessage, status]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        status,
        stop,
        error,
        isOpen,
        openWith,
        close,
        layout,
        setLayout,
        autoPromptLeaf,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used inside <ChatProvider>");
  }
  return ctx;
}
