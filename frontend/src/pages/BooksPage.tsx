import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useState } from 'react';
import useSWR from 'swr';
import { createLoan, fetchBooks } from '../services/api';
import type { ApiError, Book } from '../types';

export default function BooksPage() {
  const { data: books, isLoading, error, mutate } = useSWR<Book[]>('/books', fetchBooks);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleLoan = async (book: Book) => {
    setLoadingId(book.id);
    try {
      const res = await createLoan(book.id);
      setSnack({ open: true, message: res.message, severity: 'success' });
      mutate(); // refresh list to update available copies
    } catch (err) {
      const apiErr = err as ApiError;
      setSnack({ open: true, message: apiErr.message ?? 'Erro ao solicitar empréstimo.', severity: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <BookIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Acervo de Livros
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualize e solicite empréstimos dos livros disponíveis
          </Typography>
        </Box>
      </Box>

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao carregar o acervo.
        </Alert>
      )}

      {/* Table */}
      {books && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de livros">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Título
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Autor
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    ISBN
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Disponibilidade
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Ação
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow
                    key={book.id}
                    sx={{
                      '&:last-child td': { border: 0 },
                      '&:hover': { backgroundColor: '#f8fafc' },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {book.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {book.author}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {book.isbn}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {book.is_available ? (
                        <Chip
                          label={`${book.available_copies} disponível${book.available_copies > 1 ? 'is' : ''}`}
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip label="Indisponível" color="error" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={
                          loadingId === book.id ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            <LibraryAddIcon />
                          )
                        }
                        disabled={!book.is_available || loadingId === book.id}
                        onClick={() => handleLoan(book)}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                      >
                        Emprestar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {books.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">Nenhum livro cadastrado.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
