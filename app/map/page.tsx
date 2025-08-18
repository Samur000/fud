'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, ShoppingBasket, Star } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

interface MarketPoint {
  id: string;
  name: string;
  category: string;
  rating: number;
  products: number;
  x: number; // 0..100 (% of width)
  y: number; // 0..100 (% of height)
}

const mockMarketPoints: MarketPoint[] = [
  { id: 'v1', name: 'Овощи от Ивана', category: 'Овощи', rating: 4.7, products: 42, x: 18, y: 30 },
  { id: 'v2', name: 'Фрукты Анны', category: 'Фрукты', rating: 4.9, products: 38, x: 46, y: 22 },
  { id: 'v3', name: 'Зелень фермерская', category: 'Зелень', rating: 4.6, products: 21, x: 70, y: 40 },
  { id: 'v4', name: 'Ягоды и мёд', category: 'Ягоды', rating: 4.8, products: 17, x: 32, y: 62 },
  { id: 'v5', name: 'Экопродукты', category: 'Эко', rating: 4.5, products: 29, x: 75, y: 70 },
];

export default function MapPage() {
  const { user, isAuthenticated } = useAppStore();
  const [selected, setSelected] = useState<MarketPoint | null>(null);

  if (!isAuthenticated || user?.role !== 'buyer') {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">Только для покупателей</h1>
            <p className="text-muted-foreground mb-6">
              Авторизуйтесь как покупатель, чтобы видеть карту рынка
            </p>
            <Link href="/auth">
              <Button>Войти</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="md:col-span-2 overflow-hidden">
            <CardHeader>
              <CardTitle>Рынок — схема павильонов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[440px] md:h-[560px] rounded-xl border bg-muted/30 overflow-hidden">
                {/* mock floor plan */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2 p-3 opacity-60">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border" />
                  ))}
                </div>

                {/* points */}
                {mockMarketPoints.map((p) => (
                  <button
                    key={p.id}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group`}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    onClick={() => setSelected(p)}
                    aria-label={`${p.name}, категория ${p.category}`}
                  >
                    <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-lg">
                      <MapPin className="w-5 h-5" />
                      <span className="absolute -bottom-5 whitespace-nowrap text-xs bg-black/80 text-white rounded px-2 py-0.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                        {p.name}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Точки продажи</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockMarketPoints.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full text-left p-3 border rounded-lg hover:bg-accent transition ${
                    selected?.id === p.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {p.rating}</span>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <ShoppingBasket className="w-3 h-3" /> {p.products}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}

              {selected && (
                <div className="mt-4 p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{selected.name}</div>
                      <div className="text-sm text-muted-foreground">{selected.category}</div>
                    </div>
                    <Badge>
                      <Star className="w-3 h-3 mr-1" /> {selected.rating}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link href={`/vendor/${selected.id}`}>
                      <Button variant="outline" className="w-full">В магазин</Button>
                    </Link>
                    <Link href={`/search?q=${encodeURIComponent(selected.name)}`}>
                      <Button className="w-full">Товары</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


