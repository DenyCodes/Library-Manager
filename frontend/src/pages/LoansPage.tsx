import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import useSWR from 'swr';
import { fetchMyLoans } from '../services/api';
import type { Loan } from '../types';

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

export default function LoansPage() {
  const { data: loans, isLoading, error } = useSWR<Loan[]>('/loans/my', fetchMyLoans);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <HistoryIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Meus Empréstimos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Histórico de livros emprestados por você
          </Typography>
        </Box>
        {loans && (
          <Chip
            label={`${loans.length} empréstimo${loans.length !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ ml: 'auto' }}
          />
        )}
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
          Erro ao carregar seus empréstimos.
        </Alert>
      )}

      {/* Table */}
      {loans && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 600 }} aria-label="tabela de empréstimos">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    #
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Título
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Autor
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    ISBN
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Data do Empréstimo
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.map((loan, idx) => (
                  <TableRow
                    key={loan.loan_id}
                    sx={{
                      '&:last-child td': { border: 0 },
                      '&:hover': { backgroundColor: '#f8fafc' },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {idx + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {loan.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {loan.author}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {loan.isbn}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatDate(loan.loaned_at)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}

                {loans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography color="text.secondary">
                          Você ainda não realizou nenhum empréstimo.
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          Acesse o acervo e escolha um livro!
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}
