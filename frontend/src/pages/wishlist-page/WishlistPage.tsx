import { useWishlistContext } from 'contexts/wishlist.context';
import Navbar from 'components/nav/Nav.component';
import ProductCard from 'components/products/product-card/ProductCard';

import styles from './WishlistPage.styles.module.css';

const WishlistPage = () => {
  const { wishlist } = useWishlistContext();
  if (wishlist && wishlist.length > 0) {
    return (
      <>
        <Navbar />
        <h1 style={{ textAlign: 'center' }}>My Wishlist</h1>
        <div className={styles['wishlist-container']}>
          {wishlist.map((item) => (item ? <ProductCard key={item._id} product={item} /> : null))}
        </div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <div className={styles['empty-page-wrapper']}>
        <img className={styles['empty-wishlist-img']} src="/assets/void.svg" alt="man looking into the void" />
        <p>No Wishlist items</p>
      </div>
    </>
  );
};

export default WishlistPage;
