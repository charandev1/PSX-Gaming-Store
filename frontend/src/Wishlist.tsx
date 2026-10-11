import { useEffect, useState } from "react";

import api from "./api";
import { FaHeart } from "react-icons/fa";
import styles from "./WishlistBody.module.css";
import { useUserContext } from "./contexts/user.context";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HomePageBody from "./HomePageBody";

interface Product {
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
}

function WishList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistedIds, setWishlistedIds] = useState<number[]>([]);
 const { userInfo } = useUserContext();
const navigate = useNavigate();

 
useEffect(() => {
  if (!userInfo) {
    navigate("/signin", { replace: true });
    return;
  }

  api
    .get("/wishlist", {
      params: { userId: userInfo.id },
    })
    .then(res => setWishlistedIds(res.data));

  api
    .get("/products")
    .then(res => setProducts(res.data));
}, [userInfo, navigate]);

const removeFromWishlist = async (productId: number) => {
  if (!userInfo) {
    navigate("/signin");
    return;
  }

  try {
    await api.post(
      `/wishlist/${productId}`,
      null,
      { params: { userId: userInfo.id } }
    );

    const res = await api.get("/wishlist", {
      params: { userId: userInfo.id },
    });

    setWishlistedIds(res.data);

    toast.info("Removed from wishlist");
  } catch (error) {
    console.error("Failed to remove from wishlist", error);
    toast.error("Failed to remove from wishlist");
  }
};

const wishlistedProducts = products.filter(p =>
  wishlistedIds.includes(p.id)
);

if (wishlistedProducts.length === 0) {
  return (
    <>
      <HomePageBody />

      <p className={styles["wishlist-empty"]}>
        Your wishlist is empty ❤️
      </p>
    </>
  );
}


 return (
  <>
    <HomePageBody />

    <div className={styles["wishlist-container"]}>
  <h2 className={styles["wishlist-title"]}>My Wishlist</h2>

  {wishlistedProducts.map(p => (
    <div className={styles["wishlist-card"]} key={p.id}>
      <div className={styles["wishlist-card-row"]}>
         <Link
          to={`/product/${p.id}`}
          className={styles["infoLink"]}
        >
        <img
          src={p.imageSrc[0]}
          alt={p.name}
          className={styles["wishlist-image"]}
        />

        <div className={styles["wishlist-info"]}>
          <h3 className={styles["wishlist-name"]}>{p.name}</h3>
          <p className={styles["wishlist-price"]}>₹{p.price}</p>
        </div>
          </Link>
        <button
          className={styles["wishlist-remove"]}
          onClick={() => removeFromWishlist(p.id)}
        >
          <FaHeart />
        </button>
      </div>
    </div>
  ))}
    </div>
  </>
);
}

export default WishList;