import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer as createViteServer } from 'vite';
import { canonicalRedirect, createSeo } from './server/seo/index.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT ?? 3000);
  const upload = multer({ dest: 'uploads/' });
  const isProduction = process.env.NODE_ENV === 'production';
  app.disable('x-powered-by');
  if (process.env.TRUST_PROXY) app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? true : process.env.TRUST_PROXY);
  app.use(compression());

  // SEO: metadados, dados estruturados, robots.txt e sitemap.xml saem do servidor (ver docs/seo)
  const seo = createSeo({
    siteUrl: process.env.SITE_URL,
    apiBase: process.env.API_PROXY_TARGET ?? (isProduction ? undefined : 'http://localhost:8000'),
    indexBlog: process.env.SEO_INDEX_BLOG === 'true',
  });
  if (isProduction && !seo.configuredUrl) {
    console.warn('[seo] SITE_URL não definido: canonical, sitemap e Open Graph usam o host do pedido.');
  }

  if (process.env.MAINTENANCE_MODE === 'true') {
    // Cores vêm de src/theme.css (única fonte de verdade): o bloco @theme é injetado como :root.
    const themeCss = fs.readFileSync(path.join(process.cwd(), 'src', 'theme.css'), 'utf-8');
    const themeVars = /@theme\s*\{([\s\S]*?)\}/.exec(themeCss)?.[1] ?? '';
    const maintenancePage = fs
      .readFileSync(path.join(process.cwd(), 'maintenance.html'), 'utf-8')
      .replace('/*THEME_VARS*/', `:root {${themeVars}}`);
    app.use((req, res, next) => {
      if (req.path.startsWith('/img/')) return next();
      res.status(503).set({ 'Retry-After': '3600', 'Cache-Control': 'no-store' }).type('html').send(maintenancePage);
    });
  }

  // Produção: a API (FastAPI) e os ficheiros de media passam pelo mesmo domínio do site
  const apiTarget = process.env.API_PROXY_TARGET;
  if (apiTarget) {
    // pathFilter (e não app.use(path)) mantém o caminho completo no pedido enviado à API
    app.use(
      createProxyMiddleware({
        target: apiTarget,
        pathFilter: ['/api/v1', '/media'],
        on: {
          proxyRes: (proxyRes, req) => {
            // - cada upload/substituição gera um nome novo (ULID): o ficheiro nunca muda, cache de um ano
            if (req.url?.startsWith('/media/') && proxyRes.statusCode === 200) {
              proxyRes.headers['cache-control'] = 'public, max-age=31536000, immutable';
            }
          },
        },
      }),
    );
  }

  app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const tempPath = req.file.path;
    const targetPath = path.join(process.cwd(), 'public', 'mariline-boto.jpg');

    if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
      fs.mkdirSync(path.join(process.cwd(), 'public'));
    }

    fs.rename(tempPath, targetPath, err => {
      if (err) return res.status(500).send(err.message);
      res.status(200).send('File uploaded and renamed.');
    });
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').set('Cache-Control', 'public, max-age=3600').send(seo.robots(req));
  });
  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml').set('Cache-Control', 'public, max-age=3600').send(seo.sitemap(req));
  });

  // Um único redirecionamento 301 para a forma canónica (barra final, www/sem www, http/https)
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const target = canonicalRedirect(req.path, req.originalUrl, req.hostname, req.protocol, seo.configuredUrl, isProduction);
    return target ? res.redirect(301, target) : next();
  });

  const sendPage = async (template: string, req: Request, res: Response) => {
    const { html, status, robots } = await seo.render(template, req, req.path);
    if (robots.startsWith('noindex')) res.set('X-Robots-Tag', robots);
    res.status(status).set('Cache-Control', 'no-cache').type('html').send(html);
  };

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.get('*', async (req, res, next) => {
      try {
        const raw = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        await sendPage(await vite.transformIndexHtml(req.originalUrl, raw), req, res);
      } catch (error) {
        next(error);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    app.use(
      express.static(distPath, {
        index: false,
        // - /assets tem hash no nome: pode ficar em cache um ano
        // - o resto (imagens por omissão) revalida ao fim de uma hora
        setHeaders: (res, filePath) => {
          res.set('Cache-Control', filePath.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'public, max-age=3600');
        },
      }),
    );
    app.get('*', (req, res, next) => {
      sendPage(template, req, res).catch(next);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
