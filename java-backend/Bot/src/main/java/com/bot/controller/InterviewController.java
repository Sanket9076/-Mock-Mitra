package com.bot.controller;

import com.bot.service.LlmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/interview")
public class InterviewController {

    @Autowired
    private LlmService llmService;

    @PostMapping("/generate-question")
    public ResponseEntity<?> generateQuestion(@RequestBody Map<String, Object> payload) {
        try {
            String techStack = (String) payload.getOrDefault("techStack", "Software Engineer");
            String section = (String) payload.getOrDefault("section", "Technical");
            String difficulty = (String) payload.getOrDefault("difficulty", "medium");
            List<?> historyList = (List<?>) payload.get("history");
            String lastAnswer = (String) payload.get("lastAnswer");

            String crossQuestionPrompt = "";
            if (lastAnswer != null && !lastAnswer.isEmpty()) {
                crossQuestionPrompt = "\nThe candidate's previous answer was: \"" + lastAnswer + "\". Generate a STRICT cross-question that probes deeper into this specific answer, tests their actual understanding of what they just said, or asks for a specific real-world example related to it.";
            }

            String historyStr = historyList != null ? historyList.toString() : "None";

            String systemInstruction = "You are an expert technical interviewer. Your task is to generate ONE interview question.\n" +
                    "Target Role/Tech Stack: " + techStack + "\n" +
                    "Section: " + section + "\n" +
                    "Target Difficulty: " + difficulty + "\n" +
                    "Do not repeat any previous questions. History of asked questions: " + historyStr + "\n" +
                    crossQuestionPrompt + "\n\n" +
                    "Return ONLY a JSON object exactly matching this schema:\n" +
                    "{\n" +
                    "  \"section\": \"The section name (e.g. Technical, Behavioral, Situational)\",\n" +
                    "  \"question\": \"The question text\",\n" +
                    "  \"difficulty\": \"Easy, Medium, Hard, or Deep Dive\"\n" +
                    "}";

            Object questionJSON = llmService.generateJSON(systemInstruction, "Generate the next question now.");
            return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_JSON).body(questionJSON);

        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Failed to generate question: " + e.getMessage());
            return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/evaluate-answer")
    public ResponseEntity<?> evaluateAnswer(@RequestBody Map<String, String> payload) {
        try {
            String question = payload.get("question");
            String answer = payload.get("answer");

            String systemInstruction = "You are an expert technical interviewer evaluating a candidate's verbal response (converted from speech to text, so there may be minor typos).\n" +
                    "Question asked: \"" + question + "\"\n" +
                    "Candidate's response: \"" + answer + "\"\n\n" +
                    "Provide a detailed evaluation in STRICT JSON format matching the following schema:\n" +
                    "{\n" +
                    "  \"score\": <number 0-10>,\n" +
                    "  \"strengths\": [\"list of what they did well\"],\n" +
                    "  \"weaknesses\": [\"specific areas where the answer lacked depth, clarity, or correctness\"],\n" +
                    "  \"improvements\": [\"actionable advice on how to improve this answer\"],\n" +
                    "  \"ideal_answer\": \"An example of a 10/10 level strong response\"\n" +
                    "}";

            Object evalJSON = llmService.generateJSON(systemInstruction, "Evaluate the candidate's response realistically.");
            return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_JSON).body(evalJSON);

        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Failed to evaluate answer");
            return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/generate-report")
    public ResponseEntity<?> generateReport(@RequestBody Map<String, Object> payload) {
        try {
            Object qnaHistory = payload.get("qnaHistory");

            String systemInstruction = "You are a career coach analyzing a full mock interview session.\n" +
                    "Review the following Q&A history and evaluations:\n" +
                    qnaHistory.toString() + "\n\n" +
                    "Provide a final, comprehensive performance report in STRICT JSON format matching this schema:\n" +
                    "{\n" +
                    "  \"overall_score\": <number 0-10, holistically calculated>,\n" +
                    "  \"section_analysis\": [ { \"section_name\": \"...\", \"score\": <number>, \"comments\": \"...\" } ],\n" +
                    "  \"weak_areas\": [\"Top 1-3 specific recurring weaknesses across the interview\"],\n" +
                    "  \"improvement_plan\": [\"Step-by-step actionable plan specifically targeting their weak areas\"],\n" +
                    "  \"personalized_tips\": [\"Highly specific tips based on their actual performance, NOT generic advice\"]\n" +
                    "}";

            Object reportJSON = llmService.generateJSON(systemInstruction, "Generate the final personalized report.");
            return ResponseEntity.ok().contentType(org.springframework.http.MediaType.APPLICATION_JSON).body(reportJSON);

        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Failed to generate report");
            return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
