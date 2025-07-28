import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity } from './BaseEntity';
import { Cart } from './Cart';
import { Product } from './Product';

@ObjectType()
@Entity('cart_item')
export class CartItem extends BaseEntity {
  @Field(() => Int)
  @Column('int', { name: 'quantity' })
  quantity: number;

  @Field(() => Product)
  @ManyToOne(() => Product, product => product.cartItems, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
