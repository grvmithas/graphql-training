import { Field, InputType } from 'type-graphql';
import { IsEmail, Length, MinLength } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class CreateCategoryInput {
  @Field()
  @Length(1, 255)
  name: string;

  @Field()
  description: string;
}

@InputType()
export class CreateProductInput {
  @Field()
  @Length(1, 255)
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  stockQuantity: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  categoryId: string;
}

@InputType()
export class AddToCartInput {
  @Field()
  productId: string;

  @Field()
  quantity: number;
}
