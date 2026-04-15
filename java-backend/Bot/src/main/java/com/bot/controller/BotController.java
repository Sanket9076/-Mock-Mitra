package com.bot.controller;

import com.bot.service.LlmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/bot")
public class BotController {

    @Autowired
    private LlmService llmService;

    @PostMapping("/chat")
    public CompletableFuture<String> chat(@RequestBody Map<String, String> payload) {
        return CompletableFuture.supplyAsync(() -> {
            String prompt = payload.get("prompt");
            String history = payload.get("history");
            
            if (prompt == null) prompt = "";
            
            String systemInstruction = "You are a helpful and expert AI assistant for the CodeGenius platform. You assist users with programming concepts, interview questions, and platform guidance. Be concise and friendly.";
            String userPrompt = (history != null ? "Previous Conversation:\n" + history + "\n\n" : "") + "User: " + prompt + "\nBot:";

            try {
                String aiResponse = llmService.generateText(systemInstruction, userPrompt);
                return aiResponse.replaceAll("(?i)^Bot:\\s*", "").trim();
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Error communicating with Gemini API: " + e.getMessage());
            }
        });
    }
}