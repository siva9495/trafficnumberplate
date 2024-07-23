// src/setupProxy.js
import {createProxyMiddleware} from 'http-proxy-middleware'

module.exports = function(app) {
  app.use(
    '/stream',  // Change '/api' to match the endpoint you are using in your React component
    createProxyMiddleware({
      target: 'http://192.168.0.202',  // Replace with your Hikvision camera's IP address
      changeOrigin: true,
      // pathRewrite: {
      //   '^/stream': '',  // Remove /api prefix when forwarding to target
      // },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.path}`);
      },
      onError: (err, req, res) => {
        console.error(`Proxy error: ${err}`);
      },
    })
  );
};
