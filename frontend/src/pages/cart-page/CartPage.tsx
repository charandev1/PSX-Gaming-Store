import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCartContext } from 'contexts/cart.context';
import { useUserContext } from 'contexts/user.context';
import Navbar from 'components/nav/Nav.component';
import AddressModal from './AddressModal.component';
import AddressForm from 'components/address-form/AddressForm.component';

import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import Loader from 'components/loader/Loader.component';
import styles from './CartPage.styles.module.css';

const CartPage = () => {
  const { cartList, increaseItemQty, decreaseItemQty, removeFromCart, cartLoader, getCartTotal } = useCartContext();
  const cartTotal = getCartTotal();
  const { userInfo } = useUserContext();
  const navigate = useNavigate();
  const [isAddressesModalOpen, setIsAddressesModalOpen] = useState(false);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const deliveryAddress = userInfo?.address.find((el) => el.isDeliveryAddress);
  const actualPrice = cartList?.reduce((prev, curr) => curr.product.price * curr.count + prev, 0);
  const discountPrice = cartTotal && actualPrice && <span>&#8377;{Math.abs(cartTotal - actualPrice)}</span>;
  let deliveryAddressContent = null;

  if (cartList && cartList.length > 0) {
    if (deliveryAddress) {
      deliveryAddressContent = (
        <div className={styles['address-container']}>
          {userInfo?.address.map((option, idx) =>
            option._id === deliveryAddress._id ? (
              <div key={option.name + idx} className={styles['address-content']}>
                <span className="fw-500">Deliver To:</span>{' '}
                <span>
                  {option.name}, {option.postalCode}
                </span>{' '}
                <span className={styles['address-type']}>{option.addressType}</span>
                <p>
                  {option.line1} {option.city} {option.state}
                </p>
              </div>
            ) : null,
          )}
          <button
            className={styles['change-address-button']}
            onClick={() => {
              setIsAddressesModalOpen((prev) => !prev);
            }}
          >
            Change
          </button>
        </div>
      );
    } else if (userInfo?.address) {
      deliveryAddressContent = (
        <div className={styles['address-container']}>
          Select a delivery address
          <button
            className={styles['change-address-button']}
            onClick={() => {
              setIsAddressesModalOpen((prev) => !prev);
            }}
          >
            Select
          </button>
        </div>
      );
    } else {
      deliveryAddressContent = (
        <div className={styles['address-container']}>
          Add a delivery address
          <button
            className={styles['change-address-button']}
            onClick={() => {
              setIsAddressesModalOpen((prev) => !prev);
            }}
          >
            Select
          </button>
        </div>
      );
    }

    return (
      <>
        {isAddressesModalOpen && (
          <AddressModal
            setIsAddressesModalOpen={setIsAddressesModalOpen}
            setIsNewAddressModalOpen={setIsNewAddressModalOpen}
            deliveryAddressId={deliveryAddress ? deliveryAddress._id : null}
          />
        )}
        {isNewAddressModalOpen && <AddressForm editMode={false} setIsAddressModalOpen={setIsNewAddressModalOpen} />}
        <Navbar />
        <div className={styles['cart-wrapper']}>
          {cartLoader && <Loader />}
          <div>
            {deliveryAddressContent}
            <div className={styles['cart-list-container']}>
              {cartList.map((item) => (
                <div className={styles['cart-list-item']} key={item.product._id}>
                  <div className={styles['cart-list-item-image-container']}>
                    <img
                      className={styles['product-image']}
                      src={item.product.media.imageSrc[0]}
                      alt={item.product.name}
                    />
                  </div>
                  <div className={styles['cart-item-info']}>
                    <h3 className={styles['product-name']}>{item.product.name}</h3>
                    <div className={styles['seller-name']}>Seller: Game-X smart</div>
                    <div className={styles['item-price-container']}>
                      <span className={styles['discount-price']}>&#8377;{item.product.discountPrice}</span>
                      <del className={styles['old-price']}>
                        <span className="sr-only" aria-label="old price"></span>
                        &#8377;{item.product.price}
                      </del>
                      <span className={styles['discount-percent']}>({item.product.discount}% Off)</span>
                    </div>
                    <span className={styles['quantity-container']}>
                      Quantity:
                      <button
                        className={styles['quantity-button']}
                        aria-label="decrease item quantity by one"
                        onClick={() => decreaseItemQty(item._id)}
                      >
                        <FaMinusCircle />
                      </button>
                      <span className={styles['item-count']}>{item.count}</span>
                      <button
                        className={styles['quantity-button']}
                        aria-label="increase item quantity by one"
                        onClick={() => increaseItemQty(item._id)}
                      >
                        <FaPlusCircle />
                      </button>
                    </span>
                    <button className={styles['remove-item-button']} onClick={() => removeFromCart(item._id)}>
                      Remove from cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles['price-container']}>
            <div className="text-uppercase fw-500 heading-3">price details</div>
            <ul className={styles['price-details-list']}>
              <li className={styles['price-container-row']}>
                <span>Items Price:</span> <span className="fw-500">{actualPrice}</span>
              </li>
              <li className={styles['price-container-row']}>
                Discount:{' '}
                <span style={{ color: '#388e3c', fontWeight: '500' }}>&minus; {discountPrice && discountPrice}</span>
              </li>
              <li className={styles['price-container-row']}>
                <span>Delivery Charges:</span>
                <span style={{ color: '#388e3c', fontWeight: '500' }}>FREE</span>
              </li>
            </ul>
            <div className={`${styles['price-container-row']} ${styles['total-amount']}`}>
              <span className={styles['sub-heading']}>Total Amount</span>
              <span>{cartTotal}</span>
            </div>
            <button className={styles['checkout-button']} onClick={() => navigate('/checkout')}>
              Checkout
            </button>
            <div style={{ color: '#388e3c', fontWeight: '500', textAlign: 'center' }}>
              You will save {discountPrice && discountPrice} on this order
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles['cart-wrapper']}>
        <img
          className={styles['empty-cart-img']}
          src="/assets/empty_cart.svg"
          alt="A Man with an empty cart holding a list"
        />
        <div className={styles['empty-cart-container']}>
          <span>Cartlist is empty!</span>
          <p>Add Items to it now.</p>
          <Link to="/products" className={styles['shop-now']}>
            Shop now
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartPage;
