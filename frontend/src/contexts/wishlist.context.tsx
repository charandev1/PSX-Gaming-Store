import React, { createContext, useEffect, useState } from 'react';

import ProviderPropsType from '../types/ProviderPropsType';
import { useAuthContext } from './auth.context';
import { handleError } from 'utils/displayError';
import ProductType from 'types/ProductType';

import { showToastSuccessMessage } from 'utils/toastMessage';

type WishlistContextValueType = {
      wishlist: ProductType[] | null;
      addToWishlist: (item: any) => any;
      removeFromWishlist: (item: any) => any;
      wishlistCount: number | null;
      setWishlist: React.Dispatch<React.SetStateAction<ProductType[] | null>>;
    }
  | undefined;

export const WishlistContext = createContext<WishlistContextValueType>(undefined);

export const WishlistProvider = ({ children }: ProviderPropsType) => {
  const [wishlist, setWishlist] = useState<ProductType[] | null>(null);
  const wishlistCount = wishlist ? wishlist.length : null;
  const { useAxiosPrivate, signedIn, accessToken, clearAxiosInterceptors } = useAuthContext();
  const { axiosPrivate, requestInterceptor, responseInterceptor } = useAxiosPrivate();

  useEffect(() => {
    return () => {
      clearAxiosInterceptors(responseInterceptor, requestInterceptor);
    };
  }, [clearAxiosInterceptors, requestInterceptor, responseInterceptor]);

  useEffect(() => {
    if (accessToken && !wishlist) {
      (async () => {
        try {
          const { data, status } = await axiosPrivate.get('wishlist');
          if (status === 200) {
            data.data && setWishlist(data.data);
          }
        } catch (error) {
          handleError(error);
        }
      })();
    } else if (!signedIn) {
      setWishlist(null);
    }
  }, [signedIn, accessToken, wishlist, setWishlist, axiosPrivate]);

  const addToWishlist = async (item: string) => {
    try {
      const { data, status } = await axiosPrivate.post('wishlist', {
        productId: item,
      });
      if (status === 201 || status === 200) {
        setWishlist((prev) => (prev ? [...prev, data.data.addedItem] : [...data.data.addedItem]));
        showToastSuccessMessage(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const removeFromWishlist = async (item: string) => {
    try {
      const { data, status } = await axiosPrivate.patch('wishlist', {
        productId: item,
      });
      if (status === 200) {
        setWishlist((prev) =>
          prev ? prev.filter((wishlistItem) => wishlistItem._id !== data.data.removedItem) : prev,
        );
        showToastSuccessMessage(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    wishlistCount,
    setWishlist,
  };
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlistContext = () => {
  const context = React.useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlistContext must be used within a WishlistProvider');
  }
  return context;
};
