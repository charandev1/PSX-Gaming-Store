import { useEffect, useState } from "react";
import api from "./api";

export const useWishlist = (userId: number | undefined) => {
  const [wishlistedIds, setWishlistedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setWishlistedIds([]);
      setLoading(false);
      return;
    }

    api
      .get("/wishlist", { params: { userId } })
      .then(res => setWishlistedIds(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  const toggleWishlist = async (productId: number) => {
    if (!userId) {
      return;
    }

    // optimistic update
    setWishlistedIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    try {
      await api.post(`/wishlist/${productId}`, null, {
        params: { userId },
      });
    } catch (e) {
      console.error("Wishlist toggle failed", e);
    }
  };

  return { wishlistedIds, toggleWishlist, loading };
};