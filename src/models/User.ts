export type User = {
  id: number;
  username: string;
  name: string;
  phone: string;
  role: Role;
};

export enum Role {
  MANAGER = 'MANAGER',
  WAITER = 'WAITER',
  CHEF = 'CHEF',
}

export type SignInRequest = Pick<User, 'username'> & { password: string };
