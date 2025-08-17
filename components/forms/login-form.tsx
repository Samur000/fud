'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/lib/zod-schemas';
import { authClient } from '@/lib/auth-client';
import { useToastContext } from '@/components/toast-provider';
import { useAppStore } from '@/lib/store';
import { validateCredentials } from '@/lib/mock-users';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToastContext();
  const { setUser, setAuthenticated } = useAppStore();
  
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Проверяем моковые данные
      const user = validateCredentials(data.email, data.phone, data.password);
      
      if (user) {
        // Успешный вход
        setUser(user);
        setAuthenticated(true);
        showSuccess('Успешный вход', `Добро пожаловать, ${user.name}!`);
        
        // Перенаправляем в зависимости от роли
        if (user.role === 'seller') {
          window.location.href = '/seller';
        } else {
          window.location.href = '/';
        }
      } else {
        // Неверные данные
        setError('email', { message: 'Неверный email или пароль' });
        setError('phone', { message: 'Неверный номер телефона или пароль' });
        setError('password', { message: 'Неверный email или пароль' });
        showError('Ошибка входа', 'Неверные учетные данные');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Произошла ошибка при входе';
      showError('Ошибка', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Номер телефона *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+79991234567"
            {...register('phone')}
            className={errors.phone ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
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
          <Label htmlFor="password">Пароль *</Label>
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>Демо-аккаунты:</p>
          <p className="text-xs mt-1">
            <strong>Продавец:</strong> qsamur@gmail.com / +79992693793 / yesyesNONO13@#
          </p>
          <p className="text-xs">
            <strong>Покупатель:</strong> qsamur2@gmail.com / +79998887766 / nonoYESYES13@#
          </p>
        </div>
      </form>
    </motion.div>
  );
} 