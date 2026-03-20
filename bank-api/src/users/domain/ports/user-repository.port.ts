import { UserModel } from '../models/user.model';

export abstract class UserRepositoryPort {
  abstract save(user: UserModel): Promise<UserModel>;
  abstract findById(id: string): Promise<UserModel | null>;
  abstract findByEmail(email: string): Promise<UserModel | null>;
  abstract findAll(): Promise<UserModel[]>;
  abstract update(user: UserModel): Promise<UserModel>;
  abstract delete(id: string): Promise<void>;
}
