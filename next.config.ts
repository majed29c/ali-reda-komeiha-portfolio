import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // For opening the dev server from a phone or another machine on the LAN.
  // Next blocks cross-origin requests to dev-only assets by default. This is a
  // development-only setting and has no effect on a production build.
  // Router-assigned IPs change, so update this if your machine's LAN IP moves.
  allowedDevOrigins: ["192.168.0.110", "192.168.0.*"],
};

export default nextConfig;
