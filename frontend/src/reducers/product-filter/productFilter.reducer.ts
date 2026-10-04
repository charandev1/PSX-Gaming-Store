import PRODUCT_FILTER_ACTION_TYPE from './productFilterActionType';
import type { FiltersStateType } from '../../types/FiltersStateType';

type ReducerActionType = {
  type: keyof typeof PRODUCT_FILTER_ACTION_TYPE;
  payload: any;
};

const updateFilterArray = (filtersState: FiltersStateType, value: string, changedProperty: keyof FiltersStateType) => {
  if ((filtersState[changedProperty] as string[]).includes(value)) {
    return {
      ...filtersState,
      [changedProperty]: (filtersState[changedProperty] as string[]).filter((existingValue) => existingValue !== value),
    };
  } else {
    return {
      ...filtersState,
      [changedProperty]: [...(filtersState[changedProperty] as string[]), value],
    };
  }
};

const productFilterReducer = (state: FiltersStateType, action: ReducerActionType) => {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_FILTER_ACTION_TYPE.BRAND_FILTER:
      return updateFilterArray(state, payload, 'brands');
    case PRODUCT_FILTER_ACTION_TYPE.CATEGORY_FILTER:
      return updateFilterArray(state, payload, 'categories');
    case PRODUCT_FILTER_ACTION_TYPE.ESRB_FILTER:
      return updateFilterArray(state, payload, 'esrbRatings');
    case PRODUCT_FILTER_ACTION_TYPE.PLATFORM_FILTER:
      return updateFilterArray(state, payload, 'platforms');
    case PRODUCT_FILTER_ACTION_TYPE.FAST_DELIVERY_FILTER:
      return { ...state, fastDelivery: !state.fastDelivery };
    case PRODUCT_FILTER_ACTION_TYPE.OUT_OF_STOCK_FILTER:
      return { ...state, outOfStock: !state.outOfStock };
    case PRODUCT_FILTER_ACTION_TYPE.PRICERANGE_FILTER:
      return { ...state, priceRange: Number(payload) };
    case PRODUCT_FILTER_ACTION_TYPE.RATINGS_FILTER:
      return { ...state, rating: Number(payload) };
    case PRODUCT_FILTER_ACTION_TYPE.SEARCH_FILTER:
      return { ...state, search: payload };
    case PRODUCT_FILTER_ACTION_TYPE.SORT_FILTER:
      return { ...state, sortBy: payload };
    case PRODUCT_FILTER_ACTION_TYPE.CLEAR_PRODUCTS_FILTER:
      return payload;
    default:
      return state;
  }
};

export default productFilterReducer;
