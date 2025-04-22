
export interface User {
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (email: string, name: string, password: string) => void;
  logout: () => void;
}
