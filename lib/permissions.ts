export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'SELLER' | 'VIEWER';

export const PERMISSIONS = {
  // User management
  manageUsers: ['OWNER'],
  inviteUsers: ['OWNER', 'ADMIN'],

  // Settings
  manageCompanySettings: ['OWNER', 'ADMIN'],
  manageSalesSettings: ['OWNER', 'ADMIN', 'MANAGER'],
  manageVariants: ['OWNER', 'ADMIN', 'MANAGER'],

  // Products
  createProduct: ['OWNER', 'ADMIN', 'MANAGER'],
  editProduct: ['OWNER', 'ADMIN', 'MANAGER'],
  deleteProduct: ['OWNER', 'ADMIN', 'MANAGER'],
  viewProducts: ['OWNER', 'ADMIN', 'MANAGER', 'SELLER', 'VIEWER'],

  // Orders
  createOrder: ['OWNER', 'ADMIN', 'MANAGER', 'SELLER'],
  editOrder: ['OWNER', 'ADMIN', 'MANAGER'],
  deleteOrder: ['OWNER', 'ADMIN', 'MANAGER'],
  viewOrders: ['OWNER', 'ADMIN', 'MANAGER', 'SELLER', 'VIEWER'],

  // Customers
  createCustomer: ['OWNER', 'ADMIN', 'MANAGER', 'SELLER'],
  editCustomer: ['OWNER', 'ADMIN', 'MANAGER', 'SELLER'],
  deleteCustomer: ['OWNER', 'ADMIN', 'MANAGER'],
  viewCustomers: ['OWNER', 'ADMIN', 'MANAGER', 'SELLER', 'VIEWER'],

  // Gift Cards
  createGiftCard: ['OWNER', 'ADMIN', 'MANAGER'],
  editGiftCard: ['OWNER', 'ADMIN', 'MANAGER'],
  deleteGiftCard: ['OWNER', 'ADMIN', 'MANAGER'],
  viewGiftCards: ['OWNER', 'ADMIN', 'MANAGER', 'SELLER', 'VIEWER'],

  // Finance
  viewFinance: ['OWNER', 'ADMIN', 'MANAGER'],
  createExpense: ['OWNER', 'ADMIN', 'MANAGER'],

  // Analytics
  viewAnalytics: ['OWNER', 'ADMIN', 'MANAGER', 'VIEWER'],

  // Bulk operations
  manageBulkImport: ['OWNER', 'ADMIN', 'MANAGER'],
};

export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole);
}

export function canManageUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, 'manageUsers');
}

export function canInviteUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, 'inviteUsers');
}

export function canManageSettings(userRole: UserRole): boolean {
  return hasPermission(userRole, 'manageCompanySettings');
}

export function canCreateOrder(userRole: UserRole): boolean {
  return hasPermission(userRole, 'createOrder');
}

export function canEditOrder(userRole: UserRole): boolean {
  return hasPermission(userRole, 'editOrder');
}

export function canDeleteOrder(userRole: UserRole): boolean {
  return hasPermission(userRole, 'deleteOrder');
}

export function canManageProducts(userRole: UserRole): boolean {
  return hasPermission(userRole, 'createProduct');
}

export function canManageCustomers(userRole: UserRole): boolean {
  return hasPermission(userRole, 'createCustomer');
}

export function canViewFinance(userRole: UserRole): boolean {
  return hasPermission(userRole, 'viewFinance');
}
