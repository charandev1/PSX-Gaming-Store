package com.charan.psxjava.controller;

import com.charan.psxjava.model.Product;
import com.charan.psxjava.repo.ProductRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.charan.psxjava.dto.FilterRequest;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://psx-gaming-store.netlify.app"
})
public class ProductController {

    private final ProductRepo repo;

    public ProductController(ProductRepo repo) {
        this.repo = repo;
    }
@GetMapping
public List<Product> getProducts(@RequestParam(required = false) String category) {

    List<Product> products = repo.findAll();

    if (category != null) {
        products = products.stream()
                .filter(p -> p.getCategory() != null &&
                        p.getCategory().equalsIgnoreCase(category))
                .toList();
    }

    return products;
}
@GetMapping("/search")
public List<Product> searchProducts(@RequestParam String query) {
    return repo.findByNameContainingIgnoreCase(query);
}

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return repo.save(product);
    }

    // ✅ CORRECT FILTER ENDPOINT
   @PostMapping("/filter")
public List<Product> filterProducts(@RequestBody FilterRequest request) {

    List<Product> products = repo.findAll();

    if (request.getPrice() != null) {
        products = products.stream()
                .filter(p -> p.getPrice() != null &&
                             p.getPrice() <= request.getPrice())
                .toList();
    }

    if (request.getBrands() != null && !request.getBrands().isEmpty()) {
        products = products.stream()
                .filter(p -> p.getBrand() != null &&
                        request.getBrands().stream()
                                .anyMatch(b -> b.equalsIgnoreCase(p.getBrand())))
                .toList();
    }

    if (request.getRating() != null) {
        products = products.stream()
                .filter(p -> p.getRatings() != null &&
                             p.getRatings() >= request.getRating())
                .toList();
    }

    if ("asc".equals(request.getSortBy())) {
        products = products.stream()
                .sorted((a, b) -> Integer.compare(a.getPrice(), b.getPrice()))
                .toList();
    }

    if ("desc".equals(request.getSortBy())) {
        products = products.stream()
                .sorted((a, b) -> Integer.compare(b.getPrice(), a.getPrice()))
                .toList();
    }

    return products;
}
}
