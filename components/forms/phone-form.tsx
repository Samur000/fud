'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { phoneSchema, type PhoneFormData } from '@/lib/zod-schemas';
import { authClient } from '@/lib/auth-client';
import { useToastContext } from '@/components/toast-provider';

interface PhoneFormProps {
  onSuccess: (requestId: string, mask: string) => void;
}

export function PhoneForm({ onSuccess }: PhoneFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const onSubmit = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      const response = await authClient.requestOtp({
        phone: data.phone,
        purpose: 'login',
        channel: 'sms',
      });
      
      onSuccess(response.request_id, response.mask);
    } catch (err: any) {
      const errorMessage = err.message || 'Произошла ошибка при отправке кода';
      
      if (err.message?.includes('INVALID_PHONE')) {
        setError('phone', { message: 'Неверный формат номера телефона' });
      } else if (err.message?.includes('RATE_LIMITED')) {
        showError('Слишком много попыток', 'Попробуйте позже');
      } else if (err.message?.includes('PHONE_BLOCKED')) {
        showError('Номер заблокирован', 'Обратитесь в поддержку');
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Номер телефона</Label>
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

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Отправка...' : 'Получить код'}
        </Button>
      </form>
    </motion.div>
  );
} 