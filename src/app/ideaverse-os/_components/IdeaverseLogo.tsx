import { useId } from "react";

type Props = {
  className?: string;
  ariaLabel?: string;
  /**
   * Pass `"none"` to allow the icon to stretch into a non-square container
   * (vertical-only or horizontal-only stretch). Defaults to `"xMidYMid meet"`
   * which preserves the icon's intrinsic 1:1 aspect ratio.
   */
  preserveAspectRatio?: string;
};

/**
 * The ideaverse-OS brand mark: a folder branching into three sub-folders that
 * each contain a glyph (cloud / lightbulb / pencil). Drawn as line-art with a
 * cyan -> blue -> violet -> magenta gradient. Sourced from the design kit
 * (see `.agents/folder-tree-icon-kit/` for the canonical reference).
 */
export function IdeaverseLogoMark({
  className,
  ariaLabel = "ideaverse-OS",
  preserveAspectRatio = "xMidYMid meet",
}: Props) {
  const reactId = useId();
  const gradientId = `iv-mark-grad-${reactId.replace(/[:#]/g, "")}`;
  const url = `url(#${gradientId})`;

  return (
    <svg
      viewBox="0 0 640 640"
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="80"
          y1="560"
          x2="560"
          y2="120"
        >
          <stop offset="0%" stopColor="#1FB8F2" />
          <stop offset="35%" stopColor="#5A6BF0" />
          <stop offset="70%" stopColor="#9F49E8" />
          <stop offset="100%" stopColor="#E14AC9" />
        </linearGradient>
      </defs>

      {/* Structural strokes (heavier) */}
      <g
        fill="none"
        stroke={url}
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Parent folder */}
        <path d="M 120 160 L 248 160 L 286 198 L 520 198 Q 540 198 540 218 L 540 372 Q 540 392 520 392 L 140 392 Q 120 392 120 372 Z" />
        {/* T-bus connector */}
        <line x1="330" y1="392" x2="330" y2="452" />
        <line x1="156" y1="452" x2="504" y2="452" />
        <line x1="156" y1="452" x2="156" y2="492" />
        <line x1="330" y1="452" x2="330" y2="492" />
        <line x1="504" y1="452" x2="504" y2="492" />
        {/* Sub-folders */}
        <rect x="92" y="492" width="128" height="128" rx="24" ry="24" />
        <rect x="266" y="492" width="128" height="128" rx="24" ry="24" />
        <rect x="440" y="492" width="128" height="128" rx="24" ry="24" />
      </g>

      {/* Inner glyphs (lighter stroke) */}
      <g
        fill="none"
        stroke={url}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Cloud (left sub-folder) */}
        <path d="M 126 580 Q 112 580 112 568 Q 112 556 124 554 Q 128 542 142 540 Q 156 530 170 540 Q 184 542 188 554 Q 200 556 200 568 Q 200 580 186 580 Z" />
        {/* Lightbulb (center sub-folder) */}
        <path d="M 330 530 Q 308 530 308 550 Q 308 564 318 572 Q 322 576 322 582 L 338 582 Q 338 576 342 572 Q 352 564 352 550 Q 352 530 330 530 Z" />
        <line x1="322" y1="588" x2="338" y2="588" />
        {/* Pencil (right sub-folder) */}
        <g transform="rotate(-32 504 556)">
          <path d="M 478 549 L 522 549 L 536 556 L 522 563 L 478 563 Q 472 563 472 556 Q 472 549 478 549 Z" />
          <line x1="488" y1="549" x2="488" y2="563" />
          <line x1="522" y1="549" x2="522" y2="563" />
        </g>
      </g>
    </svg>
  );
}

/**
 * The brand gradient applied to plain text via background-clip. Use as a style
 * spread on any text element that should display "ideaverse-OS" in the brand
 * gradient (h1, header wordmark, etc.). Includes an explicit font-family so the
 * wordmark renders identically across header (default sans) and hero (where
 * an upstream rule otherwise forces h1 to Space Grotesk).
 */
export const IDEAVERSE_GRADIENT_TEXT_STYLE = {
  background:
    "linear-gradient(90deg, #1FB8F2 0%, #5A6BF0 35%, #9F49E8 70%, #E14AC9 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  fontFamily:
    'Inter, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
  letterSpacing: "-0.025em",
} as const;
