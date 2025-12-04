/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fundamental para monorepos: garante que o Next transpile
  // o pacote local caso haja dependências de CSS ou JSX cru
  transpilePackages: ['@dnd-editor/core'],
  images: {
    remotePatterns: [
      new URL('https://images.unsplash.com/**'),
      new URL('https://d3secykhf0toyz.cloudfront.net/**'),
      new URL('https://johnsonlawgroup.s3.us-east-1.amazonaws.com/**'),
    ]
  },
};

module.exports = nextConfig;