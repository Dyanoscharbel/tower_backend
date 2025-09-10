import mongoose, { Document, Schema } from 'mongoose';

export interface IProgression extends Document {
  joueur_id: mongoose.Types.ObjectId;
  etage_id: mongoose.Types.ObjectId;
  score: number;
  completed: boolean;
  played_at: Date;
}

const ProgressionSchema: Schema = new Schema({
  joueur_id: {
    type: Schema.Types.ObjectId,
    ref: 'Joueur',
    required: true
  },
  etage_id: {
    type: Schema.Types.ObjectId,
    ref: 'Etage',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  played_at: {
    type: Date,
    default: Date.now
  }
});

// Index pour les leaderboards
ProgressionSchema.index({ etage_id: 1, score: -1 });
ProgressionSchema.index({ joueur_id: 1 });

export const Progression = mongoose.model<IProgression>('Progression', ProgressionSchema);
