'use client';

import { User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

export function AppHeader() {
  const { cart, isAuthenticated, user } = useAppStore();
  const pathname = usePathname();

  const getTitle = () => {
    switch (pathname) {
      case '/':
        return 'Каталог';
      case '/search':
        return 'Поиск';
      case '/map':
        return 'Карта рынка';
      case '/cart':
        return 'Корзина';
      case '/account':
        return 'Профиль';
      case '/auth':
        return 'Авторизация';
      case '/seller':
        return 'Панель продавца';
      default:
        if (pathname?.startsWith('/vendor/')) return 'Магазин продавца';
        return 'FoodCity';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-lg text-foreground">FoodCity</span>
          {user && (
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
              {user.role === 'seller' ? 'Продавец' : 'Покупатель'}
            </span>
          )}
        </Link>
        
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-medium text-foreground">
          {getTitle()}
        </h1>
        
        <div className="flex items-center space-x-2">
          {user?.role === 'buyer' && (
            <Link href="/cart">
              <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors relative">
                <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </Link>
          )}
          
          <Link href={isAuthenticated ? "/account" : "/auth"}>
            <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors">
              <User className="w-5 h-5 text-muted-foreground" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
} 