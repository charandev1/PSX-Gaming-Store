import { useState } from 'react';

import CheckboxInput from 'components/checkboxInput/CheckboxInput.component';
import { useFilterContext } from 'contexts/filter.context';
import { createAction } from 'utils/reducer/createAction';
import PRODUCT_FILTER_ACTION_TYPE from 'reducers/product-filter/productFilterActionType';

import styles from './ProductFilter.styles.module.css';
import { FcEmptyFilter } from 'react-icons/fc';
import { IoClose } from 'react-icons/io5';

const ProductFilter = () => {
  const { dispatch, filtersState, INITIAL_FILTERS_STATE } = useFilterContext();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const inputLabelStyle = {
    display: 'grid',
    gridTemplateColumns: '1em auto',
    gap: '0.5em',
    alignItems: 'center',
  };

  return (
    <>
      <button
        aria-label="open-filters"
        onClick={() => setFiltersOpen((prev) => !prev)}
        className={styles['filters-open-button']}
      >
        <span>
          Apply filters
          <FcEmptyFilter />
        </span>
      </button>
      <div className={`${styles['product-filters-container']} ${filtersOpen ? styles['open'] : ''}`}>
        <div className={styles['filter-header']}>
          <button
            onClick={() => {
              dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.CLEAR_PRODUCTS_FILTER, INITIAL_FILTERS_STATE));
            }}
          >
            Clear All
          </button>
          <button
            className={styles['filters-close-button']}
            aria-label="close filters"
            onClick={() => setFiltersOpen((prev) => !prev)}
          >
            <span>
              <IoClose />
            </span>
          </button>
        </div>
        <div className={styles['product-filter']}>
          <ul>
            <li>
              <label htmlFor="price-range">
                Price Range:
                <input
                  className={styles['price-range']}
                  type="range"
                  name="price"
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.PRICERANGE_FILTER, e.target.value));
                  }}
                  min="2000"
                  max="20000"
                  step="500"
                  value={filtersState.priceRange}
                  id="price-range"
                />
              </label>
            </li>
          </ul>
        </div>
        <div className={styles['product-filter']}>
          <h3 className={styles['filter-heading']}>Sort by</h3>
          <ul>
            <li>
              <label htmlFor="sort-by-low" style={inputLabelStyle}>
                <input
                  className="custom-input"
                  type="radio"
                  name="sortBy"
                  id="sort-by-low"
                  value="ascending"
                  checked={filtersState.sortBy === 'ascending'}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.SORT_FILTER, e.target.value));
                  }}
                />
                Price: Low to High
              </label>
            </li>
            <li>
              <label htmlFor="sort-by-high" style={inputLabelStyle}>
                <input
                  className="custom-input"
                  type="radio"
                  name="sortBy"
                  id="sort-by-high"
                  value="descending"
                  checked={filtersState.sortBy === 'descending'}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.SORT_FILTER, e.target.value));
                  }}
                />
                Price: High to Low
              </label>
            </li>
          </ul>
        </div>
        <div className={styles['product-filter']}>
          <h3 className={styles['filter-heading']}>Availability</h3>
          <ul>
            <CheckboxInput
              className="custom-input"
              id="availability-stock"
              label="Include Out of Stock"
              name="outOfStock"
              checked={filtersState.outOfStock ? true : false}
              onChange={() => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.OUT_OF_STOCK_FILTER, null));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="availability-fastDelivery"
              name="fastDelivery"
              label="Fast Delivery Only"
              checked={filtersState.fastDelivery ? true : false}
              onChange={() => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.FAST_DELIVERY_FILTER, null));
              }}
            />
          </ul>
        </div>
        <div className={styles['product-filter']}>
          <h3 className={styles['filter-heading']}>Category</h3>
          <ul>
            <CheckboxInput
              className="custom-input"
              id="category-game"
              label="Games"
              value="game"
              name="category"
              checked={filtersState.categories.includes('game')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.CATEGORY_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="category-accessories"
              label="Accessories"
              name="category"
              value="accessories"
              checked={filtersState.categories.includes('accessories')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.CATEGORY_FILTER, e.target.value));
              }}
            />
          </ul>
        </div>
        <div className={styles['product-filter']}>
          <h3 className={styles['filter-heading']}>Brands</h3>
          <ul>
            <CheckboxInput
              className="custom-input"
              id="brand-sony"
              label="Sony"
              name="brand"
              value="Sony"
              checked={filtersState.brands.includes('Sony')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-ea"
              label="EA"
              name="brand"
              value="EA"
              checked={filtersState.brands.includes('EA')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-ubisoft"
              label="Ubisoft"
              name="brand"
              value="Ubisoft"
              checked={filtersState.brands.includes('Ubisoft')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-ant"
              label="Ant"
              name="brand"
              value="Ant"
              checked={filtersState.brands.includes('Ant')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-acer"
              label="Acer"
              name="brand"
              value="Acer"
              checked={filtersState.brands.includes('Acer')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-green-soul"
              label="Green Soul"
              name="brand"
              value="GreenSoul"
              checked={filtersState.brands.includes('GreenSoul')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-eureka"
              label="Eureka"
              name="brand"
              value="Eureka"
              checked={filtersState.brands.includes('Eureka')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-razer"
              label="Razer"
              name="brand"
              value="Razer"
              checked={filtersState.brands.includes('Razer')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-red-clutch"
              label="Red Clutch"
              name="brand"
              value="Redclutch"
              checked={filtersState.brands.includes('Redclutch')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
            <CheckboxInput
              className="custom-input"
              id="brand-qbik"
              label="Qbik"
              name="brand"
              value="Qbik"
              checked={filtersState.brands.includes('Qbik')}
              onChange={(e) => {
                dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER, e.target.value));
              }}
            />
          </ul>
        </div>
        {filtersState.categories.includes('game') && (
          <>
            <div className={styles['product-filter']}>
              <h3 className={styles['filter-heading']}>Platform</h3>
              <ul>
                <CheckboxInput
                  className="custom-input"
                  name="platform"
                  label="PC"
                  checked={filtersState.platforms.includes('PC')}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.PLATFORM_FILTER, e.target.value));
                  }}
                  id="platform-pc"
                  value="PC"
                />
                <CheckboxInput
                  className="custom-input"
                  name="platform"
                  label="PlayStation (PS)"
                  checked={filtersState.platforms.includes('PS')}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.PLATFORM_FILTER, e.target.value));
                  }}
                  id="platform-ps"
                  value="PS"
                />
              </ul>
            </div>
            <div className={styles['product-filter']}>
              <h3 className={styles['filter-heading']}>ESRB Rating</h3>
              <ul>
                <CheckboxInput
                  className="custom-input"
                  name="esrbRating"
                  label="Teen"
                  value="Teen"
                  id="esrb-rating-teen"
                  checked={filtersState.esrbRatings.includes('Teen')}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.ESRB_FILTER, e.target.value));
                  }}
                />
                <CheckboxInput
                  className="custom-input"
                  name="esrbRating"
                  label="Everyone"
                  value="Everyone"
                  id="esrb-rating-everyone"
                  checked={filtersState.esrbRatings.includes('Everyone')}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.ESRB_FILTER, e.target.value));
                  }}
                />
                <CheckboxInput
                  className="custom-input"
                  name="esrbRating"
                  label="Mature"
                  value="Mature"
                  id="esrb-rating-mature"
                  checked={filtersState.esrbRatings.includes('Mature')}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.ESRB_FILTER, e.target.value));
                  }}
                />
              </ul>
            </div>
          </>
        )}

        <div className={styles['product-filter']}>
          <h3 className={styles['filter-heading']}>Ratings</h3>
          <ul>
            <li>
              <label htmlFor="rating-4" style={inputLabelStyle}>
                <input
                  className="custom-input"
                  type="radio"
                  name="rating"
                  id="rating-4"
                  value={4}
                  checked={filtersState.rating === 4}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.RATINGS_FILTER, e.target.value));
                  }}
                />
                4 stars & above
              </label>
            </li>
            <li>
              <label htmlFor="rating-3" style={inputLabelStyle}>
                <input
                  className="custom-input"
                  type="radio"
                  name="rating"
                  id="rating-3"
                  value={3}
                  checked={filtersState.rating === 3}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.RATINGS_FILTER, e.target.value));
                  }}
                />
                3 stars & above
              </label>
            </li>
            <li>
              <label htmlFor="rating-3" style={inputLabelStyle}>
                <input
                  className="custom-input"
                  type="radio"
                  name="rating"
                  id="rating-2"
                  value={2}
                  checked={filtersState.rating === 2}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.RATINGS_FILTER, e.target.value));
                  }}
                />
                2 stars & above
              </label>
            </li>
            <li>
              <label htmlFor="rating-1" style={inputLabelStyle}>
                <input
                  className="custom-input"
                  type="radio"
                  name="rating"
                  id="rating-1"
                  value={1}
                  checked={filtersState.rating === 1}
                  onChange={(e) => {
                    dispatch(createAction(PRODUCT_FILTER_ACTION_TYPE.RATINGS_FILTER, e.target.value));
                  }}
                />
                1 star & above
              </label>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
