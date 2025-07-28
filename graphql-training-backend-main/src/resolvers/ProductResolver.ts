import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Product } from '../entities/Product';
import { Category } from '../entities/Category';
import { CreateProductInput } from './types/inputs';
import { AppDataSource } from '../config/database';

@Resolver(Product)
export class ProductResolver {
  private productRepository = AppDataSource.getRepository(Product);
  private categoryRepository = AppDataSource.getRepository(Category);

  @Query(() => [Product])
  async products(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category'] });
  }

  @Query(() => Product, { nullable: true })
  async product(@Arg('id') id: string): Promise<Product | null> {
    return this.productRepository.findOne({ 
      where: { id },
      relations: ['category'] 
    });
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg('input') { name, description, price, stockQuantity, imageUrl, categoryId }: CreateProductInput
  ): Promise<Product> {
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    const product = this.productRepository.create({
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      category
    });

    return this.productRepository.save(product);
  }
}
