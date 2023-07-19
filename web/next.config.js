const {withWidgets} = require("@ossinsight/widgets-next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  serverComponentsExternalPackages: ['jsonpath']
}


module.exports = withWidgets(nextConfig)
