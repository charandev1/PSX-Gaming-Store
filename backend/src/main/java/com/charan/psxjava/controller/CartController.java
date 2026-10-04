package com.charan.psxjava.controller;

import com.charan.psxjava.dto.CartItemResponse;
import com.charan.psxjava.model.Cart;
import com.charan.psxjava.repo.CartRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
        repo.findByUserIdAndProductId(userId, productId)
            .ifPresentOrElse(
                existing -> repo.delete(existing), // ✅ clearer
                () -> {
                   Cart cart = Cart.builder()
        .userId(userId)
        .productId(productId)
        .quantity(1)
        .build();
                    repo.save(cart);
                }
            );
    }
    @PutMapping("/{productId}/quantity")
public Cart updateQuantity(
        @PathVariable Long productId,
        @RequestParam Long userId,
        @RequestParam Integer quantity
) {
    Cart cart = repo.findByUserIdAndProductId(userId, productId)
            .orElseThrow(() ->
                    new RuntimeException("Product not found in cart")
            );

    if (quantity <= 0) {
        repo.delete(cart);
        return null;
    }

    cart.setQuantity(quantity);

    return repo.save(cart);
}

    // GET cart product IDs
   @GetMapping
public List<CartItemResponse> getCart(@RequestParam Long userId) {

    return repo.findByUserId(userId)
            .stream()
            .map(cart -> new CartItemResponse(
                    cart.getProductId(),
                    cart.getQuantity()
            ))
            .toList();
}
}