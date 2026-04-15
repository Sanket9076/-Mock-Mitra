package com.bot.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    // Keep a simple secret exactly like the express version "codegenius_secret", 
    // but jjwt requires 256-bit key for HS256, so we convert it to a suitable key.
    // For simplicity and parity we use a dynamic secret key here, or a securely hashed string.
    private final SecretKey key = Keys.hmacShaKeyFor("codegenius_secret_secure_and_long_enough!".getBytes());

    public String generateToken(String userId, String username) {
        long expirationTime = 1000L * 60 * 60 * 24 * 7; // 7 days like in Node
        
        return Jwts.builder()
                .claim("userId", userId)
                .claim("username", username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
