'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MetalWrap } from '@/components/fx/MetalWrap';
import { Memoji } from './Memoji';
import { useChatContext } from '@/components/chat/chat-context';
import { TerminalChat } from '@/components/chat/TerminalChat';
import { EditableText } from '@/components/dev/EditableText';
import heroData from '../../../content/hero.json';

interface HeroContent {
  eyebrow: string;
  thesis: [string, string, string];
  darkThesis: [string, string, string];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HERO_PATH = 'content/hero.json';

export function BrandBand() {
  const hero = heroData as HeroContent;
  const { layout, openWith } = useChatContext();
  const chatActive = layout === 'chat-active';

  const writeLineFor =
    (key: 'thesis' | 'darkThesis', idx: number) => (next: string) => {
      const updated = { ...hero };
      updated[key] = [...updated[key]] as [string, string, string];
      updated[key][idx] = next;
      return JSON.stringify(updated, null, 2) + '\n';
    };

  const writeEyebrow = (next: string) =>
    JSON.stringify({ ...hero, eyebrow: next }, null, 2) + '\n';

  const renderThesis = (sizeClasses: string) => (
    <>
      <h1
        className={`${sizeClasses} hero-thesis-light font-semibold text-foreground leading-[1.05] tracking-tight`}
      >
        <EditableText as="span" filePath={HERO_PATH} value={hero.thesis[0]} serialize={writeLineFor('thesis', 0)} />
        <br />
        <EditableText as="span" filePath={HERO_PATH} value={hero.thesis[1]} serialize={writeLineFor('thesis', 1)} />
        <br />
        <EditableText as="span" filePath={HERO_PATH} value={hero.thesis[2]} serialize={writeLineFor('thesis', 2)} />
      </h1>
      <h1
        className={`${sizeClasses} hero-thesis-dark font-semibold text-foreground leading-[1.05] tracking-tight`}
      >
        <EditableText as="span" filePath={HERO_PATH} value={hero.darkThesis[0]} serialize={writeLineFor('darkThesis', 0)} />
        <br />
        <EditableText as="span" filePath={HERO_PATH} value={hero.darkThesis[1]} serialize={writeLineFor('darkThesis', 1)} />
        <br />
        <EditableText as="span" filePath={HERO_PATH} value={hero.darkThesis[2]} serialize={writeLineFor('darkThesis', 2)} />
      </h1>
    </>
  );

  return (
    <header className="grid grid-cols-1 md:grid-cols-[1fr_auto] md:gap-(--space-xl) gap-(--space-lg) items-center pt-(--space-md) pb-(--space-2xl)">
      {/* Mobile: chat as full-screen sheet */}
      <AnimatePresence>
        {chatActive && (
          <motion.div
            key="mobile-sheet"
            className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-(--space-sm) flex items-stretch"
            initial={{ opacity: 0, scale: 0.85, originX: 1, originY: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ transformOrigin: '100% 0%' }}
          >
            <TerminalChat />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: thesis ↔ chat panel grow-from-Memoji. Fixed height. */}
      <div className="hidden md:block relative h-[600px]">
        <AnimatePresence mode="wait">
          {chatActive ? (
            <motion.div
              key="chat"
              initial={{ scale: 0.05, opacity: 0, borderRadius: 9999 }}
              animate={{ scale: 1, opacity: 1, borderRadius: 24 }}
              exit={{ scale: 0.05, opacity: 0, borderRadius: 9999 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ transformOrigin: '100% 0%' }}
              className="absolute inset-0"
            >
              <TerminalChat />
            </motion.div>
          ) : (
            <motion.div
              key="thesis"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="h-full flex flex-col justify-center"
            >
              <EditableText
                as="p"
                filePath={HERO_PATH}
                value={hero.eyebrow}
                serialize={writeEyebrow}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted mb-(--space-md)"
              />
              {renderThesis('text-4xl md:text-6xl')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile thesis */}
      <div className="md:hidden">
        <EditableText
          as="p"
          filePath={HERO_PATH}
          value={hero.eyebrow}
          serialize={writeEyebrow}
          className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted mb-(--space-md)"
        />
        {renderThesis('text-4xl')}
      </div>

      {/* Memoji + clickable affordance — both trigger chat */}
      <button
        type="button"
        onClick={() => openWith()}
        aria-label={chatActive ? 'Chat is open — click to close' : 'Open chat with Kevin'}
        className="flex flex-col items-center gap-(--space-sm) cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-3xl p-2"
      >
        <motion.div
          animate={{ scale: chatActive ? 0.8 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Memoji size={200} state={chatActive ? 'chat-open' : undefined} />
        </motion.div>
        <AnimatePresence>
          {!chatActive && (
            <motion.span
              key="cta-pill"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              <MetalWrap>
                <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full text-foreground group-hover:opacity-90">
                  💬 Click to chat
                </span>
              </MetalWrap>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </header>
  );
}
