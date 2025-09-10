import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || 'tour0001_game';
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
    }

    const conn = await mongoose.connect(mongoURI, {
      dbName: dbName,
    });

    console.log(`✅ MongoDB connecté: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur de connexion Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose déconnecté');
});

// Fermeture propre en cas d'arrêt du processus
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔒 Connexion MongoDB fermée suite à l\'arrêt de l\'application');
  process.exit(0);
});

export default connectDB;
