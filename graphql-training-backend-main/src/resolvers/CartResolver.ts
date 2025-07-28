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

  @Query(() => Cart, { nullable: true })
  async cart(@Arg('userId') userId: string): Promise<Cart | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'user']
    });

    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
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

    const product = await this.productRepository.findOneBy({ id: productId });
    
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (product.stockQuantity < quantity) {
      throw new Error(`Not enough stock available. Available: ${product.stockQuantity}`);
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product']
    });

    if (!cart) {
      cart = this.cartRepository.create({ user });
      await this.cartRepository.save(cart);
    }

    const existingItem = cart.items?.find(item => item.product.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        quantity,
        product,
        cart
      });
      await this.cartItemRepository.save(cartItem);
      
      if (!cart.items) {
        cart.items = [];
      }
      cart.items.push(cartItem);
    }

    return this.cartRepository.findOneOrFail({
      where: { id: cart.id },
      relations: ['items', 'items.product', 'user']
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

    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product', 'user']
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const cartItemIndex = cart.items?.findIndex(item => item.id === cartItemId);
    
    if (cartItemIndex === undefined || cartItemIndex === -1) {
      throw new Error(`Cart item with ID ${cartItemId} not found`);
    }

    await this.cartItemRepository.delete(cartItemId);
    cart.items.splice(cartItemIndex, 1);

    return cart;
  }
}
