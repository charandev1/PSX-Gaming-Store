package com.charan.psxjava.controller;

import com.charan.psxjava.model.Address;
import com.charan.psxjava.repo.AddressRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/address")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://psx-gaming-store.netlify.app"
})
public class AddressController {

    @Autowired
    private AddressRepo addressRepo;

    @GetMapping
    public List<Address> getAddresses(@RequestParam Long userId) {
        return addressRepo.findByUserId(userId);
    }

    @PostMapping
    public Address addAddress(
            @RequestParam Long userId,
            @RequestBody Address address) {

        address.setId(null);
        address.setUserId(userId);

        return addressRepo.save(address);
    }

    @PutMapping("/{id}")
    public Address updateAddress(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody Address updatedAddress) {

        Address address = addressRepo
                .findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setName(updatedAddress.getName());
        address.setLine1(updatedAddress.getLine1());
        address.setCity(updatedAddress.getCity());
        address.setState(updatedAddress.getState());
        address.setPostalCode(updatedAddress.getPostalCode());
        address.setAddressType(updatedAddress.getAddressType());

        return addressRepo.save(address);
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(
            @PathVariable Long id,
            @RequestParam Long userId) {

        Address address = addressRepo
                .findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        addressRepo.delete(address);
    }
}