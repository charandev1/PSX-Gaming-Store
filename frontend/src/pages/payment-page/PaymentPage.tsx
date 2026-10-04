import { useEffect, useState, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

import CheckoutForm from 'components/checkout-form/CheckoutForm.component';
import { useUserContext } from 'contexts/user.context';
import { useCartContext } from 'contexts/cart.context';
import { useAuthContext } from 'contexts/auth.context';
import { useOrdersContext } from 'contexts/orders.context';

import { showToastInfoMessage } from 'utils/toastMessage';
import styles from './PaymentPage.styles.module.css';

const PaymentPage = () => {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [clientSecret, setClientSecret] = useState<string>();
  const { userInfo } = useUserContext();
  const { cartList } = useCartContext();
  const { addNewOrder } = useOrdersContext();
  const [orderId, setOrderId] = useState<string>();
  const deliveryAddress = userInfo?.address.find((userAddress) => userAddress.isDeliveryAddress);
  const isCheckoutFormDisplayed = stripePromise && clientSecret && orderId && deliveryAddress;
  const { useAxiosPrivate, signedIn, clearAxiosInterceptors } = useAuthContext();
  const { axiosPrivate, requestInterceptor, responseInterceptor } = useAxiosPrivate();
  const onMountRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      clearAxiosInterceptors(responseInterceptor, requestInterceptor);
    };
  }, [clearAxiosInterceptors, requestInterceptor, responseInterceptor]);

  useEffect(() => {
    if (signedIn && !onMountRef.current) {
      if (deliveryAddress) {
        setStripePromise(loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`));
        (async () => {
          const { data, status } = await axiosPrivate.post('create-payment-intent', {
            items: cartList,
          });
          if (status === 200) {
            setClientSecret(data.clientSecret);
            const newOrderId = await addNewOrder(data.amount);
            setOrderId(newOrderId);
          }
        })();
      } else {
        showToastInfoMessage('Set a delivery address');
        navigate('/address');
      }
    }

    return () => {
      onMountRef.current = true;
    };
  }, [addNewOrder, axiosPrivate, cartList, deliveryAddress, navigate, signedIn]);

  return (
    <div className={styles['payment-page']}>
      <h1 style={{ textAlign: 'center' }} className={styles['main-heading']}>
        Payment Gateway
      </h1>
      <p style={{ textAlign: 'center' }} className={styles['disclaimer']}>
        please do not refresh
      </p>
      {isCheckoutFormDisplayed && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat' } }}>
          <CheckoutForm orderId={orderId} deliveryAddress={deliveryAddress} />
        </Elements>
      )}
      <div className={styles['payment-logo']}>
        <img src="/assets/Powered-by-Stripe-Logo.svg" alt="powered by stripe" />
      </div>
    </div>
  );
};

export default PaymentPage;
