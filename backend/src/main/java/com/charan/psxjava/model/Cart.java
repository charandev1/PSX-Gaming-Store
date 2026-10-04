package com.charan.psxjava.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cartlist")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long productId;
    private Integer quantity;
}