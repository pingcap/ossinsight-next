import type { NextConfig } from 'next';
import createMDX from "@next/mdx";
// @ts-expect-error - no type declarations available
import withSvgr from "next-plugin-svgr";

interface SvgrNextConfig extends NextConfig {
  svgrOptions?: {
    ref?: boolean;
    svgo?: boolean;
    replaceAttrValues?: Record<string, string>;
  };
  /** @deprecated Next 16: use ESLint CLI; kept for ignoreDuringBuilds until flat config is fixed */
  eslint?: { ignoreDuringBuilds?: boolean };
}

const nextConfig: SvgrNextConfig = {
  // React Compiler - automatic memoization (Next 16 stable)
  reactCompiler: true,

  eslint: { ignoreDuringBuilds: true },

  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // SVGR options for SVG imports as React components
  svgrOptions: {
    ref: true,
    svgo: false,
    replaceAttrValues: {
      fill: 'currentColor',
    },
  },

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
  serverExternalPackages: ['@napi-rs/canvas'],
  webpack: config => {
    config.module.rules.push({
        test: /\.sql$/,
        use: 'raw-loader',
    })
    config.externals.push('@napi-rs/canvas')
    return config;
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
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
    qualities: [100, 75],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: []
  }
});

// @ts-expect-error - next-plugin-svgr types can reference older Next (e.g. from cli) causing I18NConfig mismatch
export default withSvgr(withMDX(nextConfig as NextConfig));
