import { createApp } from './app';
import { config } from './config';
import { connectDatabase, syncDatabase } from './db/connection';
import './models';

async function main() {
  await connectDatabase();
  console.log('Connexion PostgreSQL établie');

  await syncDatabase();
  console.log('Modèles synchronisés');

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Breezy API démarrée sur le port ${config.port}`);
  });
}

main().catch((err) => {
  console.error('Échec du démarrage:', err);
  process.exit(1);
});
