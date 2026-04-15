package com.bot.controller;

import com.bot.model.User;
import com.bot.repository.UserRepository;
import com.bot.util.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User requestUser) {
        Map<String, String> response = new HashMap<>();
        try {
            if (userRepository.existsByEmail(requestUser.getEmail())) {
                response.put("error", "User already exists with this email");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            // Hash password
            String hashed = BCrypt.hashpw(requestUser.getPassword(), BCrypt.gensalt(5));
            User newUser = new User(requestUser.getUsername(), requestUser.getEmail(), hashed);
            userRepository.save(newUser);
            
            response.put("msg", "User registered successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
            
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                response.put("error", "Invalid Credentials");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
            
            User user = optionalUser.get();
            if (BCrypt.checkpw(password, user.getPassword())) {
                String token = jwtUtil.generateToken(user.getId(), user.getUsername());
                response.put("msg", "Login successful");
                response.put("token", token);
                response.put("username", user.getUsername());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("error", "Invalid Credentials");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
            
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
