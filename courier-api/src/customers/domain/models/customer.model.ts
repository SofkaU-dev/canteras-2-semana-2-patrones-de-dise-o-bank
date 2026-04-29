export enum CustomerRole {
  ADMIN = 'ADMIN',
  SENDER = 'SENDER',
}

export class CustomerModel {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: CustomerRole;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: CustomerRole;
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

  activate(): CustomerModel {
    return new CustomerModel({ ...this, isActive: true, updatedAt: new Date() });
  }

  deactivate(): CustomerModel {
    return new CustomerModel({ ...this, isActive: false, updatedAt: new Date() });
  }

  updateProfile(name: string, role?: CustomerRole): CustomerModel {
    return new CustomerModel({
      ...this,
      name: name ?? this.name,
      role: role ?? this.role,
      updatedAt: new Date(),
    });
  }
}
