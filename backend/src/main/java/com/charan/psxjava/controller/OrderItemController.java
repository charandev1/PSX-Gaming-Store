package com.charan.psxjava.controller;

import com.charan.psxjava.model.OrderItem;
import com.charan.psxjava.repo.OrderItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-items")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderItemController {

    @Autowired
    private OrderItemRepo orderItemRepo;

    @GetMapping
    public List<OrderItem> getOrderItems(
            @RequestParam Long orderId) {

        return orderItemRepo.findByOrderId(orderId);
    }
}