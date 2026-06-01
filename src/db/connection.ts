import { Sequelize } from 'sequelize';
import { config } from '../config';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
}

export async function syncDatabase(): Promise<void> {
  await sequelize.sync();
}
