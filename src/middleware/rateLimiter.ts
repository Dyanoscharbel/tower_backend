import rateLimit from 'express-rate-limit';

// Rate limiting général
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes par défaut
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requêtes par défaut
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting strict pour les créations/mises à jour
export const strictLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // 10 requêtes par minute
  message: {
    success: false,
    message: 'Trop de tentatives de modification, veuillez patienter'
  },
  standardHeaders: true,
  legacyHeaders: false
});
