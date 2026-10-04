import { Link } from 'react-router-dom';

import ProductType from 'types/ProductType';
import WishlistButton from 'components/wishlist-button/WishlistButton.component';

import styles from './ProductCard.styles.module.css';

type ProductCardType = {
  product: ProductType;
};

const ProductCard = ({ product }: ProductCardType) => {
  if (product) {
    return (
      <div className={styles['product-container']} key={product._id}>
        <div className={styles['product-image-container']}>
          <Link to={`/products/${product._id}`}>
            <div className={styles['overlay']}></div>
            <img
              loading="lazy"
              className={styles['product-image']}
              src={product.media.imageSrc[0]}
              alt={product.name}
            />
          </Link>
        </div>
        <div className={styles['product-container-info']}>
          <div className="flex jc-space-btwn">
            <h3>{product.brand}</h3>
            <span className="cursor-pointer">
              <WishlistButton wishlistElementType="icon" productId={product._id} />
            </span>
          </div>
          <p className={styles['product-name']}>{product.name}</p>
          <div className={styles['price-container']}>
            <span>{product.discountPrice} &#8377;</span>
            <del>
              <span className="sr-only" aria-label="old price"></span>
              {product.price}
            </del>
          </div>
        </div>
        <span className={styles['discount-percent']}>-{product.discount}%</span>
      </div>
    );
  }
  return null;
};

export default ProductCard;
