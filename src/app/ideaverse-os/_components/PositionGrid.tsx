"use client";

import { motion } from "framer-motion";

type Cell = {
  num: string;
  name: string;
  desc: string;
  isUserDomain?: boolean;
};

const cells: Cell[] = [
  { num: "00", name: "agentic-OS", desc: "soul, me, user, compass, memory, runbook" },
  { num: "10", name: "cortex", desc: "synthesis surface (your wiki articles)" },
  { num: "20", name: "work", desc: "first user domain, named in the interview", isUserDomain: true },
  { num: "30", name: "personal", desc: "second user domain, named in the interview", isUserDomain: true },
  { num: "40", name: "raw", desc: "ingestion: web-clips, papers, youtube" },
  { num: "50", name: "research-library", desc: "spikes, prompts, customization" },
  { num: "60", name: "skills", desc: "ideaverse-capture, cortex-*, web-clip-report" },
  { num: "70", name: "daily", desc: "daily notes" },
  { num: "80", name: "visualization", desc: "attachments, screenshots, diagrams" },
  { num: "99", name: "archive", desc: "retired sources and notes" },
];

export function PositionGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cells.map((cell, i) => {
        const isDomain = cell.isUserDomain;
        return (
          <motion.div
            key={cell.num}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              delay: i * 0.05,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`flex flex-col border p-5 ${
              isDomain
                ? "border-iv-wine/40 border-dashed bg-iv-cream-pale"
                : "border-iv-wine/15 bg-iv-cream-pale"
            }`}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-iv-display text-[1.625rem] font-bold leading-none text-iv-wine">
                {cell.num}
              </span>
              <span className="font-mono text-[14px] text-iv-ink">
                {cell.name}/
              </span>
            </div>
            <p className="mt-3 text-[13.5px] leading-[1.5] text-iv-ink-soft">
              {cell.desc}
            </p>
            {isDomain ? (
              <span className="mt-4 inline-block self-start font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-iv-wine/70">
                shaped by you
              </span>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
