import { useState } from 'react';

import { createAction } from 'utils/reducer/createAction';
import PRODUCT_FILTER_ACTION_TYPE from 'reducers/product-filter/productFilterActionType';
import { useFilterContext } from 'contexts/filter.context';

import styles from '../Nav.styles.module.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const { dispatch } = useFilterContext();
  const [searchBarFocus, setSearchBarFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleClick = () => {};

  return (
    <form className={`${styles['search-wrapper']} ${searchBarFocus && styles['active']}`}>
      <input
        className={styles['search-input']}
        type="search"
        placeholder="Search games, consoles & more"
        value={searchValue}
        onFocus={() => setSearchBarFocus(true)}
        onBlur={() => setSearchBarFocus(false)}
        onChange={(e) => {
          dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.SEARCH_FILTER, e.target.value));
          setSearchValue(e.target.value);
        }}
      />
      <button
        className={styles['search-submit-button']}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <span className="sr-only">search</span>
        <span>
          {' '}
          <FaSearch />{' '}
        </span>
      </button>
    </form>
  );
};

export default SearchBar;
