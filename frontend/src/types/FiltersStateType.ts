type FiltersStateType = {
  priceRange: number;
  outOfStock: boolean;
  fastDelivery: boolean;
  brands: string[];
  categories: string[];
  platforms: string[];
  esrbRatings: string[];
  rating: number | null;
  sortBy: 'ascending' | 'descending' | null;
  search: string | null;
};
export type { FiltersStateType };
