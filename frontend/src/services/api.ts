import type { AuthResponse, Book, Loan } from '../types';

const API_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw error;
  }
  return res.json();
}

// Auth
export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
  });
}

// Books
export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${API_URL}/books`, {
    headers: authHeaders(),
  });
  return handleResponse<Book[]>(res);
}

// Loans
export async function createLoan(bookId: number): Promise<{ message: string; loan: Loan }> {
  const res = await fetch(`${API_URL}/loans/${bookId}`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function fetchMyLoans(): Promise<Loan[]> {
  const res = await fetch(`${API_URL}/loans/my`, {
    headers: authHeaders(),
  });
  return handleResponse<Loan[]>(res);
}
