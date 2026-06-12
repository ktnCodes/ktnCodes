'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MetalWrap } from '@/components/fx/MetalWrap';
import { Memoji } from './Memoji';
import { useChatContext } from '@/components/chat/chat-context';
import { TerminalChat } from '@/components/chat/TerminalChat';
import { EditableText } from '@/components/dev/EditableText';
import { CtaRow } from '@/components/ui/cta-row';
import heroData from '../../../content/hero.json';

interface HeroContent {
  eyebrow: string;
  headline: string;
  subline: string;
  chips: string[];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const HERO_PATH = 'content/hero.json';

interface BrandBandProps {
  github: string;
  linkedin: string;
}

/**
 * Hero band: positioning statement left, Memoji chat affordance right.
 * Opening the chat swaps the text column to the terminal in place
 * (grow-from-memoji on desktop, full-screen sheet on mobile).
 */
export function BrandBand({ github, linkedin }: BrandBandProps) {
  const hero = heroData as HeroContent;
  const { layout, openWith } = useChatContext();
  const chatActive = layout === 'chat-active';

  const writeField = (key: keyof HeroContent) => (next: string) =>
    JSON.stringify({ ...hero, [key]: next }, null, 2) + '\n';

  const renderHeroText = (headlineClasses: string) => (
    <div>
      <EditableText
        as="p"
        filePath={HERO_PATH}
        value={hero.eyebrow}
        serialize={writeField('eyebrow')}
        className="anim-rise font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
      />
      <EditableText
        as="h1"
        filePath={HERO_PATH}
        value={hero.headline}
        serialize={writeField('headline')}
        multiline
        className={`anim-rise anim-rise-1 mt-(--space-sm) max-w-3xl font-semibold tracking-tight leading-[1.05] text-foreground ${headlineClasses}`}
      />
      <EditableText
        as="p"
        filePath={HERO_PATH}
        value={hero.subline}
        serialize={writeField('subline')}
        multiline
        className="anim-rise anim-rise-2 mt-(--space-md) max-w-prose text-base leading-relaxed text-muted md:text-lg"
      />
      <div className="anim-rise anim-rise-3 mt-(--space-md) flex flex-wrap gap-2">
        {hero.chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] text-muted"
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="anim-rise anim-rise-4 mt-(--space-lg)">
        <CtaRow github={github} linkedin={linkedin} />
      </div>
    </div>
  );

  return (
    <header className="grid grid-cols-1 md:grid-cols-[1fr_auto] md:gap-(--space-xl) gap-(--space-lg) items-center pt-(--space-md) pb-(--space-xl)">
      {/* Mobile: chat as full-screen sheet */}
      <AnimatePresence>
        {chatActive && (
          <motion.div
            key="mobile-sheet"
            className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-(--space-sm) flex items-stretch"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ transformOrigin: '100% 0%' }}
          >
            <TerminalChat />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: hero text <-> chat panel grow-from-Memoji. Fixed height. */}
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
              key="hero"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="h-full flex flex-col justify-center"
            >
              {renderHeroText('text-4xl md:text-5xl lg:text-6xl')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile hero text (the chat sheet overlays it when open) */}
      <div className="md:hidden">{renderHeroText('text-4xl')}</div>

      {/* Memoji + clickable affordance -- both trigger chat */}
      <button
        type="button"
        onClick={() => openWith()}
        aria-label={chatActive ? 'Chat is open -- click the red light to close' : 'Open chat with Kevin'}
        className="flex flex-col items-center gap-(--space-sm) cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-3xl p-2 justify-self-center md:justify-self-auto"
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
                  Click to chat
                </span>
              </MetalWrap>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </header>
  );
}
