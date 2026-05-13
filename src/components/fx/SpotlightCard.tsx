"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  glowIntensity?: number;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(167, 139, 250, 0.35)",
  borderColor,
  borderWidth = 1,
  borderRadius = 16,
  glowIntensity = 0.15,
  ...props
}: SpotlightCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true);
    setOpacity(1);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    setOpacity(0);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden bg-surface transition-all duration-500",
        className
      )}
      style={{
        borderRadius: `${borderRadius}px`,
      }}
      {...props}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          borderRadius: `${borderRadius}px`,
          padding: `${borderWidth}px`,
          background: borderColor
            ? borderColor
            : `conic-gradient(
                from 225deg,
                rgba(167, 139, 250, 0.9),
                rgba(167, 139, 250, 0.1) 25%,
                rgba(255, 255, 255, 0.15) 50%,
                rgba(167, 139, 250, 0.1) 75%,
                rgba(167, 139, 250, 0.9)
              )`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          opacity: isHovered ? 1 : 0.5,
        }}
      />

      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left: position.x,
          top: position.y,
          width: "400px",
          height: "400px",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
          opacity: opacity * glowIntensity * 5,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          borderRadius: `${borderRadius}px`,
          opacity: isHovered ? 0.5 : 0,
          boxShadow: `inset 0 0 30px rgba(167, 139, 250, 0.12), 0 0 30px rgba(167, 139, 250, 0.12)`,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
