import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/src/hooks/auth/index.ts';
import { loginSchema, type LoginInput } from '@/src/types/auth/index.ts';

type ErrorKey = 'admin.login.invalid' | 'admin.login.rateLimited' | 'admin.login.generic';

// Nunca mostra texto vindo do servidor: só mensagens nossas, escolhidas pelo estado HTTP
const errorKey = (error: unknown): ErrorKey => {
  if (axios.isAxiosError(error) && error.response?.status === 401) return 'admin.login.invalid';
  if (axios.isAxiosError(error) && error.response?.status === 429) return 'admin.login.rateLimited';
  return 'admin.login.generic';
};

export const useLoginForm = () => {
  const navigate = useNavigate();
  const login = useLogin();
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });
  const onSubmit = form.handleSubmit((values) => {
    if (login.isPending) return;
    login.mutate(values, { onSuccess: () => navigate('/', { replace: true }) });
  });
  return { form, onSubmit, isPending: login.isPending, errorKey: login.isError ? errorKey(login.error) : null };
};
