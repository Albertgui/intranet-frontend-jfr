export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VOCERO' | 'USER';
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'VOCERO' | 'USER';
}