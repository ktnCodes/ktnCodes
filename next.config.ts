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
          source:
            "/:path((?!_next/|api/|fonts/|ideaverse-os/|favicon\\.ico|icon\\.png|apple-icon\\.png|sitemap\\.xml|robots\\.txt).*)",
          has: [{ type: "host", value: "ideaverse-os.ktncodes.com" }],
          destination: "/ideaverse-os/:path",
        },
      ],
    };
  },
};

export default nextConfig;
