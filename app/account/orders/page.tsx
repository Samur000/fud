'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, AlertCircle, ArrowLeft } from 'lucide-react';
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

export default function OrdersPage() {
  const { user, isAuthenticated } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">Войдите в аккаунт</h1>
            <p className="text-muted-foreground mb-6">
              Для просмотра истории заказов необходимо авторизоваться
            </p>
            <Link href="/auth">
              <Button>Войти</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = selectedStatus 
    ? user.orders.filter(order => order.status === selectedStatus)
    : user.orders;

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/account">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold">История заказов</h1>
                <p className="text-muted-foreground">Все ваши заказы</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Фильтры</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedStatus === null ? "default" : "outline"}
                  onClick={() => setSelectedStatus(null)}
                  size="sm"
                >
                  Все заказы
                </Button>
                {Object.entries(orderStatuses).map(([status, config]) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    onClick={() => setSelectedStatus(status)}
                    size="sm"
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Заказов не найдено</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedStatus 
                    ? `У вас нет заказов со статусом "${orderStatuses[selectedStatus as keyof typeof orderStatuses]?.label}"`
                    : 'У вас пока нет заказов'
                  }
                </p>
                <Link href="/">
                  <Button>Перейти к покупкам</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusConfig = orderStatuses[order.status as keyof typeof orderStatuses];
                const StatusIcon = statusConfig?.icon || Package;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statusConfig?.bg}`}>
                              <StatusIcon className={`h-6 w-6 ${statusConfig?.color}`} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold">Заказ #{order.id}</h3>
                                <Badge variant="outline" className={statusConfig?.color}>
                                  {statusConfig?.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.items} товар{order.items !== 1 ? 'а' : ''} • {order.date}
                              </p>
                              <p className="text-lg font-semibold">
                                {order.total.toLocaleString('ru-RU')} ₽
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Link href={`/order/${order.id}`}>
                              <Button variant="outline" size="sm">
                                Подробнее
                              </Button>
                            </Link>
                            {order.status === 'delivered' && (
                              <Link href={`/order/${order.id}/review`}>
                                <Button size="sm">
                                  Оставить отзыв
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
