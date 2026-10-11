package com.charan.psxjava.controller;

import com.charan.psxjava.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://psx-gaming-store.netlify.app"
})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam double amount) {

        try {

            String order = paymentService.createOrder(amount);

            return ResponseEntity.ok(order);

        } catch (RazorpayException e) {
    e.printStackTrace();

    return ResponseEntity
            .badRequest()
            .body(e.getMessage());
}
    }
    @PostMapping("/verify")
public ResponseEntity<?> verifyPayment(
        @RequestParam String razorpayOrderId,
        @RequestParam String razorpayPaymentId,
        @RequestParam String razorpaySignature
) {

    boolean verified = paymentService.verifyPayment(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
    );

    if (verified) {
        return ResponseEntity.ok("Payment verified successfully");
    }

    return ResponseEntity.badRequest()
            .body("Payment verification failed");
}
}