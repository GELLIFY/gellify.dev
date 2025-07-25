import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  async redirects() {
    return [
      // Basic redirect
      {
        source: '/docs',
        destination: '/',
        permanent: true,
      },
      
    ]
  },
};

export default withMDX(config);
