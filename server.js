import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
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
};

function proxyShopify(res) {
  var options = {
    hostname: 'sandhyagems.in',
    path: '/collections/navaratna/products.json?limit=8',
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SandhyaGemsBot/1.0)',
      'Accept': 'application/json',
    },
  };
  var req = https.request(options, function (shopifyRes) {
    if (shopifyRes.statusCode >= 300 && shopifyRes.statusCode < 400 && shopifyRes.headers.location) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Redirect', products: [] }));
      return;
    }
    var body = '';
    shopifyRes.on('data', function (chunk) { body += chunk; });
    shopifyRes.on('end', function () {
      try {
        JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(body);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON from Shopify', products: [] }));
      }
    });
  });
  req.on('error', function (err) {
    console.error('Shopify fetch error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to fetch products', products: [] }));
  });
  req.end();
}

function serveFile(filePath, res) {
  var ext = path.extname(filePath).toLowerCase();
  var contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, function (err, data) {
    if (err) {
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), function (err2, html) {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
        }
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
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
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  serveFile(filePath, res);
});

server.listen(PORT, function () {
  console.log('Sandhya Gems Corner server running on port ' + PORT);
});
