const {withWidgets} = require("@ossinsight/widgets-next");
const withSvgr = require('next-plugin-svgr')

/** @type {import('next').NextConfig} */
const nextConfig = {
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


module.exports = withWidgets(withSvgr(nextConfig))
