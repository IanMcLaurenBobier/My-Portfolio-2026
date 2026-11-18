import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PROJECTS } from './src/data/portfolioData.ts';
import type { ContactSubmission, ProjectItem } from './src/types/portfolio.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSCODE = process.env.PORTFOLIO_ADMIN_PASSCODE || 'mac-admin-2026';
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'portfolio-store.json');

interface StoreState {
  projects: ProjectItem[];
  messages: ContactSubmission[];
}

function loadStore(): StoreState {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as Partial<StoreState>;
      return {
        projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : [...INITIAL_PROJECTS],
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      };
    }
  } catch {
    // Fallback cleanly to in-memory seed
  }
  return {
    projects: [...INITIAL_PROJECTS],
    messages: [],
  };
}

function saveStore(state: StoreState): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // Graceful degradation if filesystem is read-only
  }
}

const store = loadStore();

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // CORS headers for decoupled frontend/API compatibility
  app.use('/api', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Health & API metadata
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Mac Bobier Portfolio API',
      architecture: 'Express Runtime (Laravel 11 API Contract Compatible)',
      laravelSourceDirectory: '/backend-laravel',
      projectCount: store.projects.length,
      timestamp: new Date().toISOString(),
    });
  });

  // Public projects list
  app.get('/api/projects', (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const items = category
      ? store.projects.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      : store.projects;
    res.json({
      data: items,
      total: items.length,
    });
  });

  // Single project by slug
  app.get('/api/projects/:slug', (req, res) => {
    const found = store.projects.find((p) => p.slug === req.params.slug);
    if (!found) {
      res.status(404).json({ message: 'Project not found.' });
      return;
    }
    res.json({ data: found });
  });

  // Contact form submission with Laravel-compatible validation shape & honeypot spam check
  app.post('/api/contact', (req, res) => {
    const body = req.body as Record<string, unknown>;
    const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
    if (honeypot.length > 0) {
      // Silently reject bot submission with 201 to avoid tipping off scrapers
      res.status(201).json({ message: 'Inquiry received.' });
      return;
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    const errors: Record<string, string[]> = {};
    if (name.length < 2) errors.name = ['Please enter your name (at least 2 characters).'];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = ['Please enter a valid email address.'];
    if (subject.length < 3) errors.subject = ['Please provide a brief subject line.'];
    if (message.length < 10) errors.message = ['Please enter a message of at least 10 characters.'];

    if (Object.keys(errors).length > 0) {
      res.status(422).json({
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    const submission: ContactSubmission = {
      id: `msg_${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    store.messages.unshift(submission);
    if (store.messages.length > 100) {
      store.messages.length = 100;
    }
    saveStore(store);

    res.status(201).json({
      message: 'Thank you for reaching out. Your message has been recorded.',
      data: {
        id: submission.id,
        createdAt: submission.createdAt,
      },
    });
  });

  // Admin verification middleware
  function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const token = req.header('X-Admin-Token') || '';
    if (token !== ADMIN_PASSCODE) {
      res.status(401).json({ message: 'Unauthorized. Valid admin token required.' });
      return;
    }
    next();
  }

  app.post('/api/admin/verify', (req, res) => {
    const body = req.body as Record<string, unknown>;
    const token = typeof body.passcode === 'string' ? body.passcode.trim() : '';
    if (token !== ADMIN_PASSCODE) {
      res.status(401).json({ authenticated: false, message: 'Invalid passcode.' });
      return;
    }
    res.json({ authenticated: true });
  });

  app.get('/api/messages', requireAdmin, (_req, res) => {
    res.json({
      data: store.messages,
      total: store.messages.length,
    });
  });

  app.post('/api/projects', requireAdmin, (req, res) => {
    const body = req.body as Record<string, unknown>;
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const subtitle = typeof body.subtitle === 'string' ? body.subtitle.trim() : '';
    const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
    const domain = typeof body.domain === 'string' ? body.domain.trim() : 'Software Development';
    const category = body.category === 'Featured' ? 'Featured' : 'Additional';
    const liveUrl = typeof body.liveUrl === 'string' && body.liveUrl.trim() ? body.liveUrl.trim() : undefined;
    const repoUrl = typeof body.repoUrl === 'string' && body.repoUrl.trim() ? body.repoUrl.trim() : undefined;
    const technologies = Array.isArray(body.technologies)
      ? body.technologies.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      : ['TypeScript', 'React'];

    if (title.length < 2 || summary.length < 10) {
      res.status(422).json({
        message: 'Validation failed.',
        errors: {
          ...(title.length < 2 ? { title: ['Project title is required.'] } : {}),
          ...(summary.length < 10 ? { summary: ['Summary must be at least 10 characters.'] } : {}),
        },
      });
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `project-${Date.now()}`;

    const newProject: ProjectItem = {
      id: `${slug}-${Date.now()}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      title,
      subtitle: subtitle || 'Custom Portfolio Project',
      category,
      domain,
      summary,
      architectureNotes: 'Added dynamically via the portfolio project management API.',
      features: ['Structured workflow', 'Responsive interface'],
      technologies,
      liveUrl,
      repoUrl,
      repoPlaceholder: repoUrl ? undefined : 'Editable placeholder — add repository URL',
      year: String(new Date().getFullYear()),
    };

    store.projects.push(newProject);
    saveStore(store);

    res.status(201).json({
      message: 'Project added.',
      data: newProject,
    });
  });

  app.delete('/api/projects/:id', requireAdmin, (req, res) => {
    const idx = store.projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ message: 'Project not found.' });
      return;
    }
    store.projects.splice(idx, 1);
    saveStore(store);
    res.json({ message: 'Project removed.' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
