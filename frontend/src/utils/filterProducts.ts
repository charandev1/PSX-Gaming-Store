import type { FiltersStateType } from "../types/FiltersStateType";

export interface Product {
  id: number;
  name: string;
  imageSrc: string[];
  platform: string[];
  genre: string[];
  price: number;
  inStock: boolean;
  fastDelivery: boolean;
  discountPrice?: number;
  discount?: number;
  ratings?: number;
  brand?: string;
  videoSrc?: string[];
  category?: string;
  esrbRating?: string;
}

export const getSortedProducts = (
  products: Product[],
  sortBy: "ascending" | "descending" | null
) => {
  if (sortBy === "descending") {
    return [...products].sort(
      (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
    );
  }

  if (sortBy === "ascending") {
    return [...products].sort(
      (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
    );
  }

  return products;
};

export const getFilteredProducts = (
  products: Product[],
  {
    outOfStock,
    fastDelivery,
    categories,
    brands,
    rating,
    priceRange,
    search,
    esrbRatings,
    platforms,
  }: FiltersStateType
) => {
  return products.filter((product) => {

    // SEARCH
    if (
      search &&
      !product.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // PRICE
    const finalPrice = product.discountPrice ?? product.price;

    if (finalPrice > priceRange) {
      return false;
    }

    // RATING
    if (rating && (product.ratings ?? 0) < rating) {
      return false;
    }

    // CATEGORY
    if (
      categories.length > 0 &&
      !categories.includes(product.category ?? "")
    ) {
      return false;
    }

    // BRAND
    if (
      brands.length > 0 &&
      !brands.includes(product.brand ?? "")
    ) {
      return false;
    }

    // ESRB
    if (
      esrbRatings.length > 0 &&
      product.category === "game" &&
      !esrbRatings.includes(product.esrbRating ?? "")
    ) {
      return false;
    }

    // PLATFORM
    if (
      platforms.length > 0 &&
      product.category === "game" &&
      !(product.platform ?? []).some((platform) =>
        platforms.includes(platform)
      )
    ) {
      return false;
    }

    // STOCK
    if (!outOfStock && product.inStock === false) {
      return false;
    }

    // FAST DELIVERY
    if (fastDelivery && !product.fastDelivery) {
      return false;
    }

    return true;
  });
};