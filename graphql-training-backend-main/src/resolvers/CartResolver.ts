import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Cart } from '../entities/Cart';
import { CartItem } from '../entities/CartItem';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { AddToCartInput } from './types/inputs';
import { AppDataSource } from '../config/database';

@Resolver(Cart)
export class CartResolver {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);
  private userRepository = AppDataSource.getRepository(User);
  private productRepository = AppDataSource.getRepository(Product);

  // Helper method to ensure consistent relation loading
  private async getCartWithRelations(userId: string): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'items.product.category', 'user']
    });
  }

  // Helper method to create or get cart with guaranteed non-null return
  private async getOrCreateCart(userId: string): Promise<Cart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    let cart = await this.getCartWithRelations(userId);

    if (!cart) {
      // Create new cart
      const newCart = this.cartRepository.create({ user });
      await this.cartRepository.save(newCart);
      
      // Reload with relations
      cart = await this.getCartWithRelations(userId);
      
      // Final safety check
      if (!cart) {
        throw new Error('Failed to create cart');
      }
    }

    return cart;
  }

  @Query(() => Cart, { nullable: true })
  async cart(@Arg('userId') userId: string): Promise<Cart | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    let cart = await this.getCartWithRelations(userId);

    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
      // Reload with relations after creation
      cart = await this.getCartWithRelations(userId);
    }

    return cart;
  }

  @Mutation(() => Cart)
  async addToCart(
    @Arg('userId') userId: string,
    @Arg('input') { productId, quantity }: AddToCartInput
  ): Promise<Cart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Load product with category to ensure it exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['category']
    });
    
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // Validate that product has a category (if required by your business logic)
    if (!product.category) {
      throw new Error(`Product with ID ${productId} does not have a category assigned`);
    }

    if (product.stockQuantity < quantity) {
      throw new Error(`Not enough stock available. Available: ${product.stockQuantity}`);
    }

    // Use helper method to ensure cart is never null
    const cart = await this.getOrCreateCart(userId);

    // Initialize items array if it doesn't exist
    if (!cart.items) {
      cart.items = [];
    }

    const existingItem = cart.items.find(item => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Create cart item with proper type safety
      const cartItem = this.cartItemRepository.create({
        quantity,
        product,
        cart: cart // cart is guaranteed to be non-null here
      });
      await this.cartItemRepository.save(cartItem);
      
      cart.items.push(cartItem);
    }

    // Return cart with all necessary relations loaded
    return this.cartRepository.findOneOrFail({
      where: { id: cart.id },
      relations: ['items', 'items.product', 'items.product.category', 'user']
    });
  }

  @Mutation(() => Cart)
  async removeFromCart(
    @Arg('userId') userId: string,
    @Arg('cartItemId') cartItemId: string
  ): Promise<Cart> {
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const cart = await this.getCartWithRelations(userId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    // Ensure items array exists and has content
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const cartItemIndex = cart.items.findIndex(item => item.id === cartItemId);
    
    if (cartItemIndex === -1) {
      throw new Error(`Cart item with ID ${cartItemId} not found`);
    }

    await this.cartItemRepository.delete(cartItemId);
    cart.items.splice(cartItemIndex, 1);

    return cart;
  }
}
