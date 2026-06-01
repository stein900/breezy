import express from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import messageRoutes from './routes/messageRoutes';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'breezy-api' });
  });

  app.get('/', (_req, res) => {
    res.json({
      service: 'breezy-api',
      version: '1.0.0',
      message: 'API REST Breezy — utilisez les routes /api/*',
      endpoints: {
        health: 'GET /health',
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        feed: 'GET /api/posts/feed',
        posts: 'POST /api/posts',
        profile: 'GET /api/users/:userId',
      },
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/messages', messageRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
