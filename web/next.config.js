const {withWidgets} = require("@ossinsight/widgets-next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  }
}


module.exports = withWidgets(nextConfig)
