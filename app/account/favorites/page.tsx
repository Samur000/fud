'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ShoppingCart, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { PriceTag } from '@/components/ui/price-tag';
import { UnitSelector } from '@/components/ui/unit-selector';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import Link from 'next/link';

// Моковые избранные товары
const mockFavorites = [
  {
    id: '1',
    name: 'Свежие помидоры',
    description: 'Сочные красные помидоры с грядки',
    price: 120,
    unit: 'kg' as const,
    category: 'Овощи',
    vendorId: '1',
    vendorName: 'Ферма "Солнечная"',
    vendorRating: 4.8,
    vendorReturnRate: 2.1,
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ffZBfb7j9SDJKiFSTs2Bcg-4Pk3lG4_Yqg&s'],
    inStock: true,
    weightRange: 'Фактический вес может отличаться ±5%',
  },
  {
    id: '2',
    name: 'Зеленые яблоки',
    description: 'Кисло-сладкие яблоки сорта Гренни Смит',
    price: 89,
    unit: 'kg' as const,
    category: 'Фрукты',
    vendorId: '2',
    vendorName: 'Сад "Яблочный рай"',
    vendorRating: 4.6,
    vendorReturnRate: 1.8,
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Свежий укроп',
    description: 'Ароматная зелень для ваших блюд',
    price: 45,
    unit: 'piece' as const,
    category: 'Зелень',
    vendorId: '3',
    vendorName: 'Теплица "Зеленая"',
    vendorRating: 4.9,
    vendorReturnRate: 0.5,
    images: ['https://images.unsplash.com/photo-1628557044824-f9c5b5c0b5b5?w=400'],
    inStock: false,
  },
];

export default function FavoritesPage() {
  const { user, isAuthenticated, addToCart } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(mockFavorites);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">Войдите в аккаунт</h1>
            <p className="text-muted-foreground mb-6">
              Для просмотра избранного необходимо авторизоваться
            </p>
            <Link href="/auth">
              <Button>Войти</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredFavorites = favorites.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: typeof mockFavorites[0]) => {
    const quantity = quantities[product.id] || 1;
    addToCart({
      productId: product.id,
      quantity,
      unit: product.unit,
    });
  };

  const handleRemoveFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/account">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold">Избранное</h1>
                <p className="text-muted-foreground">Ваши любимые товары</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Поиск в избранном..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>

          {/* Favorites */}
          {filteredFavorites.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery ? 'Товары не найдены' : 'Избранное пусто'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Попробуйте изменить поисковый запрос'
                    : 'Добавляйте товары в избранное для быстрого доступа'
                  }
                </p>
                <Link href="/">
                  <Button>Перейти к покупкам</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFavorites.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground">Фото</span>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                          onClick={() => handleRemoveFromFavorites(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
                          <p className="text-xs text-muted-foreground">Продавец: {product.vendorName}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <PriceTag price={product.price} unit={product.unit} weightRange={product.weightRange} />
                          <UnitSelector value={product.unit} onChange={() => {}} disabled />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Количество:</span>
                            <QuantityStepper
                              value={quantities[product.id] || 1}
                              onChange={(value) => handleQuantityChange(product.id, value)}
                              min={product.unit === 'kg' ? 0.1 : 1}
                              step={product.unit === 'kg' ? 0.1 : 1}
                            />
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'В корзину' : 'Нет в наличии'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика избранного</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{favorites.length}</div>
                  <p className="text-sm text-muted-foreground">Всего товаров</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {favorites.filter(item => item.inStock).length}
                  </div>
                  <p className="text-sm text-muted-foreground">В наличии</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {favorites.filter(item => !item.inStock).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Нет в наличии</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
