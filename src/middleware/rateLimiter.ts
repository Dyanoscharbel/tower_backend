import rateLimit from 'express-rate-limit';

// Rate limiting général avec logs
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes par défaut
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requêtes par défaut
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: any, _res: any) => {
    // Log toutes les requêtes pour debug
    console.log(`📊 Rate limit check - IP: ${req.ip}, URL: ${req.url}`);
    return false; // Ne pas skip, appliquer le rate limiting
  },
  handler: (req: any, res: any) => {
    console.log(`\n⚠️ RATE LIMIT ATTEINT:`);
    console.log(`   IP: ${req.ip || req.connection.remoteAddress}`);
    console.log(`   URL: ${req.method} ${req.url}`);
    console.log(`   Origin: ${req.headers.origin || 'AUCUN'}`);
    console.log(`   User-Agent: ${req.headers['user-agent']}`);
    
    res.status(429).json({
      success: false,
      message: 'Trop de requêtes, veuillez réessayer plus tard'
    });
  }
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
