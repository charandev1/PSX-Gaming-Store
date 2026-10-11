
package com.charan.psxjava.repo;

import com.charan.psxjava.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepo extends JpaRepository<Cart, Long> {

    List<Cart> findByUserId(Long userId);

    List<Cart> findAllByUserIdAndProductId(
        Long userId,
        Long productId
    );

    boolean existsByUserIdAndProductId(
        Long userId,
        Long productId
    );

    void deleteByUserIdAndProductId(
        Long userId,
        Long productId
    );
}
