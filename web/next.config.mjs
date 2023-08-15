import {withWidgets} from "@ossinsight/widgets-next";
import createMDX from "@next/mdx";
import withSvgr from "next-plugin-svgr";
import remarkBreaks from "remark-breaks";

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
  experimental: {
    externalDir: true,
    serverComponentsExternalPackages: ['@napi-rs/canvas'],
    outputFileTracingIgnores: [
      'node_modules/.pnpm/@swc+core-linux-x64-musl@1.3.70',
      'node_modules/.pnpm/@swc+core-linux-x64-gnu@1.3.70',
    ]
  },
  webpack: config => {
    config.externals.push('@napi-rs/canvas')
    return config;
  },
  svgrOptions: {
    ref: true,
    svgo: false,
    replaceAttrValues: {
      fill: 'currentColor',
    },
  }
}


const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkBreaks]
  }
});

export default withWidgets(withSvgr(withMDX(nextConfig)));
