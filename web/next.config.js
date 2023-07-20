const {withWidgets} = require("@ossinsight/widgets-next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    serverComponentsExternalPackages: ['@napi-rs/canvas'],
  }
}


module.exports = withWidgets(nextConfig)
