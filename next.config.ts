import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow TypeScript errors during builds for deployment
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Vercel Blob Storage
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      // Common image hosting services
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // Amazon S3 and CloudFront
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
      // Google Images and Drive
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      // Imgur
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // GitHub
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      // Common gear retailer image domains
      {
        protocol: 'https',
        hostname: 'images.epallet.com',
      },
      {
        protocol: 'https',
        hostname: 'www.rei.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      // Patagonia
      {
        protocol: 'https',
        hostname: 'www.patagonia.com',
      },
      // REI Co-op
      {
        protocol: 'https',
        hostname: 'www.rei.com',
      },
      // Generic wildcard for common domains (use with caution)
      {
        protocol: 'https',
        hostname: '*.com',
      },
      {
        protocol: 'http',
        hostname: '*.com',
      },
      // International domains for gear retailers
      {
        protocol: 'https',
        hostname: '*.sk', // Slovakia (outdoorline.sk)
      },
      {
        protocol: 'https',
        hostname: '*.de', // Germany
      },
      {
        protocol: 'https',
        hostname: '*.uk', // United Kingdom
      },
      {
        protocol: 'https',
        hostname: '*.eu', // European Union
      },
      {
        protocol: 'https',
        hostname: '*.ca', // Canada
      },
      {
        protocol: 'https',
        hostname: '*.org',
      },
      {
        protocol: 'https',
        hostname: '*.net',
      },
    ],
  },
};

export default nextConfig;
