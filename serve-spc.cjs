/* Minimal static file server for local preview of the SPC HTML kit.
   Node avoids the getcwd sandbox issue that blocks `python -m http.server`.
   Root is hardcoded to an absolute path so it never depends on cwd. */
const http = require('http');
const fs = require('fs');
const path = require('path');

/* Resolve from this file's own location so the server keeps working if the kit
   is moved or renamed (the old hardcoded absolute path had gone stale). */
const ROOT = __dirname;
const PORT = 8791;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/demo-11.html';
  const filePath = path.join(ROOT, path.normalize(rel));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`SPC HTML preview on http://localhost:${PORT}/demo-11.html`));
