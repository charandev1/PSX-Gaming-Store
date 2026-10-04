import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

import { AddressType } from 'types/AddressType';
import { useAuthContext } from 'contexts/auth.context';
import { useOrdersContext } from 'contexts/orders.context';

import styles from './CheckoutForm.styles.module.css';
import { showToastErrorMessage, showToastSuccessMessage } from 'utils/toastMessage';
import { FaRegClipboard } from 'react-icons/fa';

export default function CheckoutForm({ orderId, deliveryAddress }: { orderId: string; deliveryAddress: AddressType }) {
  const [message, setMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { useAxiosPrivate, clearAxiosInterceptors } = useAuthContext();
  const { requestInterceptor, responseInterceptor } = useAxiosPrivate();
  const { updateOrderStatus } = useOrdersContext();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      clearAxiosInterceptors(responseInterceptor, requestInterceptor);
    };
  }, [clearAxiosInterceptors, requestInterceptor, responseInterceptor]);

  const copyToClipboard = async () => {
    navigator.clipboard.writeText('4242424242424242');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        payment_method_data: {
          billing_details: {
            address: {
              city: deliveryAddress.city,
              country: deliveryAddress.country,
              line1: deliveryAddress.line1,
              postal_code: deliveryAddress.postalCode,
              state: deliveryAddress.state,
            },
            name: deliveryAddress ? deliveryAddress?.name : 'Guest',
          },
        },
        shipping: {
          name: deliveryAddress ? deliveryAddress?.name : 'Guest',
          address: {
            city: deliveryAddress.city,
            country: deliveryAddress.country,
            line1: deliveryAddress.line1,
            postal_code: deliveryAddress.postalCode,
            state: deliveryAddress.state,
          },
        },
        return_url: `${window.location.origin}/orders`,
      },
      redirect: 'if_required',
    });

    setIsProcessing(false);
    if (error) {
      setMessage(error.message);
    } else if (paymentIntent?.status === 'succeeded') {
      showToastSuccessMessage('Payment completed');
      await updateOrderStatus(paymentIntent?.status, orderId);
      navigate(`/orders/${orderId}`);
    } else if (paymentIntent?.status === 'canceled') {
      showToastErrorMessage('Payment Failed, retry again!');
      navigate('/cart');
    }
  };

  return (
    <div className={styles['payment-wrapper']}>
      <form id={styles['payment-form']} onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button disabled={isProcessing} id="submit" className={styles['pay-button']}>
          <span id="button-text">{isProcessing ? `...processing` : 'Pay now'}</span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
      <div className={styles['test-card-details']}>
        <span className="heading-3">Test Card details</span>
        <span>Expiration date: any future date</span>
        <span>CVC/CVV: any three digit number</span>
        <button title="Copy to clipboard" className={styles['clipboard']} type="button" onClick={copyToClipboard}>
          <span>
            <span>4242</span>
            <span>4242</span>
            <span>4242</span>
            <span>4242</span>
          </span>
          <FaRegClipboard />
        </button>
      </div>
    </div>
  );
}
