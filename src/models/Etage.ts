import mongoose, { Document, Schema } from 'mongoose';

export interface IEtage extends Document {
  nom: string;
  description?: string;
  regles?: string;
  score_max?: number;
  difficulty: number;
  config?: Record<string, any>;
}

const EtageSchema: Schema = new Schema({
  nom: {
    type: String,
    required: true,
    maxlength: 150
  },
  description: {
    type: String,
    required: false
  },
  regles: {
    type: String,
    required: false
  },
  score_max: {
    type: Number,
    required: false
  },
  difficulty: {
    type: Number,
    required: true
  },
  config: {
    type: Schema.Types.Mixed,
    required: false
  }
});

export const Etage = mongoose.model<IEtage>('Etage', EtageSchema);
