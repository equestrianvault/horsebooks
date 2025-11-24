import type { NextConfig } from "next";

const domains: Array<string> = [

];

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // output: 'export',
  // assetPrefix: './',
  // images: { unoptimized: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-img.fimfiction.net",
      },
      {
        protocol: "https",
        hostname: "images-wixmp-*.wixmp.com",
      },
      {
        protocol: "https",
        hostname: "assets.lulu.com",
      },
      {
        protocol: "https",
        hostname: "i.etsystatic.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "bookshow.blurb.com",
      },      
      {
        protocol: "https",
        hostname: "assets.bigcartel.com",
      },
      {
        protocol: "https",
        hostname: "derpicdn.net",
      },
    ]
  }
};

export default nextConfig;