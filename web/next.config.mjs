import createMDX from "@next/mdx";
import withSvgr from "next-plugin-svgr";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/widgets',
        permanent: false,
      },
    ]
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    externalDir: true,
    serverComponentsExternalPackages: ['@napi-rs/canvas'],
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.sql$/,
      use: 'raw-loader',
    }, {
      test: /\.liquid$/,
      use: 'raw-loader',
    })
    config.externals.push('@napi-rs/canvas')
    return config;
  },
  svgrOptions: {
    ref: true,
    svgo: false,
    replaceAttrValues: {
      fill: 'currentColor',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}


const withMDX = createMDX({
  options: {
    remarkPlugins: []
  }
});

export default withSvgr(withMDX(nextConfig));
