import { useState, createContext, useContext } from 'react';
import axios from 'axios';

import ProviderPropsType from 'types/ProviderPropsType';
import ProductType from 'types/ProductType';
import { getFilteredProducts, getSortedProducts } from 'utils/filterProducts';
import { useFilterContext } from 'contexts/filter.context';
import { handleError } from 'utils/displayError';

type ProductContextValueType = {
      products: ProductType[] | null;
      sortedProducts: ProductType[] | null;
      filteredProducts: ProductType[] | null;
      getProducts: () => void;
    }
  | undefined;

const ProductContext = createContext<ProductContextValueType>(undefined);

export const ProductProvider = ({ children }: ProviderPropsType) => {
  const [products, setProducts] = useState<ProductType[] | null>(null);
  const { filtersState } = useFilterContext();
  const sortedProducts = products && getSortedProducts(products, filtersState.sortBy);
  const filteredProducts = sortedProducts && getFilteredProducts(sortedProducts, filtersState);

  const getProducts = async () => {
    if (!products) {
      try {
        const { data, status } = await axios.get('products');
        if (status === 200) {
          setProducts(data.data);
          return data;
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const value = {
    products,
    sortedProducts,
    filteredProducts,
    getProducts,
  };
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProductsContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductProvider');
  }
  return context;
};
