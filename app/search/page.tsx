'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Filter, X, ShoppingCart } from 'lucide-react';
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
  {
    id: '4',
    name: 'Огурцы',
    description: 'Свежие огурцы',
    price: 150,
    unit: 'kg',
    category: 'овощи',
    vendorId: '1',
    vendorName: 'Овощной рай',
    vendorRating: 4.8,
    vendorReturnRate: 2.1,
    images: ['https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400'],
    inStock: true,
    weightRange: 'Фактический вес может отличаться ±5%',
  },
  {
    id: '5',
    name: 'Бананы',
    description: 'Сладкие бананы',
    price: 200,
    unit: 'kg',
    category: 'фрукты',
    vendorId: '2',
    vendorName: 'Фруктовый сад',
    vendorRating: 4.6,
    vendorReturnRate: 1.8,
    images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'],
    inStock: true,
    weightRange: 'Фактический вес может отличаться ±5%',
  },
];

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'овощи', name: 'Овощи' },
  { id: 'фрукты', name: 'Фрукты' },
  { id: 'зелень', name: 'Зелень' },
];

const vendors = [
  { id: 'all', name: 'Все продавцы' },
  { id: '1', name: 'Овощной рай' },
  { id: '2', name: 'Фруктовый сад' },
];

const sortOptions = [
  { id: 'name', name: 'По названию' },
  { id: 'price_asc', name: 'По цене (возрастание)' },
  { id: 'price_desc', name: 'По цене (убывание)' },
  { id: 'rating', name: 'По рейтингу' },
];

export default function SearchPage() {
  const { 
    cart, 
    addToCart, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    isAuthenticated 
  } = useAppStore();
  
  const [selectedProducts, setSelectedProducts] = useState<Record<string, { unit: ProductUnit; quantity: number }>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    vendor: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'name',
  });

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesVendor = filters.vendor === 'all' || product.vendorId === filters.vendor;
    const matchesPrice = (!filters.minPrice || product.price >= Number(filters.minPrice)) &&
                        (!filters.maxPrice || product.price <= Number(filters.maxPrice));
    const matchesStock = !filters.inStock || product.inStock;
    
    return matchesSearch && matchesCategory && matchesVendor && matchesPrice && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.vendorRating - a.vendorRating;
      default:
        return 0;
    }
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

  const clearFilters = () => {
    setFilters({
      category: 'all',
      vendor: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'name',
    });
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
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
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
        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Фильтры</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Очистить
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Категория</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Продавец</label>
                    <select
                      value={filters.vendor}
                      onChange={(e) => setFilters(prev => ({ ...prev, vendor: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      {vendors.map(vendor => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Цена от</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Цена до</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Только в наличии</span>
                  </label>

                  <div>
                    <label className="text-sm font-medium mr-2">Сортировка:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="p-1 border rounded"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Результаты поиска ({sortedProducts.length})
            </h2>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                По запросу: "{searchQuery}"
              </p>
            )}
          </div>

          {sortedProducts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Товары не найдены</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Очистить фильтры
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProducts.map((product) => (
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
