import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep pdfkit out of the webpack bundle; it relies on __dirname for font assets.
  serverExternalPackages: ['pdfkit'],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Full CSP intentionally omitted: Next's hydration scripts and the
          // inline JSON-LD in layout.tsx would need nonce plumbing first.
          // frame-ancestors alone is safe and covers clickjacking with XFO.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          // ideaverse-os.ktncodes.com -> /ideaverse-os/* on the same Next app.
          // Negative lookahead excludes Next internals (chunks, fonts, images)
          // and top-level static files so the browser can fetch them at root,
          // which is where Next actually serves them.
          // Exclude Next internals (_next, api, fonts), the ideaverse-os
          // route itself (so we don't loop), public asset folders (memoji,
          // beliefs), and any path containing a dot (catches all root-level
          // static files like /avatar.png, /resume.pdf, /llms.txt, /*.svg).
          source:
            "/:path((?!_next/|api/|fonts/|ideaverse-os/|memoji/|beliefs/|.*\\.).*)",
          has: [{ type: "host", value: "ideaverse-os.ktncodes.com" }],
          destination: "/ideaverse-os/:path",
        },
      ],
    };
  },
};

export default nextConfig;
