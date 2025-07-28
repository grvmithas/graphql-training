import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { CartItem } from './CartItem';

@ObjectType()
@Entity('cart')
export class Cart extends BaseEntity {
  @Field(() => User)
  @OneToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [CartItem], { nullable: true })
  @OneToMany(() => CartItem, cartItem => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];
}
