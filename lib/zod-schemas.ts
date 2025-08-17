import { z } from 'zod';

export const phoneSchema = z
	.string()
	.regex(/^\+[1-9]\d{7,14}$/, 'Неверный формат номера телефона (E.164)');

export const emailSchema = z
	.string()
	.email('Введите корректный email адрес')
	.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Неверный формат email');

export const passwordSchema = z
	.string()
	.min(8, 'Пароль должен содержать минимум 8 символов')
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
		'Пароль должен содержать заглавные и строчные буквы, цифры и специальные символы');

export const loginSchema = z.object({
	phone: phoneSchema,
	email: emailSchema,
	password: passwordSchema,
});

export const signupSchema = z.object({
	name: z
		.string()
		.min(2, 'Имя должно содержать минимум 2 символа')
		.max(50, 'Имя не должно превышать 50 символов'),
	phone: phoneSchema,
	email: emailSchema,
	password: passwordSchema,
	accept_terms: z.literal(true, {
		errorMap: () => ({ message: 'Необходимо принять условия использования' }),
	}),
	role: z.enum(['buyer', 'seller'], {
		errorMap: () => ({ message: 'Выберите роль' }),
	}),
});

export const addressSchema = z.object({
	city: z.string().min(1, 'Город обязателен'),
	street: z.string().min(1, 'Улица обязательна'),
	house: z.string().min(1, 'Номер дома обязателен'),
	apartment: z.string().optional(),
	comment: z.string().optional(),
});

export const productUnitSchema = z.enum(['kg', 'piece', 'box']);

export const cartItemSchema = z.object({
	productId: z.string(),
	quantity: z.number().positive(),
	unit: productUnitSchema,
	comment: z.string().optional(),
});

export const checkoutSchema = z.object({
	deliveryAddress: addressSchema,
	deliveryMethod: z.enum(['delivery', 'pickup']),
	deliverySlot: z.string().optional(),
	paymentMethod: z.enum(['cash', 'card', 'transfer']),
	companyName: z.string().optional(),
	inn: z.string().optional(),
});

export const disputeSchema = z.object({
	orderId: z.string(),
	type: z.enum(['quality', 'missing', 'wrong_weight', 'wrong_variety']),
	description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
	photos: z.array(z.string()).min(1, 'Необходимо загрузить хотя бы одно фото'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CartItemData = z.infer<typeof cartItemSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type DisputeFormData = z.infer<typeof disputeSchema>;
export type ProductUnit = z.infer<typeof productUnitSchema>; 

export const emailLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const otpSchema = z.object({
  code: z.string().length(6, 'Код должен содержать 6 цифр'),
  remember_me: z.boolean().optional(),
  accept_terms: z.literal(true, {
    errorMap: () => ({ message: 'Необходимо принять условия использования' }),
  }),
});

export const phoneFormSchema = z.object({
  phone: phoneSchema,
});

export type EmailLoginFormData = z.infer<typeof emailLoginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type PhoneFormData = z.infer<typeof phoneFormSchema>;