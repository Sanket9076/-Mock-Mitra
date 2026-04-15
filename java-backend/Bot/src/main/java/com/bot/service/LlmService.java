package com.bot.service;

import com.bot.model.LlmTask;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.*;

@Service
public class LlmService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Internal Queue for AI Tasks (Replaces Kafka for immediate stability)
    private final BlockingQueue<LlmTask> taskQueue = new LinkedBlockingQueue<>();
    
    // Registry to track pending requests and their results
    private final Map<String, CompletableFuture<Object>> resultsMap = new ConcurrentHashMap<>();

    // Mandatory 5-second gap between Gemini calls
    private static final long RATE_LIMIT_DELAY_MS = 5000;

    @PostConstruct
    public void initWorker() {
        // Start background AI Worker Thread
        new Thread(this::processQueue, "AI-Worker-Thread").start();
    }

    private void processQueue() {
        while (true) {
            try {
                LlmTask task = taskQueue.take(); // Wait for next task
                System.out.println("Processing AI task from Internal Queue: " + task.getId());

                // 1. Mandatory Throttle Delay
                Thread.sleep(RATE_LIMIT_DELAY_MS);

                // 2. Perform AI Call
                Object result = callGeminiWithRetry(task);

                // 3. Complete Result
                completeRequest(task.getId(), result);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                System.err.println("Worker thread error: " + e.getMessage());
            }
        }
    }

    public String generateText(String systemInstruction, String userPrompt) {
        Object result = generateJSONInternal(systemInstruction, userPrompt, "text/plain");
        return result instanceof String ? (String) result : String.valueOf(result);
    }

    public Object generateJSON(String systemInstruction, String userPrompt) {
        return generateJSONInternal(systemInstruction, userPrompt, "application/json");
    }

    private Object generateJSONInternal(String systemInstruction, String userPrompt, String responseMimeType) {
        String requestId = UUID.randomUUID().toString();
        CompletableFuture<Object> future = new CompletableFuture<>();
        resultsMap.put(requestId, future);

        // Put task into our internal sequential queue
        LlmTask task = new LlmTask(requestId, systemInstruction, userPrompt, responseMimeType);
        taskQueue.add(task);
        System.out.println("Queued AI task (Internal): " + requestId);

        try {
            // Wait for worker to complete (Timeout 60s)
            return future.get(60, TimeUnit.SECONDS);
        } catch (Exception e) {
            System.err.println("Task timed out: " + requestId + " - " + e.getMessage());
            return getMockResponse("Request timed out. The queue might be congested or the API is slow.");
        } finally {
            resultsMap.remove(requestId);
        }
    }

    private void completeRequest(String requestId, Object result) {
        CompletableFuture<Object> future = resultsMap.remove(requestId);
        if (future != null) {
            future.complete(result);
        }
    }

    private Object callGeminiWithRetry(LlmTask task) {
        int maxRetries = 2;
        int retryCount = 0;
        long retryDelay = 10000;

        while (true) {
            try {
                return executeApiCall(task);
            } catch (HttpClientErrorException.TooManyRequests e) {
                System.err.println("Worker: Rate Limit (429). Retry " + (retryCount + 1) + " in 10s");
                if (retryCount >= maxRetries) return "Error: Gemini Rate Limit exceeded after retries.";
                try { Thread.sleep(retryDelay); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                retryCount++;
            } catch (Exception e) {
                System.err.println("Worker: Gemini call failed: " + e.getMessage());
                return getMockResponse("Gemini API Error: " + e.getMessage());
            }
        }
    }

    private Object executeApiCall(LlmTask task) throws Exception {
        Map<String, Object> systemPart = new HashMap<>();
        systemPart.put("text", task.getSystemInstruction());
        Map<String, Object> systemInstructionNode = new HashMap<>();
        systemInstructionNode.put("parts", Collections.singletonList(systemPart));

        Map<String, Object> userPart = new HashMap<>();
        userPart.put("text", task.getUserPrompt());
        Map<String, Object> userContent = new HashMap<>();
        userContent.put("role", "user");
        userContent.put("parts", Collections.singletonList(userPart));

        Map<String, Object> reqBody = new HashMap<>();
        reqBody.put("system_instruction", systemInstructionNode);
        reqBody.put("contents", Collections.singletonList(userContent));
        
        Map<String, Object> genConfig = new HashMap<>();
        genConfig.put("temperature", 0.7);
        if ("application/json".equals(task.getResponseMimeType())) {
            genConfig.put("response_mime_type", "application/json");
        }
        reqBody.put("generationConfig", genConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(reqBody, headers);

        String url = apiUrl + "?key=" + apiKey;
        @SuppressWarnings("unchecked")
        Map<String, Object> resp = restTemplate.postForObject(url, entity, Map.class);
        
        if (resp != null && resp.containsKey("candidates")) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) resp.get("candidates");
            if (!candidates.isEmpty()) {
                @SuppressWarnings("unchecked")
                Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                String text = (String) parts.get(0).get("text");
                
                if ("application/json".equals(task.getResponseMimeType())) {
                    return objectMapper.readValue(text, new TypeReference<Map<String, Object>>() {});
                }
                return text;
            }
        }
        throw new RuntimeException("Empty response from AI");
    }

    private Object getMockResponse(String msg) {
        Map<String, Object> mock = new HashMap<>();
        mock.put("section", "Technical");
        mock.put("question", "[SYSTEM] " + msg);
        mock.put("score", 0);
        mock.put("strengths", Collections.singletonList("Internal Queue active"));
        mock.put("weaknesses", Collections.singletonList("Check API Connectivity"));
        mock.put("improvements", Collections.singletonList("Ensure gemini.api.key is valid."));
        mock.put("overall_score", 0);
        return mock;
    }
}


