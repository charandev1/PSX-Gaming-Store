import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useUserContext } from 'contexts/user.context';
import { useAuthContext } from 'contexts/auth.context';
import WishlistButton from 'components/wishlist-button/WishlistButton.component';
import CartButton from 'components/cart-button/CartButton.component';
import SearchBar from './search-bar/SearchBar.component';

import styles from './Nav.styles.module.css';
import { FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';

const Navbar = ({ posSticky }: { posSticky?: boolean }) => {
  const location = useLocation();
  const { userInfo, userSignOutHandler } = useUserContext();
  const { signedIn } = useAuthContext();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleDropdown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, state: boolean) => {
    if (state) {
      setIsDropDownOpen(state);
      event.currentTarget.setAttribute('aria-expanded', `${state}`);
    } else if (!state) {
      setIsDropDownOpen(state);
      event.currentTarget.setAttribute('aria-expanded', `${state}`);
    }
  };

  const dropDownMenuStyle = isDropDownOpen
    ? ({
        display: 'block',
        position: 'absolute',
        color: 'var(--clr-black)',
        backgroundColor: 'var(--clr-neutral)',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid #878787',
      } as React.CSSProperties)
    : ({ display: 'none' } as React.CSSProperties);

  return (
    <>
      {location.pathname === '/' && (
        <header className={styles.header}>
          <Link to="">Free 1-3 Day Shipping Over &#8377;5000</Link>
        </header>
      )}
      <nav className={`${styles.nav} ${!posSticky && styles['not-sticky']}`}>
        <Link to="/">
          <span className="logo-container">
            <span className="text-uppercase logo-text">Game</span>
            <span className="logo-x"></span>
          </span>
        </Link>
        {location.pathname === '/products' && <SearchBar />}
        <div className={styles['nav-menu']}>
          <Link to="/products" className="fw-500">
            Shop
          </Link>
          {signedIn ? (
            <div
              className={styles['sign-in-component']}
              aria-expanded={false}
              onMouseEnter={(e) => handleDropdown(e, true)}
              onMouseLeave={(e) => handleDropdown(e, false)}
              onClick={() => setIsDropDownOpen(true)}
            >
              <span className={styles['user-wrapper']}>
                <span className={`fw-500 ${styles['username']}`}>
                  <span>{userInfo?.firstName}</span>
                  <FaUserAlt className={styles['user-icon']} />
                </span>
                <span role="button" aria-label="user menu toggle">
                  <IoIosArrowDown
                    size="20"
                    className={`${styles['drop-down-arrow']} ${isDropDownOpen ? styles['transform'] : ''}`}
                  />
                </span>
              </span>
              <div className={styles['drop-down-menu']} style={dropDownMenuStyle}>
                <ul style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
                  <li>
                    <Link to="/orders" className={styles['drop-down-menu-item']}>
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/address" className={styles['drop-down-menu-item']}>
                      Addresses
                    </Link>
                  </li>
                  <li>
                    <button
                      className={`${styles['logout-button']} ${styles['drop-down-menu-item']}`}
                      onClick={userSignOutHandler}
                    >
                      Signout
                      <FaSignOutAlt />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link to="/signin" className="fw-500">
              Sign In
            </Link>
          )}

          <Link to={signedIn ? '/wishlist' : '/signin'}>
            <WishlistButton wishlistElementType="nav-icon" />
          </Link>
          <Link to={signedIn ? '/cart' : '/signin'}>
            <CartButton wishlistElementType="nav-icon" />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
