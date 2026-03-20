export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export class UserModel {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  activate(): UserModel {
    return new UserModel({ ...this, isActive: true, updatedAt: new Date() });
  }

  deactivate(): UserModel {
    return new UserModel({ ...this, isActive: false, updatedAt: new Date() });
  }

  updateProfile(name: string): UserModel {
    return new UserModel({ ...this, name, updatedAt: new Date() });
  }
}
