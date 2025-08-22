import { DataSource } from 'typeorm';
import { Product } from '../module/products/entities/product.entity';
import { Category } from '../module/categories/entities/category.entity';

export const seedProducts = async (dataSource: DataSource) => {
  const productRepository = dataSource.getRepository(Product);
  const categoryRepository = dataSource.getRepository(Category);

  const defaultCategory = categoryRepository.create({
    name: 'General',
    description: 'Categoría por defecto',
  });
  await categoryRepository.save(defaultCategory);

  const productsData = [
    {
      name: 'Café Americano',
      description: 'Café negro clásico',
      price: 2.5,
      category: defaultCategory,
    },
    {
      name: 'Capuchino',
      description: 'Café con leche espumosa',
      price: 3.0,
      category: defaultCategory,
    },
    {
      name: 'Tostado Jamón y Queso',
      description: 'Sandwich clásico caliente',
      price: 4.5,
      category: defaultCategory,
    },
  ];

  for (const p of productsData) {
    const exists = await productRepository.findOne({ where: { name: p.name } });
    if (!exists) {
      const newProduct = productRepository.create(p);
      await productRepository.save(newProduct);
    }
  }

  console.log('✅ Productos sembrados correctamente');
};
