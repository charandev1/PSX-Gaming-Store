import { useNavigate } from 'react-router-dom';

import { useWishlistContext } from 'contexts/wishlist.context';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useAuthContext } from 'contexts/auth.context';

import styles from './WishlistButton.styles.module.css';

type WishlistButtonPropsType = {
  wishlistElementType: 'icon' | 'button' | 'nav-icon';
  productId?: string;
  className?: string;
};

const WishlistButton = ({ wishlistElementType, productId, className }: WishlistButtonPropsType) => {
  const { wishlist, addToWishlist, removeFromWishlist, wishlistCount } = useWishlistContext();
  const { signedIn } = useAuthContext();
  const isWishlistItem = wishlist?.find((item) => item._id === productId);
  const navigate = useNavigate();
  
  if (wishlistElementType === 'icon') {
    return (
      <>
        {isWishlistItem ? (
          <FaHeart className={className} color="red" onClick={() => removeFromWishlist(productId)} />
        ) : (
          <FaRegHeart className={className} onClick={() => {
            signedIn
            ? addToWishlist(productId)
            : navigate('/signin')
          } 
        }/>
        )}
      </>
    );
  } else if (wishlistElementType === 'nav-icon') {
    return (
      <>
        <div className={styles['wishlist-icon-wrapper']}>
          <FaRegHeart size="24" />
          {signedIn && wishlistCount ? <span className="count-icon fw-500">{wishlistCount}</span> : null}
        </div>
      </>
    );
  }
  return isWishlistItem ? (
    <button className={className} onClick={() => removeFromWishlist(productId)}>
      Remove from Wishlist
    </button>
  ) : (
    <button className={className} onClick={() => addToWishlist(productId)}>
      Add to Wishlist
    </button>
  );
};

export default WishlistButton;
