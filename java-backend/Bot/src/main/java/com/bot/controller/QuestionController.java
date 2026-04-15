package com.bot.controller;

import com.bot.model.Question;
import com.bot.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addQuestion(@RequestBody Question question) {
        Map<String, String> response = new HashMap<>();
        if (question == null) {
            response.put("error", "Question cannot be null");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        try {
            questionRepository.save(question);
            response.put("msg", "New Question has been Added");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getQuestions(@RequestParam(required = false) String techStack) {
        try {
            List<Question> questions;
            if (techStack != null && !techStack.isEmpty()) {
                questions = questionRepository.findByTechStack(techStack);
            } else {
                questions = questionRepository.findAll();
            }
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
