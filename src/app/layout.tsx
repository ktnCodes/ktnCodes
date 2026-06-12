import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Footer } from "@/components/layout/footer";
import { ChatProvider } from "@/components/chat/chat-context";
import { Wordmark } from "@/components/nav/Wordmark";
import { FloatingPill } from "@/components/nav/FloatingPill";
import { StickyMemoji } from "@/components/nav/StickyMemoji";
import { DevModeBadge } from "@/components/dev/DevModeBadge";
import { PixelCanvas } from "@/components/fx/PixelCanvas";
import { getConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ktnCodes",
    template: "%s | ktnCodes",
  },
  description:
    "Engineering notebook — agentic engineering, embedded systems, and software development.",
  openGraph: {
    title: "ktnCodes",
    description:
      "Engineering notebook — agentic engineering, embedded systems, and software development.",
    type: "website",
  },
};

// Identity fields derive from portfolio-config.json so a config edit (new
// job, new title) updates the structured data Google reads, with no second
// copy to remember. knowsAbout stays editorial.
const config = getConfig();
const [locality = "Austin", region = "TX"] = config.personal.location
  .split(",")
  .map((s) => s.trim());

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: config.personal.name,
  url: "https://ktncodes.com",
  image: "https://ktncodes.com/avatars/avatar-with-winnie.jpg",
  jobTitle: config.personal.title,
  worksFor: {
    "@type": "Organization",
    name: config.experience[0]?.company ?? "",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: config.education.institution,
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: locality,
    addressRegion: region,
    addressCountry: "US",
  },
  sameAs: [config.social.github, config.social.linkedin],
  knowsAbout: [
    "Embedded Systems",
    "C++",
    "Qt",
    "Agentic Engineering",
    "LLM Tooling",
    "AI Workflows",
    "Model Context Protocol",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <ThemeProvider>
          <ChatProvider>
            <PixelCanvas
              variant="trail"
              gap={8}
              radius={40}
              colors={["#7c3aed", "#a78bfa", "#ddd6fe"]}
              className="fixed inset-0 -z-10 pointer-events-none"
            />
            <Wordmark />
            <FloatingPill />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <StickyMemoji />
            <DevModeBadge />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
