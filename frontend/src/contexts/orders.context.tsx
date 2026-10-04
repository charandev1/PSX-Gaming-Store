import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ProviderPropsType from '../types/ProviderPropsType';
import { OrderType } from 'types/OrderType';
import { useUserContext } from './user.context';
import { useAuthContext } from './auth.context';
import { useCartContext } from './cart.context';
import { handleError } from 'utils/displayError';

type OrderContextType = {
      orders: OrderType[] | null;
      addNewOrder: (orderAmount: number) => any;
      getOrders: () => any;
      updateOrderStatus: (orderStatus: string, orderId: string) => any;
      setOrders: React.Dispatch<React.SetStateAction<any>>;
    }
  | undefined;

const OrdersContext = createContext<OrderContextType>(undefined);

export const OrdersProvider = ({ children }: ProviderPropsType) => {
  const [orders, setOrders] = useState<OrderType[] | null>(null);
  const { cartList, clearCartList } = useCartContext();
  const { userInfo } = useUserContext();
  const { useAxiosPrivate, clearAxiosInterceptors } = useAuthContext();
  const { axiosPrivate, requestInterceptor, responseInterceptor } = useAxiosPrivate();
  const navigate = useNavigate();
  const deliveryAddress = userInfo?.address.find((userAddress) => userAddress.isDeliveryAddress);

  useEffect(() => {
    return () => {
      clearAxiosInterceptors(responseInterceptor, requestInterceptor);
    };
  }, [clearAxiosInterceptors, requestInterceptor, responseInterceptor]);

  const getOrders = async () => {
    try {
      const { data, status } = await axiosPrivate.get('orders');
      if (status === 200 && data.data) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const addNewOrder = async (orderAmount: number) => {
    try {
      const { data, status } = await axiosPrivate.post('orders', {
        items: cartList,
        shippingAddress: { ...deliveryAddress },
        billingAddress: { ...deliveryAddress },
        amount: orderAmount,
        timestamp: Date.now(),
      });
      if (status === 200) {
        await clearCartList();
        return data.data.addedItem;
      }
    } catch (error) {
      navigate('/cart');
      handleError(error);
    }
  };

  const updateOrderStatus = async (orderStatus: string, orderId: string) => {
    try {
      await axiosPrivate({
        url: 'orders',
        method: 'PATCH',
        params: { status: orderStatus },
        data: { orderId },
      });
    } catch (error) {
      handleError(error);
    }
  };

  const value = {
    orders,
    setOrders,
    getOrders,
    addNewOrder,
    updateOrderStatus,
  };
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export function useOrdersContext() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrdersContext must be used within a OrdersProvider');
  }
  return context;
}
