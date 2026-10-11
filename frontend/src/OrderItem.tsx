import { useEffect, useState } from "react";
import api from "./api";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "./contexts/user.context";
import HomePageBody from "./HomePageBody";
import styles from "./OrderItem.module.css";

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
}

interface Product {
  id: number;
  name: string;
  imageSrc: string[];
  price: number;
  discountPrice?: number;
}

const OrderItem = () => {

  const { orderId } = useParams();
  const { userInfo } = useUserContext();
  const navigate = useNavigate();

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

 
useEffect(() => {
  if (!userInfo) {
    navigate("/signin", { replace: true });
    return;
  }

  if (!orderId) {
    navigate("/orders");
    return;
  }

  const fetchOrderItems = async () => {
    try {
      const [itemsResponse, productsResponse] = await Promise.all([
        api.get("/order-items", {
          params: {
            orderId: orderId,
          },
        }),

        api.get("/products"),
      ]);

      setOrderItems(itemsResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
        console.error(
          "Failed to fetch order items:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchOrderItems();

  }, [userInfo, orderId, navigate]);


  if (loading) {

    return (
      <>
        <HomePageBody />

        <div className={styles.loading}>
          Loading order details...
        </div>
      </>
    );

  }


  const orderedProducts = products.filter((product) =>
    orderItems.some(
      (item) => item.productId === product.id
    )
  );


  return (
    <>
      <HomePageBody />

      <div className={styles.orderItemContainer}>

        <div className={styles.header}>

          <button
            className={styles.backButton}
            onClick={() => navigate("/orders")}
          >
            ← Back to Orders
          </button>

          <h1>
            Order #{orderId}
          </h1>

        </div>


        {orderedProducts.length === 0 ? (

          <div className={styles.empty}>
            No products found for this order.
          </div>

        ) : (

          <div className={styles.products}>

            {orderedProducts.map((product) => (

              <div
                className={styles.productCard}
                key={product.id}
              >

                <img
                  src={product.imageSrc[0]}
                  alt={product.name}
                  className={styles.productImage}
                />

                <div className={styles.productInfo}>

                  <h2>
                    {product.name}
                  </h2>

                  <p>
                    ₹{product.discountPrice ?? product.price}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </>
  );
};

export default OrderItem;