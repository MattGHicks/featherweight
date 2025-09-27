import type {
  Category,
  GearItem,
  PackList,
  PackListItem,
  User,
} from '@prisma/client';

// Enhanced types with relations
export type UserWithProfile = User;

export type GearItemWithCategory = GearItem & {
  category: Category;
};

export type PackListWithItems = PackList & {
  items: (PackListItem & {
    gearItem: GearItemWithCategory;
  })[];
};

export type PackListWithUser = PackList & {
  user: Pick<User, 'id' | 'name' | 'email'>;
};

// Utility types for forms
export type CreateGearItemData = Omit<
  GearItem,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export type UpdateGearItemData = Partial<CreateGearItemData>;

export type CreatePackListData = Omit<
  PackList,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export type UpdatePackListData = Partial<CreatePackListData>;

// Weight calculation types
export interface WeightBreakdown {
  totalWeight: number;
  baseWeight: number;
  wornWeight: number;
  consumableWeight: number;
  categoryBreakdown: CategoryWeight[];
}

export interface CategoryWeight {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  weight: number;
  percentage: number;
}

// Units and preferences
export type WeightUnit = 'metric' | 'imperial';

export interface UserPreferences {
  preferredUnits: WeightUnit;
  baseWeightGoal?: number;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and filter types
export interface GearItemFilters {
  categoryId?: string;
  search?: string;
  isWorn?: boolean;
  isConsumable?: boolean;
  sortBy?: 'name' | 'weight' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PackListFilters {
  search?: string;
  isPublic?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

// Export Prisma types for convenience
export type { User, GearItem, PackList, PackListItem, Category };
