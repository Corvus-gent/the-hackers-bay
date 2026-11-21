import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import hackersBay from '../api/hackersbay.js';
import config from '../vercel.json' with { type: 'json' };
import '../lib/hackersbay/build-landing.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicPath = resolve(root, 'public/hackersbay');
process.chdir(root);

const routes = new Map(config.rewrites.map(({ source, destination }) => [source, destination]));
const notFound = routes.get('/hackersbay/:path*');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

async function bodyOf(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req.iterator({ destroyOnReturn: false })) {
    bytes += chunk.length;
    if (bytes > 2000) return { status: 413 };
    chunks.push(chunk);
  }
  try { return { body: JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') }; }
  catch { return { status: 400 }; }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') {
      res.writeHead(307, { Location: '/hackersbay' });
      return res.end();
    }

    const destination = routes.get(url.pathname) || (url.pathname.startsWith('/hackersbay/') ? notFound : url.href);
    const target = new URL(destination, url);
    if (target.pathname === '/api/hackersbay') {
      req.query = Object.fromEntries([...url.searchParams, ...target.searchParams]);
      res.status = code => { res.statusCode = code; return res; };
      res.json = value => {
        res.setHeader('Content-Type', contentTypes['.json']);
        res.end(JSON.stringify(value));
      };
      if (req.method === 'POST') {
        const { body, status } = await bodyOf(req);
        if (status) return res.status(status).json({ error: status === 413 ? 'Send one public link.' : 'Invalid JSON.' });
        req.body = body;
      }
      return await hackersBay(req, res);
    }

    const file = resolve(root, '.' + decodeURIComponent(target.pathname));
    if (!file.startsWith(publicPath + sep)) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const data = await readFile(file);
    res.setHeader('Content-Type', contentTypes[extname(file)] || 'application/octet-stream');
    return res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    if (['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code)) {
      res.writeHead(404);
      return res.end('Not found');
    }
    if (error instanceof URIError) {
      res.writeHead(400);
      return res.end('Invalid path');
    }
    console.error(error);
    res.writeHead(500);
    return res.end('Unable to open the page');
  }
});

const port = Number(process.env.PORT || 4173);
server.listen(port, '127.0.0.1', () => {
  console.log('The Hackers Bay is ready at http://127.0.0.1:' + server.address().port + '/hackersbay');
});
