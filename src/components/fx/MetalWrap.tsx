"use client";

import { type ReactNode } from "react";
import { useTheme } from "next-themes";
import { MetalFx } from "metal-fx";
import { useIsMounted } from "@/hooks/useIsMounted";

interface Props {
  children: ReactNode;
  variant?: "button" | "circle";
  preset?: "chromatic" | "silver" | "gold";
}

export function MetalWrap({ children, variant = "button", preset = "chromatic" }: Props) {
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const theme: "light" | "dark" = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <MetalFx variant={variant} preset={preset} theme={theme}>
      {children}
    </MetalFx>
  );
}
