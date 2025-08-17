'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { emailSignupSchema, type EmailSignupFormData } from '@/lib/zod-schemas';
import { authClient } from '@/lib/auth-client';
import { useToastContext } from '@/components/toast-provider';

export function EmailSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const { success: showSuccess, error: showError } = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<EmailSignupFormData>({
    resolver: zodResolver(emailSignupSchema),
  });

  const onSubmit = async (data: EmailSignupFormData) => {
    setIsLoading(true);
    try {
      const response = await authClient.emailSignup(data);
      
      if (response.email_verification_required) {
        setShowVerificationAlert(true);
        showSuccess('Регистрация успешна', 'Проверьте почту для подтверждения');
      } else {
        showSuccess('Регистрация успешна', 'Добро пожаловать!');
        // Redirect or handle success
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Произошла ошибка при регистрации';
      
      if (err.message?.includes('EMAIL_IN_USE')) {
        setError('email', { message: 'Email уже используется' });
      } else if (err.message?.includes('WEAK_PASSWORD')) {
        setError('password', { message: 'Пароль слишком простой' });
      } else if (err.message?.includes('INVALID_EMAIL')) {
        setError('email', { message: 'Неверный формат email' });
      } else {
        showError('Ошибка', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await authClient.sendEmailVerification();
      showSuccess('Письмо отправлено', 'Проверьте почту');
    } catch (err: any) {
      showError('Ошибка', 'Не удалось отправить письмо');
    }
  };

  if (showVerificationAlert) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Alert>
          <AlertDescription className="space-y-4">
            <p>Проверьте вашу почту для подтверждения email адреса.</p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendVerification}
              className="w-full"
            >
              Отправить письмо снова
            </Button>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            type="text"
            placeholder="Введите ваше имя"
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

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
            placeholder="Минимум 8 символов"
            {...register('password')}
            className={errors.password ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Телефона (необязательно)</Label>
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

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="accept_terms"
            {...register('accept_terms')}
            className="rounded border-gray-300 mt-1"
          />
          <Label htmlFor="accept_terms" className="text-sm">
            Я принимаю{' '}
            <a href="/terms" className="text-primary hover:underline">
              условия использования
            </a>
          </Label>
        </div>
        {errors.accept_terms && (
          <p className="text-sm text-destructive">
            {errors.accept_terms.message}
          </p>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </motion.div>
  );
} 