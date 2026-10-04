package com.charan.psxjava.service;

import com.charan.psxjava.dto.LoginRequest;
import com.charan.psxjava.dto.Register;
import com.charan.psxjava.model.User;
import com.charan.psxjava.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User authenticate(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
    public User register(Register request) {

    // check if user exists
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
        throw new RuntimeException("User already exists");
    }

    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(request.getPassword());

    // 🔥 combine names
    user.setName(request.getFirstName() + " " + request.getLastName());

    return userRepository.save(user);
}
} 
