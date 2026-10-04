import ProductType from 'types/ProductType';
import WishlistButton from 'components/wishlist-button/WishlistButton.component';
import CartButton from 'components/cart-button/CartButton.component';

import styles from './ProductInfo.styles.module.css';

type ProductInfoPropsType = {
  product: ProductType;
};

const ProductInfo = ({ product }: ProductInfoPropsType) => {
  return (
    <>
      <h1 style={{ textAlign: 'center' }}>{product.name}</h1>
      <p>
        <span>Description: </span>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus ducimus amet at dolorem sit magni earum quidem
        illo perspiciatis iure deserunt recusandae minus ullam similique libero tempore, beatae, nisi animi!
      </p>
      <div className={styles['price-container']}>
        <span className={styles['discount-price']}>{product.discountPrice}</span>
        <del className={styles['old-price']}>
          <span className="sr-only" aria-label="old price"></span>
          {product.price}
        </del>
        <span className={styles['discount-percent']}>({product.discount}% Off)</span>
      </div>
      <div className={styles['action-items']}>
        <CartButton className={styles['add-to-cart-button']} wishlistElementType="button" productId={product._id} />
        <div className={styles['wishlist-button-wrapper']}>
          <WishlistButton className={styles['wishlist-icon']} wishlistElementType="icon" productId={product._id} />
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
