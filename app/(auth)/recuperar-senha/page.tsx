'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { api } from '../../../services/api';
import AuthShell from '../../../components/auth/AuthShell';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError('');
    if (!EMAIL_RE.test(email)) {
      setEmailError('E-mail inválido.');
      return;
    }
    setLoading(true);
    try {
      await api.requestPasswordReset(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <Typography
        variant="caption"
        sx={{ color: 'primary.main', letterSpacing: '0.12em', display: 'block', mb: 1 }}
      >
        RECUPERAR SENHA
      </Typography>

      <Typography
        component="h1"
        sx={{
          fontFamily: 'var(--f-serif)',
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontWeight: 400,
          lineHeight: 1.1,
          mb: 1.25,
        }}
      >
        Esqueceu a senha?
      </Typography>

      <Typography sx={{ color: 'text.disabled', fontSize: '0.9rem', mb: 3.75 }}>
        Enviaremos um link de redefinição para o seu e-mail.
      </Typography>

      {sent ? (
        <Alert severity="success" sx={{ borderRadius: 2 }} role="status">
          Se existir uma conta para {email}, o link de redefinição já está a caminho.
        </Alert>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          noValidate
        >
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            error={!!emailError}
            helperText={emailError}
            fullWidth
            required
            autoComplete="email"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={loading}
            endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ mt: 1 }}
          >
            {loading ? 'Enviando…' : 'Enviar link'}
          </Button>
        </Box>
      )}

      <Typography
        sx={{ textAlign: 'center', mt: 4, fontSize: '0.8125rem', color: 'text.secondary' }}
      >
        Lembrou a senha?{' '}
        <Box
          component={Link}
          href="/signin"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Voltar para o login
        </Box>
      </Typography>
    </AuthShell>
  );
}
