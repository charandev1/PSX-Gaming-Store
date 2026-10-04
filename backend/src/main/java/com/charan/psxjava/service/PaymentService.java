package com.charan.psxjava.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.razorpay.Utils;
import com.razorpay.RazorpayException;
@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public String createOrder(double amount) throws RazorpayException {

        RazorpayClient razorpayClient =
                new RazorpayClient(keyId, keySecret);

        int amountInPaise = (int) Math.round(amount * 100);

        JSONObject orderRequest = new JSONObject();

        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put(
                "receipt",
                "PSX_" + System.currentTimeMillis()
        );

        Order order = razorpayClient.orders.create(orderRequest);

        return order.toString();
    }
    public boolean verifyPayment(
        String razorpayOrderId,
        String razorpayPaymentId,
        String razorpaySignature
) {

    try {

        String payload =
                razorpayOrderId + "|" + razorpayPaymentId;

        boolean isValid = Utils.verifySignature(
                payload,
                razorpaySignature,
                keySecret
        );

        return isValid;

    } catch (RazorpayException e) {
        e.printStackTrace();
        return false;
    }
}
}