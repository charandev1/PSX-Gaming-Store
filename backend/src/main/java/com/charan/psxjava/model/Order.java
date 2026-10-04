package com.charan.psxjava.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long addressId;

    private Integer totalAmount;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String status;

    private LocalDateTime createdAt;
}