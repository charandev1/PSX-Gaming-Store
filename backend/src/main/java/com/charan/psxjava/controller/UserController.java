package com.charan.psxjava.controller;

import com.charan.psxjava.dto.LoginRequest;
import com.charan.psxjava.dto.Register;
import com.charan.psxjava.model.User;
import com.charan.psxjava.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://psx-gaming-store.netlify.app"
})
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/auth")
    public User login(@RequestBody LoginRequest request) {
        return userService.authenticate(request);
    }
    @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody Register request) {
    User user = userService.register(request);
    return ResponseEntity.status(201).body(user);
}
}