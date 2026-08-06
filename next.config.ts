import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // The verification page renders photos via short-lived signed URLs from
    // Supabase Storage — allowlisted to that path only, not the whole host.
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: 'https',
            hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
            pathname: '/storage/v1/object/sign/**',
          },
        ]
      : [],
  },
};

export default nextConfig;
