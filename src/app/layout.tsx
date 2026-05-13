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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kevin Trinh Nguyen",
  url: "https://ktncodes.com",
  image: "https://ktncodes.com/avatars/avatar-with-winnie.jpg",
  jobTitle: "Software Engineer — Embedded Systems & AI/Agentic Engineering",
  worksFor: {
    "@type": "Organization",
    name: "John Deere",
    url: "https://www.deere.com",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Iowa State University",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Austin",
    addressRegion: "TX",
    addressCountry: "US",
  },
  sameAs: [
    "https://github.com/ktnCodes",
    "https://www.linkedin.com/in/itskevtrinh/",
  ],
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
