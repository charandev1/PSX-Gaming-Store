import { useEffect, useState } from "react";
import api from "./api";
import { FaTrash } from "react-icons/fa";
import styles from "./CartBody.module.css";
import { useUserContext } from "./contexts/user.context";
import { toast } from "react-toastify";
import HomePageBody from "./HomePageBody";
import { Link, useNavigate } from "react-router-dom";
interface Address {
  id: number;
  userId: number;
  name: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  addressType: string;
}
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
interface CartItem {
  productId: number;
  quantity: number;
}
function CartList() {
  const [products, setProducts] = useState<Product[]>([]);
 const [cartItems, setCartItems] = useState<CartItem[]>([]);

 const { userInfo } = useUserContext();
const navigate = useNavigate();
const [addresses, setAddresses] = useState<Address[]>([]);
  useEffect(() => {
  if (!userInfo) {
    navigate("/signin", { replace: true });
    return;
  }

 api
  .get("/cartlist", {
    params: { userId: userInfo.id },
  })
  .then(res => setCartItems(res.data));

api
  .get("/products")
  .then(res => setProducts(res.data));

}, [userInfo, navigate]);
 useEffect(() => {
  if (!userInfo) return;

 api
  .get("/address", {
    params: {
      userId: userInfo.id,
    },
  })
  .then((res) => {
    setAddresses(res.data);
  })
  .catch((error) => {
    console.error("Failed to fetch addresses:", error);
  });
}, [userInfo]);
const selectedAddressId = Number(
  localStorage.getItem("selectedAddressId")
);

const selectedAddress = addresses.find(
  (address) => address.id === selectedAddressId
);
const removeFromCart = async (productId: number) => {

  if (!userInfo) {
    navigate("/signin");
    return;
  }

  try {
   await api.post(
  `/cartlist/${productId}`,
  null,
  { params: { userId: userInfo.id } }
);

const res = await api.get(
  "/cartlist",
  { params: { userId: userInfo.id } }
);

setCartItems(res.data);
toast.success("Removed from cart");
}
 catch (e) {
    console.error(e);
    toast.error("Failed to remove from cart");
  }
};
const updateQuantity = async (
  productId: number,
  quantity: number
) => {

  if (!userInfo) {
    navigate("/signin");
    return;
  }

  try {

   await api.put(
  `/cartlist/${productId}/quantity`,
  null,
  {
    params: {
      userId: userInfo.id,
      quantity: quantity,
    },
  }
);

const res = await api.get("/cartlist", {
  params: {
    userId: userInfo.id,
  },
});

setCartItems(res.data);

  } catch (error) {

    console.error("Failed to update quantity:", error);

    toast.error("Failed to update quantity");
  }
};

 const cartProducts = products.filter(p =>
  cartItems.some(item => item.productId === p.id)
);
 const actualPrice = cartProducts.reduce(
  (total, product) => {

    const cartItem = cartItems.find(
      item => item.productId === product.id
    );

    const quantity = cartItem?.quantity ?? 1;

    return total + product.price * quantity;
  },
  0
);

const cartTotal = cartProducts.reduce(
  (total, product) => {

    const cartItem = cartItems.find(
      item => item.productId === product.id
    );

    const quantity = cartItem?.quantity ?? 1;

    return total +
      (product.discountPrice ?? product.price) * quantity;
  },
  0
);

const discountPrice = actualPrice - cartTotal;

  if (cartProducts.length === 0) {
    return (
     <>
      <HomePageBody />
      <p className={styles["cart-empty"]}>Your cart is empty 🛒</p>
      </>
      );
  }

  return (
     <>
    <HomePageBody />
<div className={styles["cart-container"]}>

  <h2 className={styles["cart-title"]}>
    My Cart
  </h2>

  {/* DELIVERY ADDRESS */}
  <div className={styles["delivery-address"]}>

    <div className={styles["delivery-address-header"]}>
      <span>Delivery Address</span>

      <button
        onClick={() => navigate("/address")}
        className={styles["change-address-button"]}
      >
        Change
      </button>
    </div>


    {selectedAddress ? (
      <div className={styles["selected-address-info"]}>

        <div className={styles["selected-address-name"]}>
          {selectedAddress.name}

          <span className={styles["selected-address-type"]}>
            {selectedAddress.addressType}
          </span>
        </div>

        <div>
          {selectedAddress.line1}
        </div>

        <div>
          {selectedAddress.city},{" "}
          {selectedAddress.state} -{" "}
          {selectedAddress.postalCode}
        </div>

      </div>
    ) : (
      <div className={styles["no-address"]}>
        No delivery address selected.

        <button
          onClick={() => navigate("/address")}
          className={styles["select-address-button"]}
        >
          Select Address
        </button>
      </div>
    )}
  </div>


  {/* CART + PRICE DETAILS */}
  <div className={styles["cart-layout"]}>

    {/* LEFT — PRODUCTS */}
    <div className={styles["cart-products"]}>

      {cartProducts.map(p => (
        <div
          className={styles["cart-card"]}
          key={p.id}
        >
          <div className={styles["cart-card-row"]}>
             <Link
          to={`/product/${p.id}`}
          className={styles["infoLink"]}
        >
            <img
              src={p.imageSrc[0]}
              alt={p.name}
              className={styles["cart-image"]}
            />

            <div className={styles["cart-info"]}>
              <h3 className={styles["cart-name"]}>
                {p.name}
              </h3>

             <p className={styles["cart-price"]}>
  ₹{p.discountPrice ?? p.price}
</p>
            </div>
              </Link>
            <div className={styles["quantity-control"]}>

  <button
    onClick={() => {
      const item = cartItems.find(
        item => item.productId === p.id
      );

      if (item) {
        updateQuantity(
          p.id,
          item.quantity - 1
        );
      }
    }}
  >
    −
  </button>

  <span>
    {cartItems.find(
      item => item.productId === p.id
    )?.quantity ?? 1}
  </span>

  <button
    onClick={() => {
      const item = cartItems.find(
        item => item.productId === p.id
      );

      if (item) {
        updateQuantity(
          p.id,
          item.quantity + 1
        );
      }
    }}
  >
    +
  </button>

</div>
          
            <button
              className={styles["cart-remove"]}
              onClick={() => removeFromCart(p.id)}
              aria-label="Remove from cart"
            >
              <FaTrash />
            </button>

          </div>
        </div>
      ))}

    </div>


    {/* RIGHT — PRICE DETAILS */}
    <div className={styles["price-container"]}>

      <div className={styles["price-heading"]}>
        PRICE DETAILS
      </div>

      <ul className={styles["price-details-list"]}>

        <li className={styles["price-container-row"]}>
          <span>Items Price:</span>
          <span className={styles["price-value"]}>
            ₹{actualPrice}
          </span>
        </li>

        <li className={styles["price-container-row"]}>
          <span>Discount:</span>
          <span className={styles["discount-value"]}>
            − ₹{discountPrice}
          </span>
        </li>

        <li className={styles["price-container-row"]}>
          <span>Delivery Charges:</span>
          <span className={styles["free-value"]}>
            FREE
          </span>
        </li>

      </ul>

      <div
        className={`${styles["price-container-row"]} ${styles["total-amount"]}`}
      >
        <span className={styles["sub-heading"]}>
          Total Amount
        </span>

        <span>
          ₹{cartTotal}
        </span>
      </div>

      <button
        className={styles["checkout-button"]}
        onClick={() => navigate("/checkout")}
      >
        Checkout
      </button>

      <div className={styles["saving-message"]}>
        You will save ₹{discountPrice} on this order
      </div>

    </div>

  </div>

</div>
     </>
  );
}

export default CartList;