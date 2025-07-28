import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Category } from '../entities/Category';
import { CreateCategoryInput } from './types/inputs';
import { AppDataSource } from '../config/database';

@Resolver(Category)
export class CategoryResolver {
  private categoryRepository = AppDataSource.getRepository(Category);

  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg('id') id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ 
      where: { id },
      relations: ['products'] 
    });
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg('input') { name, description }: CreateCategoryInput
  ): Promise<Category> {
    const category = this.categoryRepository.create({
      name,
      description,
    });

    return this.categoryRepository.save(category);
  }
}
