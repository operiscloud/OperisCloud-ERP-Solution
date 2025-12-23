import { Prisma } from '@prisma/client';

// ==========================================
// INDUSTRY TEMPLATES
// ==========================================

export interface IndustryTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  modules: string[];
  productTypes: ProductTypeConfig[];
  salesChannels: ChannelConfig[];
  expenseCategories: ExpenseCategoryConfig[];
  defaultCurrency: string;
  defaultLanguage: string;
}

export interface ProductTypeConfig {
  name: string;
  type: 'PHYSICAL' | 'SERVICE' | 'DIGITAL';
  variants?: VariantTypeConfig[];
  fields?: string[];
  unit?: string;
}

export interface VariantTypeConfig {
  name: string;
  values: string[];
}

export interface ChannelConfig {
  id: string;
  name: string;
  icon?: string;
  active: boolean;
}

export interface ExpenseCategoryConfig {
  id: string;
  name: string;
  color?: string;
}

// ==========================================
// DASHBOARD & ANALYTICS
// ==========================================

export interface DashboardStats {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  averageOrderValue: {
    current: number;
    previous: number;
    change: number;
  };
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  quantity: number;
  image?: string;
}

export interface TopChannel {
  name: string;
  revenue: number;
  orders: number;
  percentage: number;
}

// ==========================================
// FORMS & VALIDATION
// ==========================================

export interface ProductFormData {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  type: 'PHYSICAL' | 'SERVICE' | 'DIGITAL';
  price: number;
  costPrice?: number;
  trackStock: boolean;
  stockQuantity: number;
  lowStockAlert?: number;
  categoryId?: string;
  images: string[];
  hasVariants: boolean;
  variantConfig?: Prisma.JsonValue;
  customFields?: Prisma.JsonValue;
  isActive: boolean;
}

export interface OrderFormData {
  customerId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  type: 'QUOTE' | 'ORDER' | 'INVOICE';
  channel: string;
  items: OrderItemFormData[];
  taxRate: number;
  discount: number;
  shippingCost: number;
  shippingAddress?: string;
  notes?: string;
  internalNotes?: string;
}

export interface OrderItemFormData {
  productId?: string;
  variantId?: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

export interface CustomerFormData {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  tags: string[];
  notes?: string;
}

export interface ExpenseFormData {
  title: string;
  description?: string;
  amount: number;
  category: string;
  date: Date;
  receiptUrl?: string;
  paymentMethod?: string;
}

// ==========================================
// TENANT SETTINGS
// ==========================================

export interface TenantSettings {
  name: string;
  logo?: string;
  primaryColor: string;
  currency: string;
  language: string;
  timezone: string;
  taxRate: number;
  industryId: string;
  industrySettings?: Prisma.JsonValue;
  enabledModules: string[];
}

// ==========================================
// PAGINATION & FILTERING
// ==========================================

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  type?: string;
  isActive?: boolean;
  lowStock?: boolean;
}

export interface OrderFilters {
  search?: string;
  status?: string;
  customerId?: string;
  channel?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CustomerFilters {
  search?: string;
  tags?: string[];
  segment?: string;
}

export interface ExpenseFilters {
  search?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
