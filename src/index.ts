import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import joueurRoutes from './routes/joueurs.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Charger les variables d'environnement
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Connexion à la base de données
connectDB();

// Middleware de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS avec logs détaillés
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:7474', // Port Vite de dev
  'https://reddit.com',
  'https://www.reddit.com',
  'https://*.reddit.com'
];

console.log('🌐 Origins autorisées CORS:', allowedOrigins);

// Middleware personnalisé pour logger toutes les requêtes entrantes
app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'];
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`\n📡 REQUÊTE ENTRANTE:`);
  console.log(`   IP: ${ip}`);
  console.log(`   Méthode: ${method}`);
  console.log(`   URL: ${url}`);
  console.log(`   Origin: ${origin || 'AUCUN'}`);
  console.log(`   User-Agent: ${userAgent}`);
  console.log(`   Headers:`, JSON.stringify(req.headers, null, 2));

  next();
});

app.use(cors({
  origin: (origin, callback) => {
    console.log(`\n🔍 VÉRIFICATION CORS:`);
    console.log(`   Origin demandée: ${origin || 'AUCUN'}`);
    
    // Permettre les requêtes sans origin (comme Postman, curl, etc.)
    if (!origin) {
      console.log(`   ✅ Autorisé (pas d'origin)`);
      return callback(null, true);
    }

    // Vérifier si l'origin est autorisée
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // Gérer les wildcards
        const pattern = allowedOrigin.replace('*', '.*');
        const regex = new RegExp(pattern);
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      console.log(`   ✅ Origin autorisée: ${origin}`);
      callback(null, true);
    } else {
      console.log(`   ❌ Origin BLOQUÉE: ${origin}`);
      console.log(`   📋 Origins autorisées:`, allowedOrigins);
      callback(new Error('Non autorisé par la politique CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-devvit-user', 'Origin', 'X-Requested-With', 'Accept']
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/joueurs', joueurRoutes);

// Route de santé
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend tour0001 fonctionne correctement',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route par défaut
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API Backend tour0001',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      joueurs: '/api/joueurs'
    }
  });
});

// Gestion des routes non trouvées
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion globale des erreurs avec logs détaillés
app.use((err: Error, req: Request, res: Response, _next: any) => {
  console.error(`\n❌ ERREUR GLOBALE:`);
  console.error(`   URL: ${req.method} ${req.url}`);
  console.error(`   Origin: ${req.headers.origin || 'AUCUN'}`);
  console.error(`   IP: ${req.ip || req.connection.remoteAddress}`);
  console.error(`   Erreur:`, err.message);
  console.error(`   Stack:`, err.stack);

  // Erreur CORS spécifique
  if (err.message.includes('CORS')) {
    console.error(`   🚫 ERREUR CORS - Origin non autorisée`);
    res.status(403).json({
      success: false,
      message: 'Accès refusé - CORS',
      error: 'Origin non autorisée'
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS autorisés: ${allowedOrigins.join(', ')}`);
});

export default app;
