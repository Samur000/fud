import { User } from './store';

// Моковые пользователи для демонстрации
export const mockUsers: Record<string, User> = {
  // Продавец
  'seller': {
    id: '1',
    name: 'Алексей Смирнов',
    email: 'qsamur@gmail.com',
    phone: '+79992693793',
    role: 'seller',
    emailVerified: true,
    phoneVerified: true,
    addresses: [
      {
        id: '1',
        city: 'Москва',
        street: 'ул. Тверская',
        house: '15',
        apartment: '42',
        comment: 'Офис продавца',
      },
    ],
    orders: [
      {
        id: '1',
        status: 'delivered',
        total: 2500,
        date: '2024-01-15',
        items: 5,
      },
      {
        id: '2',
        status: 'delivering',
        total: 1800,
        date: '2024-01-20',
        items: 3,
      },
    ],
  },
  
  // Покупатель
  'buyer': {
    id: '2',
    name: 'Мария Иванова',
    email: 'qsamur2@gmail.com',
    phone: '+79998887766',
    role: 'buyer',
    emailVerified: true,
    phoneVerified: true,
    addresses: [
      {
        id: '1',
        city: 'Москва',
        street: 'ул. Арбат',
        house: '25',
        apartment: '10',
        comment: 'Домой',
      },
      {
        id: '2',
        city: 'Москва',
        street: 'ул. Новый Арбат',
        house: '30',
        apartment: '15',
        comment: 'Офис',
      },
    ],
    orders: [
      {
        id: '1',
        status: 'delivered',
        total: 1250,
        date: '2024-01-15',
        items: 3,
      },
      {
        id: '2',
        status: 'delivering',
        total: 890,
        date: '2024-01-20',
        items: 2,
      },
      {
        id: '3',
        status: 'confirmed',
        total: 2100,
        date: '2024-01-22',
        items: 5,
      },
    ],
  },
};

// Функция для проверки учетных данных
export function validateCredentials(email: string, phone: string, password: string): User | null {
  // Продавец
  if (email === 'qsamur@gmail.com' && phone === '+79992693793' && password === 'yesyesNONO13@#') {
    return mockUsers.seller;
  }
  
  // Покупатель
  if (email === 'qsamur2@gmail.com' && phone === '+79998887766' && password === 'nonoYESYES13@#') {
    return mockUsers.buyer;
  }
  
  return null;
}
