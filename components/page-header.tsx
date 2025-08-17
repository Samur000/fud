'use client';

import { usePathname } from 'next/navigation';

export function PageHeader() {
  const pathname = usePathname();
  
  const getTitle = () => {
    switch (pathname) {
      case '/':
        return 'Каталог';
      case '/search':
        return 'Поиск';
      case '/cart':
        return 'Корзина';
      case '/account':
        return 'Профиль';
      case '/auth':
        return 'Авторизация';
      default:
        return 'FoodCity';
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-border px-4 py-2 md:hidden">
      <h1 className="text-lg font-semibold text-center">{getTitle()}</h1>
    </div>
  );
}
