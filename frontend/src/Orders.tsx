import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./contexts/user.context";
import HomePageBody from "./HomePageBody";
import styles from "./Orders.module.css";

interface Order {
  id: number;
  userId: number;
  addressId: number;
  totalAmount: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: string;
  createdAt: string;
}
interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
}
interface Product {
  id: number;
  name: string;
  imageSrc: string[];
}

const Orders = () => {
  const { userInfo } = useUserContext();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<
  Record<number, OrderItem[]>
>({});
const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin", { replace: true });
      return;
    }

    const fetchOrders = async () => {
  try {
    const [ordersResponse, productsResponse] = await Promise.all([
      axios.get("http://localhost:8080/order", {
        params: {
          userId: userInfo.id,
        },
      }),

      axios.get("http://localhost:8080/products"),
    ]);

    setOrders(ordersResponse.data);
    setProducts(productsResponse.data);

    const itemsMap: Record<number, OrderItem[]> = {};

    await Promise.all(
      ordersResponse.data.map(async (order: Order) => {
        try {
          const itemResponse = await axios.get(
            "http://localhost:8080/order-items",
            {
              params: {
                orderId: order.id,
              },
            }
          );

          itemsMap[order.id] = itemResponse.data;
        } catch (error) {
          console.error(
            `Failed to fetch items for order ${order.id}:`,
            error
          );

          itemsMap[order.id] = [];
        }
      })
    );

    setOrderItems(itemsMap);

  } catch (error) {
    console.error("Failed to fetch orders:", error);
  } finally {
    setLoading(false);
  }
};

    fetchOrders();
  }, [userInfo, navigate]);

  if (loading) {
    return (
      <>
        <HomePageBody />

        <div className={styles.loading}>
          Loading your orders...
        </div>
      </>
    );
  }

  return (
    <>
      <HomePageBody />

      <div className={styles.ordersContainer}>

        <h1 className={styles.ordersTitle}>
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className={styles.emptyOrders}>
            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className={styles.shopButton}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className={styles.ordersList}>

            {orders.map((order) => (

              <div
            className={styles.orderCard}
                  key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                  <p className={styles.viewOrder}>
  View Order →
</p>
                <div className={styles.orderHeader}>

                  <div>
                    <h2>
                      Order #{order.id}
                    </h2>

                    <p>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className={styles.status}>
                    {order.status}
                  </span>

                </div>

                <div className={styles.orderDetails}>
                  <div className={styles.orderItems}>

  <span>Items</span>

  {orderItems[order.id]?.map((item) => {

    const product = products.find(
      (p) => p.id === item.productId
    );

    return (
      <div
        key={item.id}
        className={styles.orderItem}
      >

        {product?.imageSrc?.[0] && (
          <img
            src={product.imageSrc[0]}
            alt={product.name}
            className={styles.orderItemImage}
          />
        )}

        <strong>
          {product?.name ?? `Product #${item.productId}`}
        </strong>

        <span>
          × {item.quantity}
        </span>

      </div>
    );
  })}

</div>
                  <div>
                    <span>Order Amount</span>
                    <strong>
                      ₹{order.totalAmount}
                    </strong>
                  </div>

                  <div>
                    <span>Address ID</span>
                    <strong>
                      {order.addressId}
                    </strong>
                  </div>

                  <div>
                    <span>Payment ID</span>
                    <strong>
                      {order.razorpayPaymentId}
                    </strong>
                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </>
  );
};

export default Orders;