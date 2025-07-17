/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // 👈 THIS disables Turbopack and switches to Webpack
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src * data: blob: 'unsafe-inline' 'unsafe-eval';
              script-src * data: blob: 'unsafe-inline' 'unsafe-eval';
              style-src * data: blob: 'unsafe-inline' 'unsafe-eval';
              img-src * data: blob: 'unsafe-inline';
              font-src * data: blob: 'unsafe-inline';
              object-src *;
              base-uri *;
              form-action *;
              frame-ancestors *;
              connect-src * data: blob: 'unsafe-inline' 'unsafe-eval';
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
