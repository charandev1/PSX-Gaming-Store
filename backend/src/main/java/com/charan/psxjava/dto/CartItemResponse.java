package com.charan.psxjava.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CartItemResponse {

    private Long productId;
    private Integer quantity;
}