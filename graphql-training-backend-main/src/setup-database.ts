import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { Category } from './entities/Category';
import { Product } from './entities/Product';
import { User } from './entities/User';
import { Cart } from './entities/Cart';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  try {
    console.log('Connecting to Supabase PostgreSQL database...');
    console.log(`Host: ${process.env.DB_HOST}`);
    
    await AppDataSource.initialize();
    console.log('Connected to Supabase database successfully.');

    // Drop and recreate tables using synchronize
    await AppDataSource.synchronize(true); // Force true to drop tables and recreate
    console.log('Database schema created successfully.');

    // Seed categories
    console.log('Starting to seed data...');
    const categories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets'
      },
      {
        name: 'Clothing',
        description: 'Apparel and fashion items'
      },
      {
        name: 'Books',
        description: 'Physical and digital books'
      },
      {
        name: 'Home & Kitchen',
        description: 'Household appliances and kitchenware'
      }
    ];

    const categoryRepository = AppDataSource.getRepository(Category);
    const createdCategories = await Promise.all(
      categories.map(async (cat) => {
        const category = categoryRepository.create(cat);
        return await categoryRepository.save(category);
      })
    );

    console.log(`Seeded ${createdCategories.length} categories`);

    // Create products
    const products = [
      {
        name: 'Smartphone',
        description: 'Latest model smartphone with high-resolution display',
        price: 699.99,
        stockQuantity: 50,
        imageUrl: 'https://example.com/smartphone.jpg',
        category: createdCategories[0]
      },
      {
        name: 'Laptop',
        description: 'Powerful laptop for work and gaming',
        price: 1299.99,
        stockQuantity: 30,
        imageUrl: 'https://example.com/laptop.jpg',
        category: createdCategories[0]
      },
      {
        name: 'T-shirt',
        description: 'Comfortable cotton t-shirt',
        price: 24.99,
        stockQuantity: 100,
        imageUrl: 'https://example.com/tshirt.jpg',
        category: createdCategories[1]
      },
      {
        name: 'Jeans',
        description: 'Stylish jeans for everyday wear',
        price: 49.99,
        stockQuantity: 75,
        imageUrl: 'https://example.com/jeans.jpg',
        category: createdCategories[1]
      },
      {
        name: 'Novel',
        description: 'Bestselling novel by a renowned author',
        price: 19.99,
        stockQuantity: 200,
        imageUrl: 'https://example.com/novel.jpg',
        category: createdCategories[2]
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker for home use',
        price: 89.99,
        stockQuantity: 40,
        imageUrl: 'https://example.com/coffeemaker.jpg',
        category: createdCategories[3]
      }
    ];

    const productRepository = AppDataSource.getRepository(Product);
    for (const prod of products) {
      const product = productRepository.create(prod);
      await productRepository.save(product);
    }

    console.log(`Seeded ${products.length} products`);

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'user@example.com',
      password: hashedPassword
    });
    await userRepository.save(user);
    console.log('Created test user');

    // Create cart for the user
    const cartRepository = AppDataSource.getRepository(Cart);
    const cart = cartRepository.create({
      user
    });
    await cartRepository.save(cart);
    console.log('Created cart for test user');

    console.log('Database setup and seed completed successfully');
    await AppDataSource.destroy();
    
  } catch (error) {
    console.error('Error setting up database:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

setupDatabase();
