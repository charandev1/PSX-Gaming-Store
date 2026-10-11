package com.charan.psxjava.controller;

import com.charan.psxjava.model.Wishlist;
import com.charan.psxjava.repo.WishlistRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://psx-gaming-store.netlify.app"
})
public class WishlistController {

    private final WishlistRepo repo;

    public WishlistController(WishlistRepo repo) {
        this.repo = repo;
    }

    // ADD / REMOVE (toggle)
    @PostMapping("/{productId}")
    public void toggleWishlist(
        @PathVariable Long productId,
        @RequestParam Long userId
    ) {
        repo.findByUserIdAndProductId(userId, productId)
            .ifPresentOrElse(
                existing -> repo.delete(existing), // ✅ clearer
                () -> {
                    Wishlist w = Wishlist.builder()   // ✅ use Lombok builder
                            .userId(userId)
                            .productId(productId)
                            .build();

                    repo.save(w);
                }
            );
    }

    // GET wishlist product IDs
    @GetMapping
    public List<Long> getWishlist(@RequestParam Long userId) {
        return repo.findByUserId(userId)
                   .stream()
                   .map(Wishlist::getProductId)
                   .toList();
    }
}