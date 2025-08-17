'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function AddAddressPage() {
  const { user, isAuthenticated } = useAppStore();
  const [formData, setFormData] = useState({
    city: '',
    street: '',
    house: '',
    apartment: '',
    comment: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">Войдите в аккаунт</h1>
            <p className="text-muted-foreground mb-6">
              Для добавления адреса необходимо авторизоваться
            </p>
            <Link href="/auth">
              <Button>Войти</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация сохранения адреса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Перенаправляем обратно на страницу адресов
    window.location.href = '/account/addresses';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href="/account/addresses">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">Добавить адрес</h1>
              <p className="text-muted-foreground">Новый адрес доставки</p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Информация об адресе</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Город *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Москва"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Улица *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      placeholder="ул. Тверская"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="house">Дом *</Label>
                    <Input
                      id="house"
                      value={formData.house}
                      onChange={(e) => handleInputChange('house', e.target.value)}
                      placeholder="15"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Квартира</Label>
                    <Input
                      id="apartment"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                      placeholder="42"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    placeholder="Например: домой, офис, код домофона 1234"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Укажите тип адреса или дополнительную информацию для курьера
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Link href="/account/addresses" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Отмена
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Сохранение...' : 'Сохранить адрес'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Советы по заполнению</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Укажите точный адрес для корректной доставки
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  В комментарии укажите код домофона или этаж, если необходимо
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Используйте комментарии для обозначения типа адреса (домой, офис, дача)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
