import styles from './HomePage.module.css';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { FaShoppingCart } from "react-icons/fa";
import { FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useUserContext } from './contexts/user.context';
import { useWishlist } from "./useWishlist";
import axios from "axios";
import psxLogo from "./assets/psxlogo.png";
// import { useFilterContext } from './contexts/filter.context';
// import { createAction } from './utils/reducer/createAction';
// import PRODUCT_FILTER_ACTION_TYPE from './reducers/product-filter/productFilterActionType';

const HomePageBody = () => {
const { userInfo, userSignOutHandler } = useUserContext();
const { wishlistedIds } = useWishlist(userInfo?.id);
const [cartIds, setCartIds] = useState<number[]>([]);

const [isDropDownOpen, setIsDropDownOpen] = useState(false);

const [dropDownMenuStyle, setDropDownMenuStyle] = useState({
  display: "none",
});
const handleDropdown = (_e: React.MouseEvent, open: boolean) => {
  setIsDropDownOpen(open);

  setDropDownMenuStyle({
    display: open ? "block" : "none",
  });
};

useEffect(() => {
  if (!userInfo) {
    setCartIds([]);
    return;
  }

  axios
    .get("http://localhost:8080/cartlist", {
      params: { userId: userInfo.id },
    })
    .then(res => setCartIds(res.data))
    .catch(error => {
      console.error("Failed to fetch cart count", error);
      setCartIds([]);
    });
}, [userInfo]);
const handleLogout = () => {
  userSignOutHandler();
};
// const { dispatch } = useFilterContext();
const [searchValue, setSearchValue] = useState("");
const navigate = useNavigate();
  return (
    <nav className={styles.main}>
  <div className={styles.navbar}>

    {/* LEFT SIDE */}
    <div className={styles.leftNav}>
     <Link to="/" className={styles.logoLink}>
  <img
    src={psxLogo}
    alt="PSX Gaming Store"
    className={styles.logoImage}
  />
</Link>

     <form
  className={styles.searchBar}
  onSubmit={(e) => {
    e.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(query)}`);
  }}
>
  <input
    type="search"
    placeholder="Search Games, Consoles & More..."
    value={searchValue}
    onChange={(e) => setSearchValue(e.target.value)}
  />

  <button type="submit" className={styles.searchButton}>
    <FiSearch className={styles.searchIcon} />
  </button>
</form>

      <div ><Link to="/products" className={styles.shop}>
            Shop
          </Link></div>
    </div>

    {/* RIGHT SIDE */}
    <div className={styles.rightNav}>
  {userInfo ? (
  <div
    className={styles['sign-in-component']}
    aria-expanded={isDropDownOpen}
    onMouseEnter={(e) => handleDropdown(e, true)}
    onMouseLeave={(e) => handleDropdown(e, false)}
    onClick={() => setIsDropDownOpen(true)}
  >
    <span className={styles['user-wrapper']}>

      <span className={`fw-500 ${styles['username']}`}>
        <span>{userInfo.name}</span>
        <FaUserAlt className={styles['user-icon']} />
      </span>

      <span role="button" aria-label="user menu toggle">
        <IoIosArrowDown
          size="20"
          className={`${styles['drop-down-arrow']} ${
            isDropDownOpen ? styles['transform'] : ''
          }`}
        />
      </span>

    </span>

    <div
      className={styles['drop-down-menu']}
      style={dropDownMenuStyle}
    >
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem'
        }}
      >
        <li>
          <Link
            to="/orders"
            className={styles['drop-down-menu-item']}
          >
            Orders
          </Link>
        </li>

        <li>
          <Link
            to="/address"
            className={styles['drop-down-menu-item']}
          >
            Addresses
          </Link>
        </li>

        <li>
          <button
            className={`${styles['logout-button']} ${styles['drop-down-menu-item']}`}
            onClick={handleLogout}
          >
            Signout
            <FaSignOutAlt />
          </button>
        </li>
      </ul>
    </div>

  </div>
  ) : (
    <Link to="/signin" className={styles.signin}>
      Sign In
    </Link>
  )}

 <Link to="/wishlist" className={styles.wishlistLink}>
  <div className={styles.elementBox}>
    <div className={styles.wishlistIconWrapper}>
      <FaRegHeart className={styles.heartIcon} />

      {wishlistedIds.length > 0 && (
        <span className={styles.wishlistBadge}>
          {wishlistedIds.length}
        </span>
      )}
    </div>
  </div>
</Link>

  <Link to="/cartlist" className={styles.cartLink}>
  <div className={styles.elementBox}>
    <div className={styles.cartIconWrapper}>
      <FaShoppingCart className={styles.icon} />

      {cartIds.length > 0 && (
        <span className={styles.cartBadge}>
          {cartIds.length}
        </span>
      )}
    </div>

    <span>Cart</span>
  </div>
</Link>
</div>

  </div>
</nav>


  );
};

export default HomePageBody;
