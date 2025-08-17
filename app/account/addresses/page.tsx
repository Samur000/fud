'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2, ArrowLeft, Home, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function AddressesPage() {
  const { user, isAuthenticated } = useAppStore();
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">Войдите в аккаунт</h1>
            <p className="text-muted-foreground mb-6">
              Для управления адресами необходимо авторизоваться
            </p>
            <Link href="/auth">
              <Button>Войти</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getAddressIcon = (comment: string) => {
    if (comment?.toLowerCase().includes('домой') || comment?.toLowerCase().includes('дом')) {
      return Home;
    }
    if (comment?.toLowerCase().includes('офис') || comment?.toLowerCase().includes('работа')) {
      return Building;
    }
    return MapPin;
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
                <h1 className="text-2xl font-semibold">Адреса доставки</h1>
                <p className="text-muted-foreground">Управление адресами доставки</p>
              </div>
            </div>
            <Link href="/account/addresses/add">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Добавить адрес
              </Button>
            </Link>
          </div>

          {/* Addresses */}
          {user.addresses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Адресов не найдено</h3>
                <p className="text-muted-foreground mb-4">
                  Добавьте адрес доставки для быстрого оформления заказов
                </p>
                <Link href="/account/addresses/add">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить первый адрес
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.addresses.map((address, index) => {
                const AddressIcon = getAddressIcon(address.comment || '');
                
                return (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <AddressIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {address.comment || `Адрес ${index + 1}`}
                              </h3>
                              {index === 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  Основной
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingAddress(address.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p className="font-medium">
                            {address.city}, {address.street}, д. {address.house}
                          </p>
                          {address.apartment && (
                            <p className="text-muted-foreground">
                              Квартира: {address.apartment}
                            </p>
                          )}
                          {address.comment && (
                            <p className="text-muted-foreground">
                              {address.comment}
                            </p>
                          )}
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            Использовать
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Копировать
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Советы по адресам</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">1</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Добавьте несколько адресов для удобства доставки в разные места
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-medium">2</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Первый адрес автоматически становится основным адресом доставки
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
