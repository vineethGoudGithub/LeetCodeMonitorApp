package com.example.tpo.controller;

import com.example.tpo.dto.StudentRequest;
import com.example.tpo.dto.StudentStatsDto;
import com.example.tpo.entity.Student;
import com.example.tpo.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<Page<Student>> getStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String placementStatus,
            @RequestParam(required = false) Boolean hasLeetcode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Page<Student> students = studentService.getStudents(
                keyword, year, department, section, batch, placementStatus, hasLeetcode,
                page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(students);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Student>> getAllStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String year,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String batch,
            @RequestParam(required = false) String placementStatus,
            @RequestParam(required = false) Boolean hasLeetcode
    ) {
        List<Student> students = studentService.getAllStudents(
                keyword, year, department, section, batch, placementStatus, hasLeetcode
        );
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody StudentRequest request) {
        Student created = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request
    ) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(studentService.searchStudents(keyword));
    }

    @GetMapping("/year/{year}")
    public ResponseEntity<List<Student>> getStudentsByYear(@PathVariable String year) {
        return ResponseEntity.ok(studentService.getStudentsByYear(year));
    }

    @GetMapping("/statistics")
    public ResponseEntity<StudentStatsDto> getStatistics() {
        return ResponseEntity.ok(studentService.getStatistics());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Student>> getRecentStudents() {
        return ResponseEntity.ok(studentService.getRecentStudents());
    }

    @GetMapping("/filters")
    public ResponseEntity<Map<String, List<String>>> getFilterOptions() {
        return ResponseEntity.ok(studentService.getFilterOptions());
    }
}
