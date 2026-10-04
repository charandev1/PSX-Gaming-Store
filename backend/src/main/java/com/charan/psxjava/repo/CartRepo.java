package com.charan.psxjava.repo;

import com.charan.psxjava.model.Cart;
import com.charan.psxjava.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, Long> {

    List<Cart> findByUserId(Long userId);

    Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    void deleteByUserIdAndProductId(Long userId, Long productId);
}
