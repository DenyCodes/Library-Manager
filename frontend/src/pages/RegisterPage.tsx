import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ApiError } from '../types';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
    } catch (err) {
      const apiErr = err as ApiError;
      const fieldErrors: Record<string, string> = {};
      if (apiErr.errors) {
        Object.entries(apiErr.errors).forEach(([k, v]) => {
          fieldErrors[k] = v[0];
        });
      } else {
        fieldErrors['general'] = apiErr.message ?? 'Erro ao cadastrar.';
      }
      setErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <MenuBookIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              Criar Conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registre-se para acessar o acervo
            </Typography>
          </Box>

          {errors['general'] && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors['general']}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nome completo"
              value={form.name}
              onChange={set('name')}
              required
              fullWidth
              autoFocus
              error={!!errors['name']}
              helperText={errors['name']}
            />
            <TextField
              label="E-mail"
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              fullWidth
              error={!!errors['email']}
              helperText={errors['email']}
            />
            <TextField
              label="Senha"
              type="password"
              value={form.password}
              onChange={set('password')}
              required
              fullWidth
              error={!!errors['password']}
              helperText={errors['password']}
            />
            <TextField
              label="Confirmar senha"
              type="password"
              value={form.password_confirmation}
              onChange={set('password_confirmation')}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
              sx={{ mt: 1, borderRadius: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Criar conta'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Já tem conta?{' '}
            <Link to="/login" style={{ color: '#1565c0', fontWeight: 600 }}>
              Faça login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
