package com.charan.psxjava.controller;

import com.charan.psxjava.model.Order;
import com.charan.psxjava.repo.OrderRepo;
import com.charan.psxjava.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://psx-gaming-store.netlify.app"
})
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
private OrderRepo orderRepo;
     @GetMapping
public List<Order> getUserOrders(@RequestParam Long userId) {
    return orderRepo.findByUserId(userId);
}
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestParam Long userId,
            @RequestParam Long addressId,
            @RequestParam List<Long> productIds,
            @RequestParam List<Integer> quantities,
            @RequestParam Integer totalAmount,
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId
    ) {

        try {

            Order order = orderService.createOrder(
                    userId,
                    addressId,
                    productIds,
                    quantities,
                    totalAmount,
                    razorpayOrderId,
                    razorpayPaymentId
            );

            return ResponseEntity.ok(order);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}