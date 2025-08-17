'use client';

import { ProductUnit } from '@/lib/zod-schemas';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  unit: ProductUnit;
  weightRange?: string;
  className?: string;
}

const unitLabels: Record<ProductUnit, string> = {
  kg: 'кг',
  piece: 'шт',
  box: 'короб',
};

export function PriceTag({ price, unit, weightRange, className }: PriceTagProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="text-lg font-semibold">
        {price.toLocaleString('ru-RU')} ₽/{unitLabels[unit]}
      </div>
      {unit === 'kg' && weightRange && (
        <div className="text-xs text-muted-foreground">
          {weightRange}
        </div>
      )}
    </div>
  );
} 