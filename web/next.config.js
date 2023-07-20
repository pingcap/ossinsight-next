const {withWidgets} = require("@ossinsight/widgets-next");

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
  }
}


module.exports = withWidgets(nextConfig)
