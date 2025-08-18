'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Store, Star, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const vendorMock = {
  v1: { id: 'v1', name: 'Овощи от Ивана', rating: 4.7, returnRate: 1.2, description: 'Свежие овощи каждый день от местных фермеров.' },
  v2: { id: 'v2', name: 'Фрукты Анны', rating: 4.9, returnRate: 0.9, description: 'Отборные фрукты, спелые и ароматные.' },
  v3: { id: 'v3', name: 'Зелень фермерская', rating: 4.6, returnRate: 1.5, description: 'Зелень и пряные травы, выращенные с заботой.' },
  v4: { id: 'v4', name: 'Ягоды и мёд', rating: 4.8, returnRate: 1.1, description: 'Сезонные ягоды и натуральный мёд.' },
  v5: { id: 'v5', name: 'Экопродукты', rating: 4.5, returnRate: 1.8, description: 'Эко‑friendly ассортимент и фермерские продукты.' },
} as const;

export default function VendorPage({ params }: { params: { id: string } }) {
  const vendor = useMemo(() => vendorMock[params.id as keyof typeof vendorMock], [params.id]);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Магазин не найден</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Такого продавца нет. Вернитесь на карту или в поиск.</p>
              <div className="flex gap-2">
                <Link href="/map"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> На карту</Button></Link>
                <Link href="/search"><Button>В поиск</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/map">
            <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="text-2xl font-semibold">{vendor.name}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" /> Магазин продавца
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{vendor.description}</p>
            <div className="flex items-center gap-4">
              <Badge><Star className="w-3 h-3 mr-1" /> {vendor.rating}</Badge>
              <Badge variant="secondary">Возвраты: {vendor.returnRate}%</Badge>
            </div>
            <div className="flex gap-2">
              <Link href={`/search?q=${encodeURIComponent(vendor.name)}`}>
                <Button>Товары продавца</Button>
              </Link>
              <Link href={`/search?q=${encodeURIComponent('акции ' + vendor.name)}`}>
                <Button variant="outline">Акции</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


