export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Chef' | 'Server' | 'Caretaker' | 'Client';
  email: string;
  password: string;
}
