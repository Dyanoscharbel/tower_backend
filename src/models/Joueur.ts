import mongoose, { Document, Schema } from 'mongoose';

export interface IJoueur extends Document {
  reddit_id: string;
  username: string;
  avatar_url?: string;
  score_global: number;
  etage_actuel: number;
  refresh_token?: string;
  created_at: Date;
  updated_at: Date;
}

const JoueurSchema: Schema = new Schema({
  reddit_id: {
    type: String,
    required: true,
    unique: true,
    maxlength: 64
  },
  username: {
    type: String,
    required: true,
    maxlength: 100
  },
  avatar_url: {
    type: String,
    required: false
  },
  score_global: {
    type: Number,
    default: 0
  },
  etage_actuel: {
    type: Number,
    default: 1
  },
  refresh_token: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Index pour les performances
JoueurSchema.index({ score_global: -1 });
JoueurSchema.index({ reddit_id: 1 });

// Middleware pour mettre à jour updated_at
JoueurSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updated_at = new Date();
  }
  next();
});

export const Joueur = mongoose.model<IJoueur>('Joueur', JoueurSchema);
