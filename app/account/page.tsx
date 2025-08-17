'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Heart, Settings, LogOut, Bell, CreditCard, ArrowRight, Shield, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isAuthenticated, setUser, setAuthenticated } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Войдите в аккаунт</h1>
            <p className="text-muted-foreground mb-6">
              Для доступа к профилю необходимо авторизоваться
            </p>
            <Link href="/auth">
              <Button size="lg" className="w-full">
                Войти
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setUser(null);
    setAuthenticated(false);
    localStorage.removeItem('fudsiti-store');
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-muted-foreground">{user.phone}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">
                      {user.role === 'seller' ? 'Продавец' : 'Покупатель'}
                    </Badge>
                    {user.emailVerified && (
                      <Badge variant="outline" className="text-green-600">
                        Email ✓
                      </Badge>
                    )}
                    {user.phoneVerified && (
                      <Badge variant="outline" className="text-green-600">
                        Телефон ✓
                      </Badge>
                    )}
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/account/orders">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Package className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">История заказов</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.orders.length} заказ{user.orders.length !== 1 ? 'ов' : ''}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/account/addresses">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <MapPin className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Адреса доставки</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.addresses.length} адрес{user.addresses.length !== 1 ? 'ов' : ''}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/account/favorites">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Heart className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Избранное</h3>
                  <p className="text-sm text-muted-foreground">
                    Любимые товары
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/account/settings">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Settings className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-medium">Настройки</h3>
                  <p className="text-sm text-muted-foreground">
                    Управление аккаунтом
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Последние заказы</CardTitle>
              <Link href="/account/orders">
                <Button variant="outline" size="sm">
                  Все заказы
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {user.orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  У вас пока нет заказов
                </p>
              ) : (
                <div className="space-y-4">
                  {user.orders.slice(0, 3).map((order) => (
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
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Адреса доставки</CardTitle>
              <Link href="/account/addresses">
                <Button variant="outline" size="sm">
                  Управление адресами
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {user.addresses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  У вас пока нет сохраненных адресов
                </p>
              ) : (
                <div className="space-y-3">
                  {user.addresses.slice(0, 2).map((address, index) => (
                    <div key={address.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {address.city}, {address.street}, д. {address.house}
                          </p>
                          {address.apartment && (
                            <p className="text-sm text-muted-foreground">
                              Квартира: {address.apartment}
                            </p>
                          )}
                          {address.comment && (
                            <p className="text-sm text-muted-foreground">
                              {address.comment}
                            </p>
                          )}
                        </div>
                      </div>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Основной
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Уведомления</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email уведомления</p>
                    <p className="text-sm text-muted-foreground">Статус заказов и важные обновления</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Включены
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS уведомления</p>
                    <p className="text-sm text-muted-foreground">Краткие сообщения о доставке</p>
                  </div>
                  <Badge variant="outline" className="text-muted-foreground">
                    Отключены
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Помощь и поддержка</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Как отследить заказ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Способы оплаты
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Условия доставки
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  О приложении
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Политика конфиденциальности
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Условия использования
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
