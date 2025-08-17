'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ArrowLeft, User, Bell, Shield, CreditCard, Globe, Palette, LogOut, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isAuthenticated, setUser, setAuthenticated } = useAppStore();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    orderHistory: false,
    locationSharing: true,
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('ru');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">Войдите в аккаунт</h1>
            <p className="text-muted-foreground mb-6">
              Для доступа к настройкам необходимо авторизоваться
            </p>
            <Link href="/auth">
              <Button>Войти</Button>
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/account">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold">Настройки</h1>
                <p className="text-muted-foreground">Управление аккаунтом и предпочтениями</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Профиль</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} disabled />
                  <p className="text-xs text-muted-foreground">
                    Email подтвержден ✓
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" defaultValue={user.phone} disabled />
                  <p className="text-xs text-muted-foreground">
                    Телефон подтвержден ✓
                  </p>
                </div>
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить изменения
                </Button>
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email уведомления</p>
                    <p className="text-sm text-muted-foreground">Статус заказов и важные обновления</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS уведомления</p>
                    <p className="text-sm text-muted-foreground">Краткие сообщения о доставке</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push уведомления</p>
                    <p className="text-sm text-muted-foreground">Уведомления в браузере</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Маркетинговые рассылки</p>
                    <p className="text-sm text-muted-foreground">Акции и специальные предложения</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Конфиденциальность</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Публичный профиль</p>
                    <p className="text-sm text-muted-foreground">Показывать профиль другим пользователям</p>
                  </div>
                  <Switch
                    checked={privacy.profileVisible}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisible: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">История заказов</p>
                    <p className="text-sm text-muted-foreground">Доступ к истории заказов</p>
                  </div>
                  <Switch
                    checked={privacy.orderHistory}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, orderHistory: checked }))}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Геолокация</p>
                    <p className="text-sm text-muted-foreground">Использовать местоположение для доставки</p>
                  </div>
                  <Switch
                    checked={privacy.locationSharing}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, locationSharing: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Внешний вид</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Тема оформления</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('light')}
                    >
                      Светлая
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('dark')}
                    >
                      Темная
                    </Button>
                    <Button
                      variant={theme === 'auto' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTheme('auto')}
                    >
                      Авто
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Язык интерфейса</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={language === 'ru' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('ru')}
                    >
                      Русский
                    </Button>
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('en')}
                    >
                      English
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Безопасность</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Изменить пароль
                </Button>
                <Button variant="outline" className="justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Способы оплаты
                </Button>
                <Button variant="outline" className="justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Активные сессии
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Двухфакторная аутентификация
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Действия с аккаунтом</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start text-orange-600 hover:text-orange-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Деактивировать аккаунт
                </Button>
                <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить аккаунт
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Внимание: эти действия необратимы. Убедитесь, что вы сохранили все важные данные.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
