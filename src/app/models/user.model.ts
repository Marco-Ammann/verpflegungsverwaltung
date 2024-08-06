/**
 * User interface representing a user object.
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Admin' | 'Kuechenchef' | 'Servicemitarbeiter' | 'Betreuer' | 'Klient';
  birthYear?: string; // Optionales Feld für Klienten
  shortcode?: string; // Optionales Feld für Klienten
}
