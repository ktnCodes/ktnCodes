"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShowcaseCardProps {
  tagline?: string;
  heading: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  brandName?: string;
  services?: string[];
  className?: string;
  enableTilt?: boolean;
  maxTilt?: number;
  enableParallax?: boolean;
}

export function ShowcaseCard({
  tagline,
  heading,
  description,
  imageUrl,
  imageAlt = "Showcase image",
  ctaText,
  onCtaClick,
  brandName,
  services = [],
  className,
  enableTilt = true,
  maxTilt = 8,
  enableParallax = true,
}: ShowcaseCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);

  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !enableTilt) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY, enableTilt]
  );

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative w-full max-w-[400px] rounded-3xl overflow-hidden",
        "bg-neutral-950 dark:bg-neutral-950",
        "shadow-2xl shadow-black/20 dark:shadow-black/40",
        "cursor-pointer select-none",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 40px 80px -20px rgba(0,0,0,0.5)",
      }}
    >
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none opacity-0"
        style={{
          background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative aspect-[4/3] overflow-hidden">
        {tagline && (
          <motion.div
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-white/90 text-sm sm:text-base font-medium tracking-tight">
              {tagline}
            </span>
          </motion.div>
        )}

        <motion.div
          className="absolute inset-0"
          style={{
            x: enableParallax ? parallaxX : 0,
            y: enableParallax ? parallaxY : 0,
            scale: 1.1,
          }}
        >
          <motion.img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: isHovered ? 1.15 : 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6 -mt-8">
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-medium text-white tracking-tight leading-tight mb-2 sm:mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {heading}
        </motion.h2>

        {description && (
          <motion.p
            className="text-sm sm:text-base text-neutral-400 mb-4 sm:mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {description}
          </motion.p>
        )}

        {ctaText && (
          <motion.button
            onClick={onCtaClick}
            className={cn(
              "relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full",
              "text-sm font-medium",
              "bg-neutral-800/80 text-neutral-200",
              "border border-neutral-700/50",
              "overflow-hidden",
              "transition-colors duration-300",
              "hover:border-neutral-600/80"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
              animate={isHovered ? { translateX: "200%" } : { translateX: "-100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">{ctaText}</span>
          </motion.button>
        )}
      </div>

      {(brandName || services.length > 0) && (
        <motion.div
          className="px-4 sm:px-6 py-4 sm:py-5 border-t border-neutral-800/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            {brandName && (
              <motion.span
                className="text-xs sm:text-sm text-neutral-400 font-medium"
                whileHover={{ color: "#ffffff" }}
                transition={{ duration: 0.2 }}
              >
                {brandName}
              </motion.span>
            )}

            {services.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {services.map((service, index) => (
                  <React.Fragment key={service}>
                    <motion.span
                      className="text-xs sm:text-sm text-neutral-500"
                      whileHover={{ color: "#ffffff", scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {service}
                    </motion.span>
                    {index < services.length - 1 && (
                      <motion.span
                        className="text-neutral-600"
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        ✦
                      </motion.span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
        animate={{
          boxShadow: isHovered
            ? "inset 0 0 0 1px rgba(255,255,255,0.1)"
            : "inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
