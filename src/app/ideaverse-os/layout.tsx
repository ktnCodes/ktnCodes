import type { ReactNode } from "react";
import { Lora } from "next/font/google";
import { IdeaverseHeader } from "./_components/IdeaverseHeader";

const lora = Lora({
  variable: "--font-iv-lora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

// Server-side fetch of the GitHub star count, cached for an hour. Failures
// (network, rate-limit, missing repo pre-publish) fall back to null so the
// header can hide the count rather than render a stale "0".
async function fetchStarCount(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/ktnCodes/ideaverse-os",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

export default async function IdeaverseOSLayout({
  children,
}: {
  children: ReactNode;
}) {
  const stars = await fetchStarCount();
  return (
    <div
      data-theme="ideaverse-os"
      data-iv-scroll
      className={`${lora.variable} fixed inset-0 z-[100] overflow-y-auto`}
    >
      <IdeaverseHeader stars={stars} />
      {children}
    </div>
  );
}
