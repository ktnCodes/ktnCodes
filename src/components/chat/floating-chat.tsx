"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useChatContext } from "./chat-context";
import { Chat } from "./chat";

export function FloatingChat() {
  const { isOpen, openWith, close } = useChatContext();

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isOpen) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.22 }}
            onClick={() => openWith()}
            aria-label="Open chat with Kevin's assistant"
            className="fixed z-[60] group bottom-6 right-6"
            style={{
              bottom: "max(1.5rem, env(safe-area-inset-bottom))",
              right: "max(1.5rem, env(safe-area-inset-right))",
            }}
          >
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full bg-accent/30 blur-md animate-glow-pulse pointer-events-none"
            />
            <span className="relative block w-14 h-14 rounded-full overflow-hidden border border-[var(--hairline)] bg-[var(--surface)] shadow-lg group-hover:border-accent transition-colors">
              <Image
                src="/avatarwithWinnie.jpg"
                alt=""
                fill
                sizes="56px"
                className="object-cover object-top"
              />
            </span>
            <span
              aria-hidden
              className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ transformOrigin: "bottom right" }}
            role="dialog"
            aria-label="Chat with Kevin's assistant"
            aria-modal="true"
            className="
              fixed z-[60] flex flex-col
              border border-[var(--hairline)] bg-[var(--surface)] shadow-2xl
              md:bottom-6 md:right-6 md:w-[380px] md:h-[560px] md:max-h-[calc(100dvh-4rem)]
              max-md:inset-0 max-md:h-dvh max-md:w-full
            "
          >
            <div className="flex items-center gap-3 border-b border-[var(--hairline)] bg-background px-4 py-3 flex-shrink-0">
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-accent/40">
                <Image
                  src="/avatarwithWinnie.jpg"
                  alt="Kevin"
                  fill
                  sizes="36px"
                  className="object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="small-caps text-xs text-foreground tracking-widest leading-none">
                  KEVIN — ASSISTANT
                </div>
                <div className="mt-1 small-caps text-[10px] text-muted tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  ONLINE — POWERED BY MY NOTES
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close chat"
                className="p-1.5 text-muted hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <Chat />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
