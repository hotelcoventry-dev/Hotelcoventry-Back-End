// src/seeders/run-seeders.ts
import { DataSource } from 'typeorm';
import { connectionSource } from '../config/typeorm';
import { seedProducts } from './product.seeder';

const runSeeders = async () => {
  try {
    const dataSource: DataSource = await connectionSource.initialize();
    console.log('🚀 Conectado a la base de datos');

    await seedProducts(dataSource);

    await dataSource.destroy();
    console.log('🌱 Seeding completado');
  } catch (error) {
    console.error('❌ Error en el seeding:', error);
    process.exit(1);
  }
};

runSeeders().catch((err) => {
  console.error('❌ Error inesperado en runSeeders:', err);
  process.exit(1);
});
