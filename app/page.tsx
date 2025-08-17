'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceTag } from '@/components/ui/price-tag';
import { UnitSelector } from '@/components/ui/unit-selector';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { useAppStore } from '@/lib/store';
import { Product } from '@/lib/store';
import { ProductUnit } from '@/lib/zod-schemas';
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

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'овощи', name: 'Овощи' },
  { id: 'фрукты', name: 'Фрукты' },
  { id: 'зелень', name: 'Зелень' },
];

export default function HomePage() {
  const { cart, addToCart, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, isAuthenticated } = useAppStore();
  const [selectedProducts, setSelectedProducts] = useState<Record<string, { unit: ProductUnit; quantity: number }>>({});

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }

    const selected = selectedProducts[product.id];
    if (!selected) return;

    addToCart({
      productId: product.id,
      quantity: selected.quantity,
      unit: selected.unit,
    });
  };

  const handleUnitChange = (productId: string, unit: ProductUnit) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: { ...prev[productId], unit },
    }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: { ...prev[productId], quantity },
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      {/* Search Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-border p-4 md:top-16">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Категории</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Popular/Banners */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Популярные</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-800">Свежие овощи</h3>
                <p className="text-sm text-green-600">Скидка 15% на все овощи</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <h3 className="font-semibold text-orange-800">Фрукты недели</h3>
                <p className="text-sm text-orange-600">Лучшие цены на фрукты</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Products */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Товары</h2>
          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Товары не найдены</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-3">
                      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground">Фото</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-base">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <PriceTag
                          price={product.price}
                          unit={product.unit}
                          weightRange={product.weightRange}
                        />
                        <div className="text-right">
                          <div className="text-sm font-medium">{product.vendorName}</div>
                          <div className="text-xs text-muted-foreground">
                            ⭐ {product.vendorRating} ({product.vendorReturnRate}% возвратов)
                          </div>
                        </div>
                      </div>

                      <UnitSelector
                        value={selectedProducts[product.id]?.unit || product.unit}
                        onChange={(unit) => handleUnitChange(product.id, unit)}
                      />

                      <QuantityStepper
                        value={selectedProducts[product.id]?.quantity || 1}
                        onChange={(quantity) => handleQuantityChange(product.id, quantity)}
                        min={product.unit === 'kg' ? 0.1 : 1}
                        step={product.unit === 'kg' ? 0.1 : 1}
                      />

                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="w-full"
                      >
                        {product.inStock ? 'В корзину' : 'Нет в наличии'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 