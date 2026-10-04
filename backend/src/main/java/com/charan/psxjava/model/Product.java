package com.charan.psxjava.model;

import java.util.List;
import org.hibernate.annotations.Type;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "products")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    @ElementCollection
    private List<String> imageSrc;

    @ElementCollection
    private List<String> platform;

    @ElementCollection
    private List<String> genre;

    @ElementCollection
    private List<String> videoSrc;

    private Integer price;

    private Integer discountPrice;

    private Integer discount;

    private String esrbRating;

    private String brand;

    private Double ratings;

    private Boolean inStock;

    private Boolean fastDelivery;
}

