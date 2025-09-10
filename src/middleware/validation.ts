import { Request, Response, NextFunction } from 'express';

// Middleware de validation pour les données des joueurs
export const validateJoueurData = (req: Request, res: Response, next: NextFunction): void => {
  const { reddit_id, username } = req.body;

  if (!reddit_id || typeof reddit_id !== 'string' || reddit_id.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: 'reddit_id est requis et doit être une chaîne non vide'
    });
    return;
  }

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: 'username est requis et doit être une chaîne non vide'
    });
    return;
  }

  if (reddit_id.length > 64) {
    res.status(400).json({
      success: false,
      message: 'reddit_id ne peut pas dépasser 64 caractères'
    });
    return;
  }

  if (username.length > 100) {
    res.status(400).json({
      success: false,
      message: 'username ne peut pas dépasser 100 caractères'
    });
    return;
  }

  next();
};

// Middleware de validation pour les mises à jour de score
export const validateScoreUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { score_increment, etage_actuel } = req.body;

  if (score_increment !== undefined && typeof score_increment !== 'number') {
    res.status(400).json({
      success: false,
      message: 'score_increment doit être un nombre'
    });
    return;
  }

  if (etage_actuel !== undefined && (typeof etage_actuel !== 'number' || etage_actuel < 1)) {
    res.status(400).json({
      success: false,
      message: 'etage_actuel doit être un nombre positif'
    });
    return;
  }

  next();
};
