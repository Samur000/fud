'use client';

import { useState } from 'react';
import { Star, ArrowLeft, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';



export default function OrderReviewPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAppStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">Войдите в аккаунт</h1>
            <p className="text-muted-foreground mb-6">
              Для оставления отзыва необходимо авторизоваться
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
    if (rating === 0) return;
    
    setIsLoading(true);
    // Имитация отправки отзыва
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Перенаправляем обратно к заказу
    window.location.href = `/order/${params.id}`;
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Link href={`/order/${params.id}`}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold">Оставить отзыв</h1>
              <p className="text-muted-foreground">Заказ #{params.id}</p>
            </div>
          </div>

          {/* Review Form */}
          <Card>
            <CardHeader>
              <CardTitle>Ваша оценка</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <Label>Оценка *</Label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-lg transition-colors ${
                          star <= rating 
                            ? 'text-yellow-500 bg-yellow-50' 
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="h-8 w-8 fill-current" />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rating === 0 && 'Выберите оценку'}
                    {rating === 1 && 'Ужасно'}
                    {rating === 2 && 'Плохо'}
                    {rating === 3 && 'Удовлетворительно'}
                    {rating === 4 && 'Хорошо'}
                    {rating === 5 && 'Отлично'}
                  </p>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий</Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Расскажите о вашем опыте с заказом..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Поделитесь впечатлениями о качестве товаров, доставке и обслуживании
                  </p>
                </div>

                {/* Submit */}
                <div className="flex space-x-4">
                  <Link href={`/order/${params.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Отмена
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isLoading || rating === 0}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? 'Отправка...' : 'Отправить отзыв'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Советы для хорошего отзыва</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Опишите качество полученных товаров
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Расскажите о скорости и качестве доставки
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">3</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Упомяните о работе службы поддержки, если обращались
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
