type ProductType = {
  _id: string;
  name: string;
  category: 'game' | 'accessories';
  media: { imageSrc: string[]; videoSrc: string[] };
  price: number;
  discountPrice: number;
  discount: number;
  esrbRating?: 'Mature' | 'Teen' | 'Everyone';
  platform?: string[];
  brand: string;
  genre?: string[];
  ratings: number;
  inStock: boolean;
  fastDelivery?: boolean;
};

export type {ProductType};
