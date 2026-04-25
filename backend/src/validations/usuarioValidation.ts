import { z } from 'zod';

export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Validação de nível de senha (pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número)
export const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const createUsuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().regex(emailRegex, 'Email inválido'),
  senha: z.string().regex(senhaRegex, 'Senha deve ter: mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número'),
  cpf: z.string().regex(cpfRegex, 'CPF inválido. Use formato: 000.000.000-00')
});

export const updateUsuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  senha: z.string().regex(senhaRegex, 'Senha deve ter: mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número').optional(),
  cpf: z.string().regex(cpfRegex, 'CPF inválido. Use formato: 000.000.000-00')
});

export const loginSchema = z.object({
  email: z.string().regex(emailRegex, 'Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
});