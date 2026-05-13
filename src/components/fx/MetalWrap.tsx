"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { MetalFx } from "metal-fx";

interface Props {
  children: ReactNode;
  variant?: "button" | "circle";
  preset?: "chromatic" | "silver" | "gold";
}

export function MetalWrap({ children, variant = "button", preset = "chromatic" }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const theme: "light" | "dark" = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <MetalFx variant={variant} preset={preset} theme={theme}>
      {children}
    </MetalFx>
  );
}
