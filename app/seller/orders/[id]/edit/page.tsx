'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Package, Truck, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAppStore();
  const [status, setStatus] = useState('delivering');
  const [notes, setNotes] = useState('Клиент просит доставить до 15:00');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated || !user || user.role !== 'seller') {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">Доступ запрещен</h1>
            <p className="text-muted-foreground mb-6">
              Эта страница доступна только продавцам
            </p>
            <Link href="/auth">
              <Button>Войти как продавец</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация сохранения изменений
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Перенаправляем обратно к заказу
    window.location.href = `/seller/orders/${params.id}`;
  };

  const statusOptions = [
    { value: 'confirmed', label: 'Подтвержден', icon: CheckCircle },
    { value: 'preparing', label: 'Готовится', icon: Package },
    { value: 'delivering', label: 'Доставляется', icon: Truck },
    { value: 'delivered', label: 'Доставлен', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href={`/seller/orders/${params.id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">Редактировать заказ</h1>
              <p className="text-muted-foreground">Заказ #{params.id}</p>
            </div>
          </div>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Изменение статуса заказа</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Selection */}
                <div className="space-y-2">
                  <Label>Статус заказа</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {statusOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setStatus(option.value)}
                          className={`p-4 border rounded-lg text-left transition-colors ${
                            status === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <span className="font-medium">{option.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Примечания к заказу</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Добавьте примечания к заказу..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Внутренние заметки для работы с заказом
                  </p>
                </div>

                {/* Submit */}
                <div className="flex space-x-4">
                  <Link href={`/seller/orders/${params.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Отмена
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Советы по управлению заказом</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Обновляйте статус заказа своевременно для информирования клиента
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Используйте примечания для важной информации о заказе
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Клиент будет уведомлен об изменении статуса заказа
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
