import ProductFilter from 'components/products/product-filter/ProductFilter.component';
import ProductsListing from 'components/products/products-listing/ProductsListing.component';
import Navbar from 'components/nav/Nav.component';
import styles from './ShopPage.styles.module.css';

const ShopPage = () => {
  return (
    <>
      <Navbar />
      <div>
        <main className={styles['shop-page-main']}>
          <div className={`flex ${styles['main-content']}`} style={{ '--gap': '1rem' } as React.CSSProperties}>
            <ProductFilter />
            <ProductsListing />
          </div>
        </main>
      </div>
    </>
  );
};

export default ShopPage;
