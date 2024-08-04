/**
 * User interface representing a user object.
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Admin' | 'Chef' | 'Server' | 'Caretaker' | 'Client';
  birthYear?: string; // Optionales Feld für Klienten
  shortcode?: string; // Optionales Feld für Klienten
}
