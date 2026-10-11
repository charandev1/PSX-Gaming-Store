
package com.charan.psxjava.controller;

import com.charan.psxjava.dto.CartItemResponse;
import com.charan.psxjava.model.Cart;
import com.charan.psxjava.repo.CartRepo;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cartlist")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartRepo repo;

    public CartController(CartRepo repo) {
        this.repo = repo;
    }

    // ADD / REMOVE (toggle)
    @PostMapping("/{productId}")
    public void toggleCart(
            @PathVariable Long productId,
            @RequestParam Long userId
    ) {
        List<Cart> existing =
                repo.findAllByUserIdAndProductId(userId, productId);

        if (!existing.isEmpty()) {
            repo.deleteAll(existing);
        } else {
            Cart cart = Cart.builder()
                    .userId(userId)
                    .productId(productId)
                    .quantity(1)
                    .build();

            repo.save(cart);
        }
    }

    // UPDATE QUANTITY
    @PutMapping("/{productId}/quantity")
    public Cart updateQuantity(
            @PathVariable Long productId,
            @RequestParam Long userId,
            @RequestParam Integer quantity
    ) {
        List<Cart> matching =
                repo.findAllByUserIdAndProductId(userId, productId);

        if (matching.isEmpty()) {
            throw new RuntimeException("Product not found in cart");
        }

        if (quantity <= 0) {
            repo.deleteAll(matching);
            return null;
        }

        Cart cart = matching.get(0);
        cart.setQuantity(quantity);

        Cart saved = repo.save(cart);

        // Remove any duplicate rows for the same product and user.
        List<Cart> duplicates = matching.subList(
                1, matching.size()
        );

        if (!duplicates.isEmpty()) {
            repo.deleteAll(duplicates);
        }

        return saved;
    }

    // GET CART
    @GetMapping
    public List<CartItemResponse> getCart(
            @RequestParam Long userId
    ) {
        Map<Long, Integer> quantities =
                repo.findByUserId(userId)
                        .stream()
                        .collect(Collectors.groupingBy(
                                Cart::getProductId,
                                Collectors.summingInt(
                                        Cart::getQuantity
                                )
                        ));

        return quantities.entrySet()
                .stream()
                .map(entry -> new CartItemResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
    }
}
