'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { Product } from '@/lib/store';
import { ProductUnit } from '@/lib/zod-schemas';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { UnitSelector } from '@/components/ui/unit-selector';
import Link from 'next/link';

// Mock data for MVP
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Помидоры черри',
    description: 'Свежие помидоры черри из теплицы',
    price: 250,
    unit: 'kg',
    category: 'овощи',
    vendorId: '1',
    vendorName: 'Овощной рай',
    vendorRating: 4.8,
    vendorReturnRate: 2.1,
    images: ['https://dobryanka-rus.ru/storage/goods/20248_IagLD.jpg'],
    inStock: true,
    weightRange: 'Фактический вес может отличаться ±5%',
  },
  {
    id: '2',
    name: 'Яблоки Голден',
    description: 'Сладкие яблоки сорта Голден',
    price: 180,
    unit: 'kg',
    category: 'фрукты',
    vendorId: '2',
    vendorName: 'Фруктовый сад',
    vendorRating: 4.6,
    vendorReturnRate: 1.8,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ffZBfb7j9SDJKiFSTs2Bcg-4Pk3lG4_Yqg&s'],
    inStock: true,
    weightRange: 'Фактический вес может отличаться ±5%',
  },
  {
    id: '3',
    name: 'Укроп свежий',
    description: 'Свежий укроп с грядки',
    price: 120,
    unit: 'piece',
    category: 'зелень',
    vendorId: '1',
    vendorName: 'Овощной рай',
    vendorRating: 4.8,
    vendorReturnRate: 2.1,
    images: ['https://tsx.x5static.net/i/800x800-fit/xdelivery/files/f0/d3/10f91c162fd0abae66e83a032f72.jpg'],
    inStock: true,
  },
];

export default function CartPage() {
  const { cart, removeFromCart, updateCartItem, isAuthenticated } = useAppStore();
  const [itemComments, setItemComments] = useState<Record<string, string>>({});

  // Group cart items by vendor
  const cartByVendor = cart.reduce((acc, item) => {
    const product = mockProducts.find(p => p.id === item.productId);
    if (!product) return acc;

    const vendorId = product.vendorId;
    if (!acc[vendorId]) {
      acc[vendorId] = {
        vendorName: product.vendorName,
        items: [],
        total: 0,
      };
    }

    const itemTotal = product.price * item.quantity;
    acc[vendorId].items.push({ ...item, product, itemTotal });
    acc[vendorId].total += itemTotal;

    return acc;
  }, {} as Record<string, { vendorName: string; items: any[]; total: number }>);

  const totalCartValue = Object.values(cartByVendor).reduce((sum, vendor) => sum + vendor.total, 0);

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateCartItem(productId, quantity);
  };

  const handleCommentChange = (productId: string, comment: string) => {
    setItemComments(prev => ({
      ...prev,
      [productId]: comment,
    }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Корзина пуста</h2>
            <p className="text-muted-foreground mb-6">
              Добавьте товары в корзину, чтобы оформить заказ
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Перейти к покупкам
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Корзина</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Продолжить покупки
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(cartByVendor).map(([vendorId, vendor]) => (
              <Card key={vendorId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{vendor.vendorName}</span>
                    <span className="text-lg font-semibold">
                      {vendor.total.toLocaleString('ru-RU')} ₽
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vendor.items.map((item) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden relative flex-shrink-0">
                        {item.product.images && item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">Фото</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <UnitSelector
                              value={item.unit}
                              onChange={(unit) => {
                                // Update cart item with new unit
                                updateCartItem(item.productId, item.quantity);
                              }}
                            />

                            <QuantityStepper
                              value={item.quantity}
                              onChange={(quantity) => handleQuantityChange(item.productId, quantity)}
                              min={item.unit === 'kg' ? 0.1 : 1}
                              step={item.unit === 'kg' ? 0.1 : 1}
                            />
                          </div>

                          <div className="text-right">
                            <div className="font-semibold">
                              {item.itemTotal.toLocaleString('ru-RU')} ₽
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.product.price.toLocaleString('ru-RU')} ₽/{item.unit === 'kg' ? 'кг' : item.unit === 'piece' ? 'шт' : 'короб'}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Input
                            placeholder="Комментарий к позиции (необязательно)"
                            value={itemComments[item.productId] || ''}
                            onChange={(e) => handleCommentChange(item.productId, e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Итого заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {Object.entries(cartByVendor).map(([vendorId, vendor]) => (
                    <div key={vendorId} className="flex justify-between text-sm">
                      <span>{vendor.vendorName}</span>
                      <span>{vendor.total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Общий итого</span>
                    <span>{totalCartValue.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  Оформить заказ
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground text-center">
                    Для оформления заказа необходимо войти в систему
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
