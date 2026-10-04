
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";
import ProductInfo from "./ProductDisplay";
import { useWishlist } from "./useWishlist";
import { useUserContext } from "./contexts/user.context";

interface Product {
  id: number;
  name: string;
  imageSrc: string[];
  price: number;
  discountPrice?: number;
  discount?: number;
}

const ProductInfoPage = () => {
  const { id } = useParams<{ id: string }>();

  const { userInfo } = useUserContext();

  const [product, setProduct] = useState<Product | null>(null);

  const { wishlistedIds, toggleWishlist } = useWishlist(userInfo?.id);

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <ProductInfo
      product={product}
      isWishlisted={wishlistedIds.includes(product.id)}
      onToggleWishlist={toggleWishlist}
    />
  );
};

export default ProductInfoPage;
