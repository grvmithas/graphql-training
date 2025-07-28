import { Entity, Column, OneToMany } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity } from './BaseEntity';
import { Product } from './Product';

@ObjectType()
@Entity('category')
export class Category extends BaseEntity {
  @Field()
  @Column({ name: 'name' })
  name: string;

  @Field()
  @Column({ name: 'description' })
  description: string;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, product => product.category)
  products: Product[];
}
