export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'VOCERO' | 'USER';
  createdAt: string;
}