import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const upload = multer({ dest: 'uploads/' });

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

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
