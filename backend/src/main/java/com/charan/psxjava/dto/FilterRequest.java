package com.charan.psxjava.dto;

import java.util.List;

public class FilterRequest {

    private Long userId;
    private Integer price;
    private String sortBy;
    private List<String> brands;
  private Double rating;

    public FilterRequest() {}

    public Long getUserId() {
        return userId;
    }

    public Integer getPrice() {
        return price;
    }

    public String getSortBy() {
        return sortBy;
    }

    public List<String> getBrands() {
        return brands;
    }

    public Double getRating() {
        return rating;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public void setBrands(List<String> brands) {
        this.brands = brands;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}