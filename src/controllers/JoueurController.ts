import { Request, Response } from 'express';
import { Joueur, IJoueur } from '../models/Joueur.js';

export interface CreateJoueurRequest {
  reddit_id: string;
  username: string;
  avatar_url?: string;
}

export class JoueurController {
  // Créer ou récupérer un joueur
  static async createOrGetJoueur(req: Request<{}, any, CreateJoueurRequest>, res: Response): Promise<void> {
    try {
      const { reddit_id, username, avatar_url } = req.body;

      if (!reddit_id || !username) {
        res.status(400).json({
          success: false,
          message: 'reddit_id et username sont requis'
        });
        return;
      }

      // Chercher si le joueur existe déjà
      let joueur = await Joueur.findOne({ reddit_id });

      if (joueur) {
        // Mettre à jour les infos si nécessaire
        const needsUpdate = 
          joueur.username !== username || 
          (avatar_url && joueur.avatar_url !== avatar_url);

        if (needsUpdate) {
          joueur.username = username;
          if (avatar_url) joueur.avatar_url = avatar_url;
          await joueur.save();
        }

        res.status(200).json({
          success: true,
          message: 'Joueur trouvé et mis à jour',
          joueur: {
            id: joueur._id,
            reddit_id: joueur.reddit_id,
            username: joueur.username,
            avatar_url: joueur.avatar_url,
            score_global: joueur.score_global,
            etage_actuel: joueur.etage_actuel,
            created_at: joueur.created_at,
            updated_at: joueur.updated_at
          }
        });
      } else {
        // Créer un nouveau joueur
        joueur = new Joueur({
          reddit_id,
          username,
          avatar_url,
          score_global: 0,
          etage_actuel: 1
        });

        await joueur.save();

        res.status(201).json({
          success: true,
          message: 'Nouveau joueur créé',
          joueur: {
            id: joueur._id,
            reddit_id: joueur.reddit_id,
            username: joueur.username,
            avatar_url: joueur.avatar_url,
            score_global: joueur.score_global,
            etage_actuel: joueur.etage_actuel,
            created_at: joueur.created_at,
            updated_at: joueur.updated_at
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création/récupération du joueur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer un joueur par reddit_id
  static async getJoueurByRedditId(req: Request, res: Response): Promise<void> {
    try {
      const { reddit_id } = req.params;

      const joueur = await Joueur.findOne({ reddit_id });

      if (!joueur) {
        res.status(404).json({
          success: false,
          message: 'Joueur non trouvé'
        });
        return;
      }

      res.status(200).json({
        success: true,
        joueur: {
          id: joueur._id,
          reddit_id: joueur.reddit_id,
          username: joueur.username,
          avatar_url: joueur.avatar_url,
          score_global: joueur.score_global,
          etage_actuel: joueur.etage_actuel,
          created_at: joueur.created_at,
          updated_at: joueur.updated_at
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du joueur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Mettre à jour le score d'un joueur
  static async updateScore(req: Request, res: Response): Promise<void> {
    try {
      const { reddit_id } = req.params;
      const { score_increment, etage_actuel } = req.body;

      const joueur = await Joueur.findOne({ reddit_id });

      if (!joueur) {
        res.status(404).json({
          success: false,
          message: 'Joueur non trouvé'
        });
        return;
      }

      if (typeof score_increment === 'number') {
        joueur.score_global += score_increment;
      }

      if (typeof etage_actuel === 'number') {
        joueur.etage_actuel = etage_actuel;
      }

      await joueur.save();

      res.status(200).json({
        success: true,
        message: 'Score mis à jour',
        joueur: {
          id: joueur._id,
          reddit_id: joueur.reddit_id,
          username: joueur.username,
          avatar_url: joueur.avatar_url,
          score_global: joueur.score_global,
          etage_actuel: joueur.etage_actuel,
          updated_at: joueur.updated_at
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du score:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Récupérer le leaderboard
  static async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = parseInt(req.query.skip as string) || 0;

      const joueurs = await Joueur.find({})
        .sort({ score_global: -1 })
        .limit(limit)
        .skip(skip)
        .select('-refresh_token'); // Ne pas exposer les tokens

      const total = await Joueur.countDocuments();

      res.status(200).json({
        success: true,
        leaderboard: joueurs.map((joueur, index) => ({
          rank: skip + index + 1,
          id: joueur._id,
          username: joueur.username,
          avatar_url: joueur.avatar_url,
          score_global: joueur.score_global,
          etage_actuel: joueur.etage_actuel
        })),
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du leaderboard:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }
}
