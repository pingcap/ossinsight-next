import {withWidgets} from "@ossinsight/widgets-next";
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
    remarkPlugins: []
  }
});

export default withWidgets(withSvgr(withMDX(nextConfig)));
