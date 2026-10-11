
import styles from "./ProductDisplay.module.css";
import { FaRegHeart, FaHeart, FaShoppingCart } from "react-icons/fa";
import api from "./api";
import { useEffect, useState } from "react";
import { useUserContext } from "./contexts/user.context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HomePageBody from "./HomePageBody";

interface Product {
  id: number;
  name: string;
  imageSrc: string[];
  price: number;
  discountPrice?: number;
  discount?: number;
}

type ProductInfoProps = {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (id: number) => void;
};

const ProductInfo = ({
  product,
  isWishlisted,
  onToggleWishlist,
}: ProductInfoProps) => {
  const { userInfo } = useUserContext();
  const navigate = useNavigate();

  const [cartIds, setCartIds] = useState<number[]>([]);

  
useEffect(() => {
  if (!userInfo) {
    setCartIds([]);
    return;
  }

  api
    .get("/cartlist", {
      params: { userId: userInfo.id },
    })
    .then((res) => {
      const ids = res.data.map(
        (item: { productId: number; quantity: number }) =>
          item.productId
      );

      setCartIds(ids);
    })
    .catch((error) => {
      console.error("Failed to fetch cart items", error);
      setCartIds([]);
    });
}, [userInfo]);

const addToCart = async (productId: number) => {
  if (!userInfo) {
    navigate("/signin");
    return;
  }

  try {
    await api.post(
      `/cartlist/${productId}`,
      null,
      {
        params: { userId: userInfo.id },
      }
    );

    const res = await api.get("/cartlist", {
      params: { userId: userInfo.id },
    });

    const ids = res.data.map(
      (item: { productId: number; quantity: number }) =>
        item.productId
    );

    setCartIds(ids);

    toast.success("Added to cart");
  } catch (error) {
    console.error("Failed to add to cart", error);
    toast.error("Failed to add to cart");
  }
};


  const isInCart = cartIds.includes(product.id);

  const handleWishlistToggle = () => {
    if (!userInfo) {
      navigate("/signin");
      return;
    }

    onToggleWishlist(product.id);

    if (isWishlisted) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className={styles["page"]}>
      <HomePageBody />

      <main className={styles["product-page"]}>
        <div className={styles["product-card"]}>

          {/* PRODUCT IMAGE */}
          <div className={styles["image-section"]}>
            <div className={styles["image-wrapper"]}>
              <img
                className={styles["product-image"]}
                src={product.imageSrc?.[0]}
                alt={product.name}
              />
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className={styles["product-info"]}>

            <p className={styles["product-label"]}>
              GAME DETAILS
            </p>

            <h1 className={styles["product-title"]}>
              {product.name}
            </h1>

            <div className={styles["divider"]}></div>

            {/* PRICE */}
            <div className={styles["price-container"]}>
              {product.discountPrice ? (
                <>
                  <span className={styles["discount-price"]}>
                    ₹{product.discountPrice}
                  </span>

                  <del className={styles["old-price"]}>
                    ₹{product.price}
                  </del>

                  {product.discount && (
                    <span className={styles["discount-percent"]}>
                      {product.discount}% OFF
                    </span>
                  )}
                </>
              ) : (
                <span className={styles["discount-price"]}>
                  ₹{product.price}
                </span>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className={styles["action-items"]}>

              <button
                className={styles["add-to-cart-button"]}
                onClick={() => addToCart(product.id)}
                disabled={isInCart}
              >
                <FaShoppingCart />

                <span>
                  {isInCart
                    ? "Already in Cart"
                    : "Add to Cart"}
                </span>
              </button>

              <button
                className={`${styles["wishlist-button"]} ${
                  isWishlisted
                    ? styles["wishlist-button-active"]
                    : ""
                }`}
                onClick={handleWishlistToggle}
              >
                {isWishlisted ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}

                <span>
                  {isWishlisted
                    ? "Wishlisted"
                    : "Wishlist"}
                </span>
              </button>

            </div>

            {/* EXTRA INFO */}
            <div className={styles["product-features"]}>
              <div>
                <span className={styles["feature-icon"]}>✓</span>
                Secure checkout
              </div>

              <div>
                <span className={styles["feature-icon"]}>✓</span>
                Fast delivery
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductInfo;

