import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
})

export const signupSchema = z.object({
  username: z.string().min(3, 'Name must be at least 3 characters'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  role:     z.enum(['attendee', 'exhibitor']),
})

export const applyExpoSchema = z.object({
  company:     z.string().min(2, 'Company name required'),
  description: z.string().optional(),
  products:    z.string().optional(),
})

export const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const changePasswordSchema = z.object({
  newPassword:     z.string().min(4, 'Password must be at least 4 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})