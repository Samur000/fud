'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { OtpInput } from '@/components/otp-input';
import { otpSchema, type OtpFormData } from '@/lib/zod-schemas';
import { authClient } from '@/lib/auth-client';
import { useToastContext } from '@/components/toast-provider';

interface OtpFormProps {
  requestId: string;
  phoneMask: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OtpForm({ requestId, phoneMask, onSuccess, onBack }: OtpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { success: showSuccess, error: showError } = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const acceptTerms = watch('accept_terms');

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    try {
      await authClient.verifyOtp({
        request_id: requestId,
        code: otpCode,
        remember_me: data.remember_me || false,
        accept_terms: data.accept_terms,
      });
      
      showSuccess('Успешная авторизация', 'Добро пожаловать!');
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.message || 'Произошла ошибка при проверке кода';
      
      if (err.message?.includes('OTP_INVALID')) {
        setError('code', { message: 'Неверный код' });
        setOtpCode('');
      } else if (err.message?.includes('OTP_EXPIRED')) {
        showError('Код истёк', 'Запросите новый код');
        setCanResend(true);
      } else {
        showError('Ошибка', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      // Re-request OTP
      const response = await authClient.requestOtp({
        phone: phoneMask.replace(/\*/g, '0'), // Replace mask with actual phone
        purpose: 'login',
        channel: 'sms',
      });
      
      setCountdown(60);
      setCanResend(false);
      showSuccess('Код отправлен', `SMS отправлено на ${phoneMask}`);
    } catch (err: any) {
      showError('Ошибка', 'Не удалось отправить код повторно');
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
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Код отправлен на {phoneMask}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <Label>Код подтверждения</Label>
            <OtpInput
              value={otpCode}
              onChange={setOtpCode}
              error={!!errors.code}
              disabled={isLoading}
            />
            {errors.code && (
              <p className="text-sm text-destructive text-center">
                {errors.code.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember_me"
                {...register('remember_me')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="remember_me" className="text-sm">
                Запомнить меня
              </Label>
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
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || otpCode.length !== 6 || !acceptTerms}
          >
            {isLoading ? 'Проверка...' : 'Войти'}
          </Button>
        </form>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={!canResend || isLoading}
          >
            {canResend ? 'Отправить код снова' : `Отправить код снова (${countdown}s)`}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBack}
            disabled={isLoading}
          >
            Изменить номер
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 