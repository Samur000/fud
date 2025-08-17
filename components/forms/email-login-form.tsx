'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailLoginSchema, type EmailLoginFormData } from '@/lib/zod-schemas';
import { authClient } from '@/lib/auth-client';
import { useToastContext } from '@/components/toast-provider';

export function EmailLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<EmailLoginFormData>({
    resolver: zodResolver(emailLoginSchema),
  });

  const onSubmit = async (data: EmailLoginFormData) => {
    setIsLoading(true);
    try {
      await authClient.emailLogin(data);
      showSuccess('Успешный вход', 'Добро пожаловать!');
      // Redirect or handle success
    } catch (err: any) {
      const errorMessage = err.message || 'Произошла ошибка при входе';
      
      if (err.message?.includes('INVALID_CREDENTIALS')) {
        setError('email', { message: 'Неверный email или пароль' });
        setError('password', { message: 'Неверный email или пароль' });
      } else if (err.message?.includes('EMAIL_NOT_VERIFIED')) {
        showError('Email не подтвержден', 'Проверьте почту и подтвердите email');
      } else {
        showError('Ошибка', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Введите пароль"
            {...register('password')}
            className={errors.password ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </motion.div>
  );
} 