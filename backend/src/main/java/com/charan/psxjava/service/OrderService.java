package com.charan.psxjava.service;

import com.charan.psxjava.model.Order;
import com.charan.psxjava.model.OrderItem;
import com.charan.psxjava.model.Product;
import com.charan.psxjava.repo.OrderItemRepo;
import com.charan.psxjava.repo.OrderRepo;
import com.charan.psxjava.repo.ProductRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepository;

    @Autowired
    private OrderItemRepo orderItemRepository;

    @Autowired
    private ProductRepo productRepo;


    public Order createOrder(
            Long userId,
            Long addressId,
            List<Long> productIds,
             List<Integer> quantities,
            Integer totalAmount,
            String razorpayOrderId,
            String razorpayPaymentId
    ) {

        // 1. Create the Order
        Order order = new Order();

        order.setUserId(userId);
        order.setAddressId(addressId);
        order.setTotalAmount(totalAmount);
        order.setRazorpayOrderId(razorpayOrderId);
        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());

        // 2. Save Order first
        Order savedOrder = orderRepository.save(order);


        // 3. Create OrderItems
        for (int i = 0; i < productIds.size(); i++) {

    Long productId = productIds.get(i);
    Integer quantity = quantities.get(i);

    Product product = productRepo.findById(productId)
            .orElseThrow(() ->
                    new RuntimeException("Product not found: " + productId)
            );

    int actualPrice =
            product.getDiscountPrice() != null
                    ? product.getDiscountPrice()
                    : product.getPrice();

    OrderItem orderItem = new OrderItem();

    orderItem.setOrderId(savedOrder.getId());
    orderItem.setProductId(productId);
    orderItem.setPrice(actualPrice);
    orderItem.setQuantity(quantity);

    orderItemRepository.save(orderItem);
}

        return savedOrder;
    }
}