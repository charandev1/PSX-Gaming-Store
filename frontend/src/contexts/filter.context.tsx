import { createContext, useContext, useReducer } from "react";

import type ProviderPropsType from "../types/ProviderPropsType";
import type {FiltersStateType} from "../types/FiltersStateType";

import productFilterReducer from "../reducers/product-filter/productFilter.reducer";

const INITIAL_FILTERS_STATE = {
  priceRange: 20000,
  outOfStock: false,
  fastDelivery: false,
  brands: [],
  categories: [],
  platforms: [],
  esrbRatings: [],
  rating: null,
  sortBy: null,
  search: null,
};

type FilterContextValueType = {
      filtersState: FiltersStateType;
      dispatch: React.Dispatch<any>;
      INITIAL_FILTERS_STATE: any;
    }
  | undefined;

const FilterContext = createContext<FilterContextValueType>(undefined);

export const FilterProvider = ({ children }: ProviderPropsType) => {
  const [filtersState, dispatch] = useReducer(productFilterReducer, INITIAL_FILTERS_STATE);

  const value = {
    filtersState,
    dispatch,
    INITIAL_FILTERS_STATE,
  };
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};
