import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity } from './BaseEntity';
import { Cart } from './Cart';

@ObjectType()
@Entity('user')
export class User extends BaseEntity {
  @Field()
  @Column({ name: 'first_name' })
  firstName: string;

  @Field()
  @Column({ name: 'last_name' })
  lastName: string;

  @Field()
  @Column({ unique: true, name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Field(() => Cart, { nullable: true })
  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;
}
