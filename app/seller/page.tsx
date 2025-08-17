'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, TrendingUp, Users, Settings, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function SellerPage() {
  const { user, setUser, setAuthenticated } = useAppStore();
  const [stats] = useState({
    totalSales: 125000,
    thisMonth: 25000,
    totalOrders: 45,
    activeOrders: 8,
  });

  const handleLogout = () => {
    setUser(null);
    setAuthenticated(false);
    localStorage.removeItem('fudsiti-store');
    window.location.href = '/auth';
  };

  if (!user || user.role !== 'seller') {
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

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Панель продавца</h1>
              <p className="text-muted-foreground">Добро пожаловать, {user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общие продажи</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSales.toLocaleString('ru-RU')} ₽</div>
                <p className="text-xs text-muted-foreground">
                  +12% с прошлого месяца
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Продажи за месяц</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisMonth.toLocaleString('ru-RU')} ₽</div>
                <p className="text-xs text-muted-foreground">
                  +8% с прошлой недели
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  За все время
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные заказы</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Требуют внимания
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление товарами</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/seller/products">
                  <Button className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Мои товары
                  </Button>
                </Link>
                <Link href="/seller/products/add">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Добавить товар
                  </Button>
                </Link>
                <Link href="/seller/categories">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Категории
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Управление заказами</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/seller/orders">
                  <Button className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Все заказы
                  </Button>
                </Link>
                <Link href="/seller/orders/active">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Активные заказы
                  </Button>
                </Link>
                <Link href="/seller/orders/completed">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Выполненные
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Последние заказы</CardTitle>
            </CardHeader>
            <CardContent>
              {user.orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  У вас пока нет заказов
                </p>
              ) : (
                <div className="space-y-4">
                  {user.orders.slice(0, 5).map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">Заказ #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items} товар{order.items !== 1 ? 'а' : ''} • {order.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.total.toLocaleString('ru-RU')} ₽</p>
                        <p className={`text-sm ${
                          order.status === 'delivered' ? 'text-green-600' :
                          order.status === 'delivering' ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          {order.status === 'delivered' ? 'Доставлен' :
                           order.status === 'delivering' ? 'Доставляется' :
                           'Подтвержден'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Link href="/seller/orders">
                  <Button variant="outline" className="w-full">
                    Все заказы
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/seller/profile">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Редактировать профиль
                </Button>
              </Link>
              <Link href="/seller/finance">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Финансы и выплаты
                </Button>
              </Link>
              <Link href="/seller/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Аналитика продаж
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
