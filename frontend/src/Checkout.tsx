import { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./contexts/user.context";
import HomePageBody from "./HomePageBody";
import styles from "./Checkout.module.css";
import { FaTrash } from "react-icons/fa";
declare global {
  interface Window {
    Razorpay: any;
  }
}
interface Product {
  id: number;
  name: string;
  imageSrc: string[];
  price: number;
  discountPrice?: number;
}

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
interface CartItem {
  productId: number;
  quantity: number;
}
const Checkout = () => {
  const { userInfo } = useUserContext();
  const navigate = useNavigate();
 const [products, setProducts] = useState<Product[]>([]);
const [addresses, setAddresses] = useState<Address[]>([]);
const [loading, setLoading] = useState(true);
const [selectedCartIds, setSelectedCartIds] = useState<number[]>([]);
const [cartItems, setCartItems] = useState<CartItem[]>([]);
useEffect(() => {
  const script = document.createElement("script");

  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin", { replace: true });
      return;
    }
    

const fetchData = async () => {
  try {
    const [cartResponse, productsResponse, addressResponse] =
      await Promise.all([
        api.get("/cartlist", {
          params: {
            userId: userInfo.id,
          },
        }),

        api.get("/products"),

        api.get("/address", {
          params: {
            userId: userInfo.id,
          },
        }),
      ]);

    setCartItems(cartResponse.data);

    setSelectedCartIds(
      cartResponse.data.map(
        (item: CartItem) => item.productId
      )
    );

    setProducts(productsResponse.data);
    setAddresses(addressResponse.data);
  } catch (error) {
    console.error("Failed to load checkout:", error);
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, [userInfo, navigate]);

  if (loading) {
    return (
      <>
        <HomePageBody />
        <div className={styles.loading}>
          Loading checkout...
        </div>
      </>
    );
  }

 const cartProducts = products.filter((product) =>
  selectedCartIds.includes(product.id)
);

  const actualPrice = cartProducts.reduce(
  (total, product) => {
    const item = cartItems.find(
      item => item.productId === product.id
    );

    const quantity = item?.quantity ?? 1;

    return total + product.price * quantity;
  },
  0
);

const cartTotal = cartProducts.reduce(
  (total, product) => {
    const item = cartItems.find(
      item => item.productId === product.id
    );

    const quantity = item?.quantity ?? 1;

    return total +
      (product.discountPrice ?? product.price) * quantity;
  },
  0
);

  const discountPrice = actualPrice - cartTotal;

  const selectedAddressId = Number(
    localStorage.getItem("selectedAddressId")
  );

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId
  );
if (cartProducts.length === 0) {
  return (
    <>
      <HomePageBody />

      <div className={styles.emptyCheckout}>

        <h2>
          No products selected
        </h2>

        <p>
          Please select at least one product to continue.
        </p>

        <button
          onClick={() => navigate("/cartlist")}
          className={styles.shopButton}
        >
          Back to Cart
        </button>

      </div>
    </>
  );
}
const handlePayment = async () => {
  if (!userInfo) {
    navigate("/signin");
    return;
  }

  if (!selectedAddress) {
    alert("Please select a delivery address");
    return;
  }

  try {
    // 1️⃣ Create Razorpay order through our Spring Boot backend
    const response = await api.post(
  "/payment/create-order",
  null,
  {
    params: {
      amount: cartTotal,
    },
  }
);
    const order = response.data;

    // 2️⃣ Razorpay checkout configuration
    const options = {
      key: "rzp_test_TgzWmsNd8AuZjC",

      amount: order.amount,

      currency: order.currency,

      name: "PSX Gaming Store",

      description: "PSX Gaming Store Order",

      order_id: order.id,

   handler: async function (response: any) {
  try {
    if (!userInfo || !selectedAddress) {
      alert("User or address information is missing.");
      return;
    }
      const selectedItems = cartItems.filter(
  item => selectedCartIds.includes(item.productId)
);
    const orderResponse = await api.post(
  "/order",
  null,
  {
    params: {
      userId: userInfo.id,
      addressId: selectedAddress.id,
      productIds: selectedCartIds,
      quantities: selectedItems.map(item => item.quantity),
      totalAmount: cartTotal,
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
    },
  }
);
    await Promise.all(
  selectedCartIds.map((productId) =>
    api.post(
      `/cartlist/${productId}`,
      null,
      {
        params: {
          userId: userInfo.id,
        },
      }
    )
  )
);
    console.log("Order created:", orderResponse.data);

    alert("Payment successful! Order placed successfully 🎉");

    navigate("/orders");

  } catch (error) {
    console.error("Payment succeeded but order creation failed:", error);

    alert(
      "Payment was successful, but there was a problem creating your order. Please contact support."
    );
  }
},

      prefill: {
        name: userInfo.name,
        email: userInfo.email,
      },

      theme: {
        color: "#02c34c",
      },
      modal: {
    ondismiss: function () {
      console.log("Payment window closed");

      alert(
        "Payment cancelled. Your item is still in the cart."
      );
    },
  },
    };
      
    // 3️⃣ Open Razorpay Checkout
    const razorpay = new window.Razorpay(options);
 
razorpay.on("payment.failed", function (response: any) {
  console.error("Payment failed:", response.error);

  alert(
    "Payment failed. Your item is still in the cart."
  );
});

    razorpay.open();

  } catch (error) {
    console.error("Payment failed:", error);
    alert("Unable to start payment");
  }
};
  return (
    <>
      <HomePageBody />

      <div className={styles.checkoutContainer}>

        <h1 className={styles.checkoutTitle}>
          Checkout
        </h1>


        {/* DELIVERY ADDRESS */}

        <div className={styles.section}>

          <div className={styles.sectionHeader}>
            <h2>Delivery Address</h2>

            <button
              className={styles.changeButton}
              onClick={() => navigate("/address")}
            >
              Change
            </button>
          </div>

          {selectedAddress ? (
            <div className={styles.address}>

              <div className={styles.addressName}>
                {selectedAddress.name}

                <span>
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
            <div className={styles.noAddress}>
              <p>
                No delivery address selected.
              </p>

              <button
                onClick={() => navigate("/address")}
                className={styles.selectButton}
              >
                Select Address
              </button>
            </div>
          )}

        </div>


        {/* ORDER ITEMS */}

        <div className={styles.section}>

          <h2>Order Items</h2>

         <div className={styles.products}>

  {cartProducts.map((product) => (

    <div
      className={styles.product}
      key={product.id}
    >

      <img
        src={product.imageSrc[0]}
        alt={product.name}
      />

      <div className={styles.productInfo}>

        <h3>
          {product.name}
        </h3>

        <p>
          ₹{product.discountPrice ?? product.price}
        </p>

      </div>

      <button
        className={styles.removeProductButton}
        onClick={() => {
          setSelectedCartIds((prev) =>
            prev.filter((id) => id !== product.id)
          );
        }}
        title="Remove from checkout"
      >
        <FaTrash />
      </button>

    </div>

  ))}

</div>

        </div>


        {/* PRICE DETAILS */}

        <div className={styles.priceContainer}>

          <h2>Price Details</h2>

          <div className={styles.priceRow}>
            <span>Items Price</span>
            <span>₹{actualPrice}</span>
          </div>

          <div className={styles.priceRow}>
            <span>Discount</span>

            <span className={styles.discount}>
              − ₹{discountPrice}
            </span>
          </div>

          <div className={styles.priceRow}>
            <span>Delivery Charges</span>

            <span className={styles.free}>
              FREE
            </span>
          </div>

          <div className={styles.totalRow}>
            <span>Total Amount</span>
            <span>₹{cartTotal}</span>
          </div>


         <button
  className={styles.payButton}
  disabled={!selectedAddress}
  onClick={handlePayment}
>
  Pay ₹{cartTotal}
</button>

          {!selectedAddress && (
            <p className={styles.addressWarning}>
              Please select a delivery address
              before payment.
            </p>
          )}

        </div>

      </div>
    </>
  );
};

export default Checkout;