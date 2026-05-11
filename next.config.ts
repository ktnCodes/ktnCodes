import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
