import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from './Shop.module.css';
import api from "./api";
import { Link } from 'react-router-dom';
import ProductFilter from "./FilterBody";
import { useParams, useSearchParams } from "react-router-dom";
import { useUserContext } from "./contexts/user.context";
import { useNavigate } from "react-router-dom";
import HomePageBody from "./HomePageBody";
import { toast } from "react-toastify";
import { useFilterContext } from "./contexts/filter.context";
import {
  getFilteredProducts,
  type Product,
} from "./utils/filterProducts";
function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
// const { category } = useParams();
// const { userInfo } = useUserContext();
// const navigate = useNavigate();
const { category } = useParams();
const [searchParams] = useSearchParams();
const searchQuery = searchParams.get("search");

const { userInfo } = useUserContext();
const navigate = useNavigate();
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8080/products")
  //     .then(res => {
  //       setProducts(res.data);
  //     })
  //     .catch(err => {
  //       console.error("❌ API ERROR:", err);
  //     });
  // }, []);
 useEffect(() => {

  // SEARCH
  if (searchQuery) {

    axios
      .get("http://localhost:8080/products/search", {
        params: { query: searchQuery }
      })
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error("Search failed:", err);
        setProducts([]);
      });

  }

  // CATEGORY / ALL PRODUCTS
  else {

    axios
      .get("http://localhost:8080/products", {
        params: category ? { category } : {}
      })
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      });

  }

  // WISHLIST
  if (userInfo) {

    axios
      .get("http://localhost:8080/wishlist", {
        params: { userId: userInfo.id }
      })
      .then(res => {
        setWishlistedIds(res.data);
      });

  } else {

    setWishlistedIds([]);

  }

}, [category, userInfo, searchQuery]);

// const getWishlistFromStorage = (): number[] => {
//   return JSON.parse(localStorage.getItem("wishlist") || "[]");
// };
// const [wishlistedIds, setWishlistedIds] = useState<number[]>(
//   getWishlistFromStorage()
// );

const [wishlistedIds, setWishlistedIds] = useState<number[]>([]);


//  const toggleWishlist = (id: number) => {
//   setWishlistedIds(prev => {
//     const updated = prev.includes(id)
//       ? prev.filter(pid => pid !== id)
//       : [...prev, id];

//     localStorage.setItem("wishlist", JSON.stringify(updated));
//     return updated;
//   });
// };

const toggleWishlist = async (productId: number) => {

  // CHECK LOGIN
  if (!userInfo) {
    navigate("/signin");
    return;
  }

  const isAlreadyWishlisted = wishlistedIds.includes(productId);

  // Update UI
  setWishlistedIds(prev =>
    isAlreadyWishlisted
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
  );

  try {
    await api.post(`/wishlist/${productId}`, null, {
      params: { userId: userInfo.id },
    });

    // Toast message
    if (isAlreadyWishlisted) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }

  } catch (e) {
    console.error(e);

    // Optional: show error toast
    toast.error("Something went wrong");
  }
};
const { filtersState } = useFilterContext();




  return (
  <>
    <HomePageBody />

    <div style={{ padding: "40px", paddingTop: "110px",color: "#9a9797" }}>
      <h2>PSX Store</h2>
    <div className={styles.shopLayout}>
    {/* FILTER */}
   <div className={styles.filter}>
 <ProductFilter setProducts={setProducts} />
</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
       {getFilteredProducts(products, filtersState).map(p => (

          <div
            key={p.id}
            style={{
              border: "1px solid #444",
              padding: "15px",
              borderRadius: "8px",
              background: "#111",
              color: "#fff",
            }}
          >        <Link to={`/product/${p.id}`} className={styles.infoLink}>

            <div className={styles.imageWrapper}>
  <img
    className={styles.imagestyle}
    src={p.imageSrc?.[0]}
    alt={p.name}
  />
</div>



            {/* Name + Wishlist */}
           <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px 0",
  }}
>
  <h3 style={{ margin: 0 }}>{p.name}</h3>

  {/* Wishlist icon MUST NOT be inside Link */}
  <span
    onClick={(e) => {
      e.preventDefault(); // prevent accidental navigation
      toggleWishlist(p.id);
    }}
    style={{ cursor: "pointer" }}
  >
    {wishlistedIds.includes(p.id) ? (
      <FaHeart color="red" size={22} />
    ) : (
      <FaRegHeart color="white" size={22} />
    )}
  </span>
</div>


            {/* Ratings */}
            <p>⭐ {p.ratings ?? "N/A"}</p>

            {/* Platform */}
            <p>
              Platform:{" "}
              {p.platform.map(pl => (
                <span key={pl} style={{ marginRight: "6px" }}>
                  {pl}
                </span>
              ))}
            </p>

            {/* Price */}
            {p.discountPrice ? (
              <>
                <p style={{ textDecoration: "line-through", color: "#999" }}>
                  ₹{p.price}
                </p>
                <p style={{ color: "#00ff6a", fontWeight: "bold" }}>
                  ₹{p.discountPrice} ({p.discount}% OFF)
                </p>
              </>
            ) : (
              <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
            )}

            {/* Stock */}
            <p
              style={{
                color: p.inStock ? "#00ff6a" : "red",
                fontWeight: 600,
              }}
            >
              {p.inStock ? "In Stock" : "Out of Stock"}
            </p>

            {/* Delivery */}
            {p.fastDelivery && (
              <p style={{ color: "#ffaa00" }}>🚀 Fast Delivery</p>
            )}
          </Link>
            
          </div>
        ))}
      </div>
      </div>
    </div>
  </>
);
};
export default Shop;
