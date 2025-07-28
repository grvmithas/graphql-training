import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import { RegisterUserInput, LoginInput } from './types/inputs';
import { AppDataSource } from '../config/database';
import bcrypt from 'bcryptjs';

@Resolver(User)
export class UserResolver {
  private userRepository = AppDataSource.getRepository(User);

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userRepository.find();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('id') id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  @Mutation(() => User)
  async register(
    @Arg('input') { firstName, lastName, email, password }: RegisterUserInput
  ): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ email });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    return this.userRepository.save(user);
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('input') { email, password }: LoginInput
  ): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    return user;
  }
}
