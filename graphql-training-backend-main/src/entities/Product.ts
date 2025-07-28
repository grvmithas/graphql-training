import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { BaseEntity } from './BaseEntity';
import { Category } from './Category';
import { CartItem } from './CartItem';

@ObjectType()
@Entity('product')
export class Product extends BaseEntity {
  @Field()
  @Column({ name: 'name' })
  name: string;

  @Field()
  @Column({ name: 'description' })
  description: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, name: 'price' })
  price: number;

  @Field(() => Int)
  @Column('int', { name: 'stock_quantity' })
  stockQuantity: number;

  @Field()
  @Column({ nullable: true, name: 'image_url' })
  imageUrl: string;

  @Field(() => Category)
  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Field(() => [CartItem], { nullable: true })
  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[];
}
