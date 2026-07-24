import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'covers.openlibrary.org'
            },
            {
                protocol: 'https',
                hostname: '**.public.blob.vercel-storage.com'
            },
            // Optional: Wildcard to allow ALL HTTPS images during development
            // {
            //   protocol: 'https',
            //   hostname: '**',
            // },
        ],
    },
};

export default nextConfig;
