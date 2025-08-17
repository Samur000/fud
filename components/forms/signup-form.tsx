'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signupSchema, type SignupFormData } from '@/lib/zod-schemas';
import { authClient } from '@/lib/auth-client';
import { useToastContext } from '@/components/toast-provider';

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{ email: boolean; phone: boolean; }>({ email: false, phone: false });
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');
  const { success: showSuccess, error: showError } = useToastContext();
  
  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  
  const acceptTerms = watch('accept_terms');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await authClient.signup({ ...data, role: selectedRole });
      if (response.email_verification_required || response.phone_verification_required) {
        setVerificationStatus({
          email: !response.email_verification_required,
          phone: !response.phone_verification_required,
        });
        setShowVerificationAlert(true);
        showSuccess('Регистрация успешна', 'Подтвердите email и телефон для продолжения');
      } else {
        showSuccess('Регистрация успешна', 'Добро пожаловать!');
        // Redirect or handle success
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Произошла ошибка при регистрации';
      if (err.message?.includes('EMAIL_IN_USE')) {
        setError('email', { message: 'Email уже используется' });
      } else if (err.message?.includes('PHONE_IN_USE')) {
        setError('phone', { message: 'Номер телефона уже используется' });
      } else if (err.message?.includes('WEAK_PASSWORD')) {
        setError('password', { message: 'Пароль слишком простой' });
      } else if (err.message?.includes('INVALID_EMAIL')) {
        setError('email', { message: 'Неверный формат email' });
      } else if (err.message?.includes('INVALID_PHONE')) {
        setError('phone', { message: 'Неверный формат номера телефона' });
      } else {
        showError('Ошибка', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailVerification = async () => {
    try {
      await authClient.sendEmailVerification();
      showSuccess('Письмо отправлено', 'Проверьте вашу почту');
    } catch (err: any) {
      showError('Ошибка', err.message || 'Не удалось отправить письмо');
    }
  };

  const handleResendPhoneVerification = async () => {
    try {
      await authClient.sendPhoneVerification();
      showSuccess('SMS отправлено', 'Проверьте ваш телефон');
    } catch (err: any) {
      showError('Ошибка', err.message || 'Не удалось отправить SMS');
    }
  };

  if (showVerificationAlert) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Alert>
          <AlertDescription className="space-y-4">
            <p>Для завершения регистрации необходимо подтвердить:</p>
            {!verificationStatus.email && (
              <div className="space-y-2">
                <p className="font-medium">Email адрес</p>
                <Button type="button" variant="outline" onClick={handleResendEmailVerification} className="w-full">
                  Отправить письмо снова
                </Button>
              </div>
            )}
            {!verificationStatus.phone && (
              <div className="space-y-2">
                <p className="font-medium">Номер телефона</p>
                <Button type="button" variant="outline" onClick={handleResendPhoneVerification} className="w-full">
                  Отправить SMS снова
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Имя *</Label>
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
          <Label>Роль *</Label>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={selectedRole === 'buyer' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('buyer')}
              disabled={isLoading}
              className="flex-1"
            >
              Покупатель
            </Button>
            <Button
              type="button"
              variant={selectedRole === 'seller' ? 'default' : 'outline'}
              onClick={() => setSelectedRole('seller')}
              disabled={isLoading}
              className="flex-1"
            >
              Продавец
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {selectedRole === 'buyer' 
              ? 'Покупатели могут заказывать товары и отслеживать доставку'
              : 'Продавцы могут добавлять товары и управлять заказами'
            }
          </p>
        </div>

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
            placeholder="Минимум 8 символов"
            {...register('password')}
            className={errors.password ? 'border-destructive' : ''}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="accept_terms"
            {...register('accept_terms')}
          />
          <Label htmlFor="accept_terms" className="text-sm">
            Я принимаю <a href="/terms" className="text-primary hover:underline">условия использования</a>
          </Label>
        </div>
        {errors.accept_terms && (
          <p className="text-sm text-destructive">{errors.accept_terms.message}</p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </motion.div>
  );
} 