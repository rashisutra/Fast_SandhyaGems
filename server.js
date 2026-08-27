import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain',
  '.xml':  'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
};

function proxyShopify(res) {
  var options = {
    hostname: 'sandhyagems.in',
    path: '/collections/navarat/products.json?limit=8',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SandhyaGemsBot/1.0)',
      'Accept': 'application/json',
    },
  };
  var req = https.request(options, function (shopifyRes) {
    if (shopifyRes.statusCode >= 300 && shopifyRes.statusCode < 400 && shopifyRes.headers.location) {
      res.writeHead(500, withSecurityHeaders({ 'Content-Type': 'application/json' }));
      res.end(JSON.stringify({ error: 'Redirect', products: [] }));
      return;
    }
    var body = '';
    shopifyRes.on('data', function (chunk) { body += chunk; });
    shopifyRes.on('end', function () {
      try {
        JSON.parse(body);
        res.writeHead(200, withSecurityHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }));
        res.end(body);
      } catch (e) {
        res.writeHead(500, withSecurityHeaders({ 'Content-Type': 'application/json' }));
        res.end(JSON.stringify({ error: 'Invalid JSON from Shopify', products: [] }));
      }
    });
  });
  req.on('error', function (err) {
    console.error('Shopify fetch error:', err.message);
    res.writeHead(500, withSecurityHeaders({ 'Content-Type': 'application/json' }));
    res.end(JSON.stringify({ error: 'Failed to fetch products', products: [] }));
  });
  req.end();
}

const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml']);
const STATIC_ASSET_EXT = new Set(['.css', '.js', '.jpg', '.jpeg', '.png', '.webp', '.svg', '.ico', '.woff2']);

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://sandhyagems.in https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com; frame-ancestors 'none';",
};

function withSecurityHeaders(headers) {
  return Object.assign({}, SECURITY_HEADERS, headers);
}

function getCacheHeader(ext) {
  if (STATIC_ASSET_EXT.has(ext)) {
    return 'public, max-age=31536000, immutable';
  }
  return 'no-cache';
}

function sendResponse(req, res, statusCode, headers, data) {
  var ext = (headers['X-Ext'] || '').toLowerCase();
  delete headers['X-Ext'];
  headers = withSecurityHeaders(headers);

  if (COMPRESSIBLE.has(ext)) {
    var acceptEncoding = (req.headers['accept-encoding'] || '');
    var useBrotli = acceptEncoding.includes('br');
    var useGzip = !useBrotli && acceptEncoding.includes('gzip');

    if (useBrotli || useGzip) {
      var compress = useBrotli ? zlib.brotliCompress : zlib.gzip;
      compress(data, function (err, compressed) {
        if (err) {
          res.writeHead(statusCode, headers);
          res.end(data);
        } else {
          headers['Content-Encoding'] = useBrotli ? 'br' : 'gzip';
          headers['Vary'] = 'Accept-Encoding';
          res.writeHead(statusCode, headers);
          res.end(compressed);
        }
      });
      return;
    }
  }
  res.writeHead(statusCode, headers);
  res.end(data);
}

function serveFile(filePath, req, res) {
  var ext = path.extname(filePath).toLowerCase();
  var contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, function (err, data) {
    if (err) {
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), function (err2, html) {
        if (err2) {
          res.writeHead(404, withSecurityHeaders({ 'Content-Type': 'text/plain' }));
          res.end('Not found');
        } else {
          sendResponse(req, res, 200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Ext': '.html'
          }, html);
        }
      });
      return;
    }
    sendResponse(req, res, 200, {
      'Content-Type': contentType,
      'Cache-Control': getCacheHeader(ext),
      'X-Ext': ext
    }, data);
  });
}

const server = http.createServer(function (req, res) {
  var url = req.url.split('?')[0];

  if (url === '/api/products') {
    proxyShopify(res);
    return;
  }

  var filePath = path.join(PUBLIC_DIR, url === '/' ? 'index.html' : url);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, withSecurityHeaders({ 'Content-Type': 'text/plain' }));
    res.end('Forbidden');
    return;
  }

  serveFile(filePath, req, res);
});

server.listen(PORT, function () {
  console.log('Sandhya Gems Corner server running on port ' + PORT);
});
