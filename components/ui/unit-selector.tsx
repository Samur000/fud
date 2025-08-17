'use client';

import { ProductUnit } from '@/lib/zod-schemas';
import { Button } from './button';

interface UnitSelectorProps {
  value: ProductUnit;
  onChange: (unit: ProductUnit) => void;
  disabled?: boolean;
}

const unitLabels: Record<ProductUnit, string> = {
  kg: 'кг',
  piece: 'шт',
  box: 'короб',
};

export function UnitSelector({ value, onChange, disabled = false }: UnitSelectorProps) {
  return (
    <div className="flex space-x-1">
      {Object.entries(unitLabels).map(([unit, label]) => (
        <Button
          key={unit}
          type="button"
          variant={value === unit ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(unit as ProductUnit)}
          disabled={disabled}
          className="text-xs"
        >
          {label}
        </Button>
      ))}
    </div>
  );
} 