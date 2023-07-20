const {withWidgets} = require("@ossinsight/widgets-next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    serverComponentsExternalPackages: ['@napi-rs/canvas'],
  },
  webpack: config => {
    config.externals.push('@napi-rs/canvas')
    return config;
  }
}


module.exports = withWidgets(nextConfig)
