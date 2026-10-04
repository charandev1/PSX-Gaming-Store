import { useEffect } from 'react';

import { useProductsContext } from 'contexts/products.context';
import ProductType from 'types/ProductType';
import { getFilteredProducts, getSortedProducts } from 'utils/filterProducts';
import { useFilterContext } from 'contexts/filter.context';
import ProductCard from 'components/products/product-card/ProductCard';

import styles from './ProductsListing.styles.module.css';

const ProductsListing = () => {
  const { products, getProducts } = useProductsContext();
  const { filtersState } = useFilterContext();
  const sortedProducts = products && getSortedProducts(products, filtersState.sortBy);
  const filteredProducts = sortedProducts && getFilteredProducts(sortedProducts, filtersState);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <div className={styles['products-list-container']}>
      {filteredProducts
        ? filteredProducts.map((product: ProductType) => <ProductCard key={product._id} product={product} />)
        : null}
    </div>
  );
};

export default ProductsListing;
