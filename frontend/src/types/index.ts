export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  available_copies: number;
  is_available: boolean;
}

export interface Loan {
  loan_id: number;
  loaned_at: string;
  book_id: number;
  title: string;
  author: string;
  isbn: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
