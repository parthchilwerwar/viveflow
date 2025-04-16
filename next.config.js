/** @type {import('next').NextConfig} */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add the mini-css-extract-plugin
    config.plugins.push(new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[id].[contenthash].css',
    }));

    // Find the CSS loader rule
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.toString().includes('css')
    );

    // If found, modify it to use MiniCssExtractPlugin
    if (cssRule && cssRule.oneOf) {
      cssRule.oneOf.forEach((moduleRule) => {
        if (moduleRule.use && Array.isArray(moduleRule.use)) {
          const cssLoaderIndex = moduleRule.use.findIndex(
            (loader) => loader.loader && loader.loader.includes('css-loader')
          );
          
          if (cssLoaderIndex !== -1) {
            // Replace style-loader with MiniCssExtractPlugin.loader
            moduleRule.use.unshift({
              loader: MiniCssExtractPlugin.loader,
            });
          }
        }
      });
    }

    // Return the modified config
    return config;
  },
}

module.exports = nextConfig 