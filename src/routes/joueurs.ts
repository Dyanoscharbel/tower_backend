import { Router } from 'express';
import { JoueurController } from '../controllers/JoueurController.js';

const router = Router();

// POST /api/joueurs - Créer ou récupérer un joueur
router.post('/', JoueurController.createOrGetJoueur);

// GET /api/joueurs/:reddit_id - Récupérer un joueur par reddit_id
router.get('/:reddit_id', JoueurController.getJoueurByRedditId);

// PUT /api/joueurs/:reddit_id/score - Mettre à jour le score d'un joueur
router.put('/:reddit_id/score', JoueurController.updateScore);

// GET /api/joueurs/leaderboard - Récupérer le leaderboard
router.get('/leaderboard/top', JoueurController.getLeaderboard);

export default router;
