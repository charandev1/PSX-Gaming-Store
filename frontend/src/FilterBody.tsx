import { useState } from "react";
import styles from "./FilterBody.module.css";
import axios from "axios";

const USER_ID = 1;

type ProductFilterProps = {
  setProducts: (products: any[]) => void;
};

const ProductFilter = ({ setProducts }: ProductFilterProps) => {
  const [price, setPrice] = useState(20000);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);

  // Send all filters together
  const sendAllFilters = (
    newValues: Partial<{
      price: number;
      brands: string[];
      rating: number | null;
      sortBy: string | null;
    }>
  ) => {
    const updated = {
      price,
      brands,
      rating,
      sortBy,
      ...newValues,
    };

    sendFiltersToBackend(updated);
  };

  const sendFiltersToBackend = async (updatedFilters: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/products/filter",
        {
          userId: USER_ID,
          ...updatedFilters,
        }
      );

      setProducts(response.data);
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  // Brand checkbox
  const handleBrandChange = (brand: string) => {
    let updatedBrands;

    if (brands.includes(brand)) {
      updatedBrands = brands.filter((b) => b !== brand);
    } else {
      updatedBrands = [...brands, brand];
    }

    setBrands(updatedBrands);
    sendAllFilters({ brands: updatedBrands });
  };

  // Clear all filters
  const handleClearAll = () => {
    setPrice(20000);
    setSortBy(null);
    setBrands([]);
    setRating(null);

    sendFiltersToBackend({
      price: 20000,
      brands: [],
      rating: null,
      sortBy: null,
    });
  };

  return (
    <div className={styles["product-filters-container"]}>

      {/* FILTER HEADER */}
      <div className={styles["filter-header"]}>
        <h2>FILTERS</h2>

        <button
          type="button"
          className={styles["clear-all"]}
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>

      {/* PRICE */}
      <div className={styles["product-filter"]}>
        <label>
          Price: ₹{price}

          <input
            type="range"
            min="2000"
            max="20000"
            step="500"
            value={price}
            onChange={(e) => {
              const value = Number(e.target.value);

              setPrice(value);
              sendAllFilters({ price: value });
            }}
          />
        </label>
      </div>

      {/* SORT */}
      <div className={styles["product-filter"]}>
        <h3>Sort by</h3>

        <label>
          <input
            type="radio"
            name="sort"
            value="asc"
            checked={sortBy === "asc"}
            onChange={() => {
              setSortBy("asc");
              sendAllFilters({ sortBy: "asc" });
            }}
          />
          Price: Low to High
        </label>

        <label>
          <input
            type="radio"
            name="sort"
            value="desc"
            checked={sortBy === "desc"}
            onChange={() => {
              setSortBy("desc");
              sendAllFilters({ sortBy: "desc" });
            }}
          />
          Price: High to Low
        </label>
      </div>

      {/* BRANDS */}
      <div className={styles["product-filter"]}>
        <h3>Brands</h3>

        {[
          "Sony",
          "EA",
          "Ubisoft",
          "Razer",
          "Ant",
          "Acer",
          "GreenSoul",
          "Eureka",
          "RedClutch",
          "Qbik",
        ].map((brand) => (
          <label key={brand}>
            <input
              type="checkbox"
              checked={brands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
            />
            {brand}
          </label>
        ))}
      </div>

      {/* RATINGS */}
      <div className={styles["product-filter"]}>
        <h3>Ratings</h3>

        {[4, 3, 2, 1].map((star) => (
          <label key={star}>
            <input
              type="radio"
              name="rating"
              checked={rating === star}
              onChange={() => {
                setRating(star);
                sendAllFilters({ rating: star });
              }}
            />
            {star} stars & above
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;