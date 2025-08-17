'use client';

import { Home, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';

const navItems = [
  { href: '/', icon: Home, label: 'Домой' },
  { href: '/search', icon: Search, label: 'Поиск' },
  { href: '/cart', icon: ShoppingCart, label: 'Корзина' },
  { href: '/account', icon: User, label: 'Профиль' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { cart, isAuthenticated } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isCart = item.href === '/cart';
          const isAccount = item.href === '/account';
          
          // For cart and account, check if user is authenticated
          const href = isAccount && !isAuthenticated ? '/auth' : item.href;
          
          return (
            <Link key={item.href} href={href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isCart && cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 