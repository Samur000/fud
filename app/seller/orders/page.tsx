'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, AlertCircle, ArrowLeft, Filter, Search, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

// Моковые заказы для продавца
const mockSellerOrders = [
  {
    id: '1',
    customerName: 'Мария Иванова',
    customerPhone: '+79998887766',
    status: 'delivered',
    total: 2500,
    date: '2024-01-15',
    items: [
      { name: 'Свежие помидоры', quantity: 2, unit: 'kg', price: 120 },
      { name: 'Зеленые яблоки', quantity: 1.5, unit: 'kg', price: 89 },
    ],
    deliveryAddress: 'Москва, ул. Арбат, д. 25, кв. 10',
    deliveryMethod: 'delivery' as const,
    paymentMethod: 'card' as const,
  },
  {
    id: '2',
    customerName: 'Анна Петрова',
    customerPhone: '+79995554433',
    status: 'delivering',
    total: 1800,
    date: '2024-01-20',
    items: [
      { name: 'Свежий укроп', quantity: 3, unit: 'piece', price: 45 },
      { name: 'Свежие помидоры', quantity: 1, unit: 'kg', price: 120 },
    ],
    deliveryAddress: 'Москва, ул. Тверская, д. 15, кв. 42',
    deliveryMethod: 'delivery' as const,
    paymentMethod: 'cash' as const,
  },
  {
    id: '3',
    customerName: 'Иван Сидоров',
    customerPhone: '+79992221100',
    status: 'preparing',
    total: 3200,
    date: '2024-01-22',
    items: [
      { name: 'Зеленые яблоки', quantity: 2, unit: 'kg', price: 89 },
      { name: 'Свежие помидоры', quantity: 2.5, unit: 'kg', price: 120 },
      { name: 'Свежий укроп', quantity: 2, unit: 'piece', price: 45 },
    ],
    deliveryAddress: 'Москва, ул. Новый Арбат, д. 30, кв. 15',
    deliveryMethod: 'pickup' as const,
    paymentMethod: 'transfer' as const,
  },
  {
    id: '4',
    customerName: 'Елена Козлова',
    customerPhone: '+79998889999',
    status: 'confirmed',
    total: 890,
    date: '2024-01-23',
    items: [
      { name: 'Свежий укроп', quantity: 2, unit: 'piece', price: 45 },
    ],
    deliveryAddress: 'Москва, ул. Покровка, д. 10, кв. 5',
    deliveryMethod: 'delivery' as const,
    paymentMethod: 'card' as const,
  },
];

const orderStatuses = {
  pending: { label: 'Ожидает подтверждения', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  confirmed: { label: 'Подтвержден', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  preparing: { label: 'Готовится', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  delivering: { label: 'Доставляется', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
  delivered: { label: 'Доставлен', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  cancelled: { label: 'Отменен', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function SellerOrdersPage() {
  const { user, isAuthenticated } = useAppStore();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders] = useState(mockSellerOrders);

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

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus ? order.status === selectedStatus : true;
    const matchesSearch = searchQuery 
      ? order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.includes(searchQuery) ||
        order.customerPhone.includes(searchQuery)
      : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/seller">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold">Все заказы</h1>
                <p className="text-muted-foreground">Управление заказами клиентов</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Поиск по клиенту или номеру заказа..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Фильтры</span>
              </CardTitle>
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
                  {selectedStatus || searchQuery
                    ? 'Попробуйте изменить фильтры или поисковый запрос'
                    : 'У вас пока нет заказов'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const statusConfig = orderStatuses[order.status as keyof typeof orderStatuses];
                const StatusIcon = statusConfig?.icon || Package;
                
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
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
                                Клиент: {order.customerName} • {order.customerPhone}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.date} • {order.items.length} товар{order.items.length !== 1 ? 'а' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {order.total.toLocaleString('ru-RU')} ₽
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.paymentMethod === 'card' ? 'Карта' : 
                               order.paymentMethod === 'cash' ? 'Наличные' : 'Перевод'}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between text-sm">
                              <span>{item.name} × {item.quantity} {item.unit}</span>
                              <span>{item.price.toLocaleString('ru-RU')} ₽</span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-muted/50 rounded-lg p-3 mb-4">
                          <p className="text-sm font-medium mb-1">
                            {order.deliveryMethod === 'delivery' ? 'Доставка' : 'Самовывоз'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.deliveryAddress}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Link href={`/seller/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Подробнее
                            </Button>
                          </Link>
                          <Link href={`/seller/orders/${order.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Редактировать
                            </Button>
                          </Link>
                          {order.status === 'confirmed' && (
                            <Button size="sm">
                              <Package className="h-4 w-4 mr-2" />
                              Начать подготовку
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button size="sm">
                              <Truck className="h-4 w-4 mr-2" />
                              Отправить на доставку
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{orders.length}</div>
                  <p className="text-sm text-muted-foreground">Всего заказов</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {orders.filter(o => o.status === 'confirmed' || o.status === 'preparing').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Активные</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'delivered').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Выполненные</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('ru-RU')} ₽
                  </div>
                  <p className="text-sm text-muted-foreground">Общая выручка</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
