package com.futmanager.controller;

import com.futmanager.service.TestResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/test-results")
@CrossOrigin(origins = "*")
public class TestResultsController {

    private final TestResultsService testResultsService;

    @Autowired
    public TestResultsController(TestResultsService testResultsService) {
        this.testResultsService = testResultsService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTestResults() {
        return ResponseEntity.ok(testResultsService.getTestResults());
    }
}
