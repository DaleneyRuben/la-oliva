import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import router from './routes';
import errorHandler from './middleware/error-handler';

const app = express();

const LOCAL_FRONTEND_ORIGIN = 'http://localhost:3000';
const previewOriginPatterns = [
  /^https:\/\/la-oliva-frontend-[a-z0-9-]+-fernando-daleney-s-projects\.vercel\.app$/,
  /^https:\/\/la-oliva-registro-[a-z0-9-]+-fernando-daleney-s-projects\.vercel\.app$/,
];

export function isAllowedOrigin(origin: string) {
  const productionOrigins = [process.env.CORS_STAFF_ORIGIN, process.env.CORS_PUBLIC_ORIGIN].filter(
    (configuredOrigin): configuredOrigin is string => Boolean(configuredOrigin),
  );

  return (
    origin === LOCAL_FRONTEND_ORIGIN ||
    productionOrigins.includes(origin) ||
    previewOriginPatterns.some((pattern) => pattern.test(origin))
  );
}

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)),
    exposedHeaders: ['Content-Disposition'],
  }),
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(express.json({ limit: '1mb' }));

app.use('/api', router);

app.use(errorHandler);

export default app;
