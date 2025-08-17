'use client';

import { useState } from 'react';
import { Package, Clock, CheckCircle, Truck, AlertCircle, ArrowLeft, MapPin, Phone, Calendar, User, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

const orderStatuses = {
  pending: { label: 'Ожидает подтверждения', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  confirmed: { label: 'Подтвержден', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  preparing: { label: 'Готовится', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  delivering: { label: 'Доставляется', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
  delivered: { label: 'Доставлен', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  cancelled: { label: 'Отменен', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

// Моковые данные заказа для продавца
const mockSellerOrder = {
  id: '1',
  customerName: 'Мария Иванова',
  customerPhone: '+79998887766',
  customerEmail: 'maria@example.com',
  status: 'delivering',
  total: 2500,
  date: '2024-01-15',
  items: [
    { name: 'Свежие помидоры', quantity: 2, unit: 'kg', price: 120, total: 240 },
    { name: 'Зеленые яблоки', quantity: 1.5, unit: 'kg', price: 89, total: 133.5 },
    { name: 'Свежий укроп', quantity: 3, unit: 'piece', price: 45, total: 135 },
  ],
  deliveryAddress: 'Москва, ул. Арбат, д. 25, кв. 10',
  deliveryMethod: 'delivery',
  paymentMethod: 'card',
  estimatedDelivery: '2024-01-16 14:00',
  trackingNumber: 'TRK123456789',
  notes: 'Клиент просит доставить до 15:00',
};

export default function SellerOrderDetailPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAppStore();
  const [order, setOrder] = useState(mockSellerOrder);

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

  const statusConfig = orderStatuses[order.status as keyof typeof orderStatuses];
  const StatusIcon = statusConfig?.icon || Package;

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/seller/orders">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold">Заказ #{order.id}</h1>
                <p className="text-muted-foreground">{order.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={statusConfig?.color}>
                {statusConfig?.label}
              </Badge>
              <Link href={`/seller/orders/${order.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
              </Link>
            </div>
          </div>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Информация о клиенте</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Телефон</p>
                  <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusConfig?.bg}`}>
                  <StatusIcon className={`h-6 w-6 ${statusConfig?.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold">Статус заказа</h3>
                  <p className="text-muted-foreground">{statusConfig?.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Товары в заказе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit} × {item.price} ₽
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.total} ₽</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Итого:</span>
                    <span className="text-xl font-bold">{order.total} ₽</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о доставке</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Адрес доставки</p>
                  <p className="text-muted-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Ожидаемая доставка</p>
                  <p className="text-muted-foreground">{order.estimatedDelivery}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Трек-номер</p>
                  <p className="text-muted-foreground">{order.trackingNumber}</p>
                </div>
              </div>
              {order.notes && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="font-medium text-sm">Примечания:</p>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Информация об оплате</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Способ оплаты:</span>
                <span className="font-medium">
                  {order.paymentMethod === 'card' ? 'Банковская карта' : 
                   order.paymentMethod === 'cash' ? 'Наличные' : 'Банковский перевод'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex space-x-4">
            <Link href="/seller/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                К списку заказов
              </Button>
            </Link>
            {order.status === 'confirmed' && (
              <Button className="flex-1">
                <Package className="h-4 w-4 mr-2" />
                Начать подготовку
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button className="flex-1">
                <Truck className="h-4 w-4 mr-2" />
                Отправить на доставку
              </Button>
            )}
            {order.status === 'delivering' && (
              <Button className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Отметить как доставленный
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
