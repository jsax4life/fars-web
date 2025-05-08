export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
  username: string;
  createdAt: string;
  updatedAt: string;
  phone?: string;
}