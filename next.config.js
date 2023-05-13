const { NextFederationPlugin } = require('@module-federation/nextjs-mf');
/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: true,
  // compiler: {
  //   removeConsole: true,
  // },
  images: {
    domains: ["images.ctfassets.net", "images1.content-gbl.com"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  i18n: {
    locales: ["en-US", "de-DE"],
    defaultLocale: "en-US",
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: "/:location/:slug*",
        destination: "/:slug*?location=:location",
      }
    ];
  },
  webpack5: true,
  webpack: (config, options) => {
    console.log(options.webpack.version); 
    const { isServer } = options;
    config.experiments = { topLevelAwait: true, layers: true };
    config.plugins.push(
      new NextFederationPlugin({
        name: 'nextpoc',
        remotes: {
          idpsearch: `idpsearch@http://localhost:3001/_next/static/chunks/remoteEntry.js`
          // idpsearch: `idpsearch@http://localhost:3001/_next/static/${isServer ? 'ssr' : 'chunks'}/remoteEntry.js`
          // idpsearch: `idpsearch@https://ui.htcpoc.com/_next/static/${isServer ? 'ssr' : 'chunks'}/remoteEntry.js`
        },
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './TestComp': './src/components/testComp/TestComp.jsx'
        },
        shared: {},
        extraOptions:{
          automaticAsyncBoundary: true
        }
      })
    );
    return config;
  },
};

module.exports = nextConfig;
