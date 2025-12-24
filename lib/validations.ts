import { z } from 'zod';

// ==========================================
// TENANT & ONBOARDING
// ==========================================

export const createTenantSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  subdomain: z
    .string()
    .min(3, 'Le sous-domaine doit contenir au moins 3 caractères')
    .max(30, 'Le sous-domaine ne peut pas dépasser 30 caractères')
    .regex(/^[a-z0-9-]+$/, 'Le sous-domaine ne peut contenir que des lettres, chiffres et tirets'),
  industryId: z.string().min(1, 'Veuillez sélectionner une industrie'),
  currency: z.string().default('CHF'),
  language: z.string().default('fr'),
});

export const updateTenantSettingsSchema = z.object({
  name: z.string().min(2).optional(),
  logo: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

// ==========================================
// PRODUCTS
// ==========================================

export const productSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  type: z.enum(['PHYSICAL', 'SERVICE', 'DIGITAL']),
  price: z.number().min(0, 'Le prix doit être positif'),
  costPrice: z.number().min(0).optional().nullable(),
  trackStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  lowStockAlert: z.number().int().min(0).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  images: z.array(z.string().url()).default([]),
  hasVariants: z.boolean().default(false),
  variantConfig: z.any().optional().nullable(),
  customFields: z.any().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const productVariantSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  attributes: z.record(z.string()),
  price: z.number().min(0).optional().nullable(),
  costPrice: z.number().min(0).optional().nullable(),
  stockQuantity: z.number().int().min(0).default(0),
  images: z.array(z.string().url()).default([]),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
});

// ==========================================
// CUSTOMERS
// ==========================================

export const customerSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().optional().nullable(),
  email: z.string().email('Email invalide').optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  segment: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// ==========================================
// ORDERS
// ==========================================

export const orderItemSchema = z.object({
  productId: z.string().optional().nullable(),
  variantId: z.string().optional().nullable(),
  name: z.string().min(1),
  sku: z.string().optional().nullable(),
  quantity: z.number().int().min(1, 'La quantité doit être au moins 1'),
  unitPrice: z.number().min(0, 'Le prix doit être positif'),
});

export const orderSchema = z.object({
  customerId: z.string().optional().nullable(),
  guestName: z.string().optional().nullable(),
  guestEmail: z.string().email().optional().nullable(),
  guestPhone: z.string().optional().nullable(),
  type: z.enum(['QUOTE', 'ORDER', 'INVOICE']).default('ORDER'),
  status: z.enum(['DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).default('DRAFT'),
  channel: z.string().default('online'),
  items: z.array(orderItemSchema).min(1, 'Au moins un article est requis'),
  taxRate: z.number().min(0).max(100).default(0),
  discount: z.number().min(0).default(0),
  shippingCost: z.number().min(0).default(0),
  shippingAddress: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID', 'REFUNDED']).default('PENDING'),
  giftCardCode: z.string().optional().nullable(),
  orderDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID', 'REFUNDED']),
  paymentMethod: z.string().optional().nullable(),
});

// ==========================================
// EXPENSES
// ==========================================

export const expenseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional().nullable(),
  amount: z.number().min(0, 'Le montant doit être positif'),
  category: z.string().min(1, 'La catégorie est requise'),
  date: z.coerce.date(),
  receiptUrl: z.string().url().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
});

// ==========================================
// GIFT CARDS
// ==========================================

export const giftCardSchema = z.object({
  code: z.string().min(4, 'Le code doit contenir au moins 4 caractères'),
  initialAmount: z.number().min(1, 'Le montant doit être positif'),
  expiresAt: z.coerce.date().optional().nullable(),
});

// ==========================================
// FILTERS & PAGINATION
// ==========================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(['PHYSICAL', 'SERVICE', 'DIGITAL']).optional(),
  isActive: z.boolean().optional(),
  lowStock: z.boolean().optional(),
});

export const orderFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  customerId: z.string().optional(),
  channel: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export const customerFiltersSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  segment: z.string().optional(),
});

export const expenseFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});
