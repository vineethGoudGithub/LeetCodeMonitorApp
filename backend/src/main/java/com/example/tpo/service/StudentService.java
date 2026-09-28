package com.example.tpo.service;

import com.example.tpo.dto.StudentRequest;
import com.example.tpo.dto.StudentStatsDto;
import com.example.tpo.entity.Student;
import com.example.tpo.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final JdbcTemplate jdbcTemplate;

    private static final long OFFSET_AIML_AB = 100000L;
    private static final long OFFSET_AIML_JK = 200000L;
    private static final long OFFSET_ECE_EF  = 300000L;
    private static final long OFFSET_DS_AB   = 400000L;

    // Pattern to extract roll numbers like 25EG107B35 or 25eg110b40
    private static final Pattern ROLL_PATTERN = Pattern.compile("([0-9]{2}[a-zA-Z]{2}[0-9][a-zA-Z0-9]{2}[a-zA-Z0-9]{2,3})");

    /**
     * Fetch all students directly from the 4 MySQL cloud tables:
     * aiml_ab, aiml_jk, ece_ef, ds_ab
     */
    public List<Student> fetchAllFromDatabase() {
        List<Student> students = new ArrayList<>();

        // 1. Query aiml_ab
        fetchFromTable(students, "aiml_ab", OFFSET_AIML_AB, "AI & ML", "AB");

        // 2. Query aiml_jk
        fetchFromTable(students, "aiml_jk", OFFSET_AIML_JK, "AI & ML", "JK");

        // 3. Query ece_ef
        fetchFromTable(students, "ece_ef", OFFSET_ECE_EF, "ECE", "EF");

        // 4. Query ds_ab
        fetchFromTable(students, "ds_ab", OFFSET_DS_AB, "Data Science", "AB");

        return students;
    }

    private void fetchFromTable(List<Student> list, String tableName, long offset, String defaultDept, String defaultSec) {
        try {
            String sql = "SELECT id, name, email, year, department, section, leetcode_url FROM " + tableName;
            jdbcTemplate.query(sql, (rs) -> {
                long sourceId = rs.getLong("id");
                String name = rs.getString("name");
                String email = rs.getString("email");
                String yr = rs.getString("year");
                String dept = rs.getString("department");
                String sec = rs.getString("section");
                String leet = rs.getString("leetcode_url");

                String yearFormatted = "2nd Year";
                if (yr != null && !yr.isBlank()) {
                    yearFormatted = yr.contains("Year") ? yr : yr + " Batch";
                }

                list.add(buildStudent(
                        offset + sourceId,
                        name,
                        email,
                        leet,
                        yearFormatted,
                        dept != null && !dept.isBlank() ? dept : defaultDept,
                        sec != null && !sec.isBlank() ? sec : defaultSec,
                        tableName
                ));
            });
        } catch (Exception e) {
            log.error("Error reading {}: {}", tableName, e.getMessage());
        }
    }

    private Student buildStudent(
            Long id,
            String name,
            String email,
            String leet,
            String year,
            String department,
            String section,
            String batch
    ) {
        String roll = extractRollNumber(email);
        String normLeet = normalizeUrl(leet);

        return Student.builder()
                .id(id)
                .name(name != null && !name.isBlank() ? name.trim() : "Student " + (roll != null ? roll : id))
                .email(email != null && !email.isBlank() ? email.trim() : null)
                .rollNumber(roll)
                .year(year != null && !year.isBlank() ? year.trim() : "2nd Year")
                .department(department)
                .section(section)
                .batch(batch)
                .leetcodeUrl(normLeet)
                .githubUrl(null)
                .linkedinUrl(null)
                .codingScore(0)
                .problemsSolved(0)
                .placementStatus("Active")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private String extractRollNumber(String email) {
        if (email == null) return null;
        Matcher m = ROLL_PATTERN.matcher(email);
        if (m.find()) {
            return m.group(1).toUpperCase();
        }
        return null;
    }

    private String normalizeUrl(String url) {
        if (url == null || url.trim().isEmpty() || url.trim().equalsIgnoreCase("null")) {
            return null;
        }
        String clean = url.trim().replace("\\", "/");
        if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
            clean = "https://" + clean;
        }
        return clean;
    }

    public Page<Student> getStudents(
            String keyword,
            String year,
            String department,
            String section,
            String batch,
            String placementStatus,
            Boolean hasLeetcode,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        List<Student> filtered = getAllStudents(keyword, year, department, section, batch, placementStatus, hasLeetcode);

        Comparator<Student> comparator = getComparator(sortBy, sortDir);
        filtered.sort(comparator);

        int total = filtered.size();
        int fromIndex = Math.min(page * size, total);
        int toIndex = Math.min(fromIndex + size, total);

        List<Student> paged = filtered.subList(fromIndex, toIndex);
        return new PageImpl<>(paged, PageRequest.of(page, size), total);
    }

    public List<Student> getAllStudents(
            String keyword,
            String year,
            String department,
            String section,
            String batch,
            String placementStatus,
            Boolean hasLeetcode
    ) {
        List<Student> all = fetchAllFromDatabase();

        return all.stream()
                .filter(s -> {
                    if (keyword != null && !keyword.isBlank()) {
                        String kw = keyword.toLowerCase().trim();
                        boolean matchName = s.getName() != null && s.getName().toLowerCase().contains(kw);
                        boolean matchEmail = s.getEmail() != null && s.getEmail().toLowerCase().contains(kw);
                        boolean matchRoll = s.getRollNumber() != null && s.getRollNumber().toLowerCase().contains(kw);
                        if (!matchName && !matchEmail && !matchRoll) return false;
                    }
                    if (year != null && !year.isBlank() && !year.equalsIgnoreCase(s.getYear())) {
                        return false;
                    }
                    if (department != null && !department.isBlank() && !department.equalsIgnoreCase(s.getDepartment())) {
                        return false;
                    }
                    if (section != null && !section.isBlank() && !section.equalsIgnoreCase(s.getSection())) {
                        return false;
                    }
                    if (batch != null && !batch.isBlank() && !batch.equalsIgnoreCase(s.getBatch())) {
                        return false;
                    }
                    if (placementStatus != null && !placementStatus.isBlank() && !placementStatus.equalsIgnoreCase(s.getPlacementStatus())) {
                        return false;
                    }
                    if (hasLeetcode != null) {
                        boolean hasLeet = s.getLeetcodeUrl() != null && !s.getLeetcodeUrl().isBlank();
                        if (hasLeet != hasLeetcode) return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    private Comparator<Student> getComparator(String sortBy, String sortDir) {
        Comparator<Student> comp;
        switch (sortBy != null ? sortBy : "id") {
            case "name":
                comp = Comparator.comparing(s -> s.getName() != null ? s.getName().toLowerCase() : "");
                break;
            case "email":
                comp = Comparator.comparing(s -> s.getEmail() != null ? s.getEmail().toLowerCase() : "");
                break;
            case "rollNumber":
                comp = Comparator.comparing(s -> s.getRollNumber() != null ? s.getRollNumber().toLowerCase() : "");
                break;
            case "year":
                comp = Comparator.comparing(s -> s.getYear() != null ? s.getYear().toLowerCase() : "");
                break;
            case "department":
                comp = Comparator.comparing(s -> s.getDepartment() != null ? s.getDepartment().toLowerCase() : "");
                break;
            case "placementStatus":
                comp = Comparator.comparing(s -> s.getPlacementStatus() != null ? s.getPlacementStatus().toLowerCase() : "");
                break;
            default:
                comp = Comparator.comparing(Student::getId);
        }

        if ("desc".equalsIgnoreCase(sortDir)) {
            comp = comp.reversed();
        }
        return comp;
    }

    public Student getStudentById(Long id) {
        return fetchAllFromDatabase().stream()
                .filter(s -> Objects.equals(s.getId(), id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
    }

    public Student createStudent(StudentRequest request) {
        String batch = request.getBatch() != null ? request.getBatch().toLowerCase() : "aiml_ab";
        String normLeet = normalizeUrl(request.getLeetcodeUrl());

        long offset;
        String targetTable;
        if ("aiml_jk".equals(batch)) {
            offset = OFFSET_AIML_JK;
            targetTable = "aiml_jk";
        } else if ("ece_ef".equals(batch)) {
            offset = OFFSET_ECE_EF;
            targetTable = "ece_ef";
        } else if ("ds_ab".equals(batch)) {
            offset = OFFSET_DS_AB;
            targetTable = "ds_ab";
        } else {
            offset = OFFSET_AIML_AB;
            targetTable = "aiml_ab";
        }

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO " + targetTable + " (name, email, year, department, section, leetcode_url) VALUES (?, ?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, request.getName());
            ps.setString(2, request.getEmail());
            ps.setObject(3, 2);
            ps.setString(4, request.getDepartment());
            ps.setString(5, request.getSection());
            ps.setString(6, normLeet);
            return ps;
        }, keyHolder);

        long sourceId = keyHolder.getKey() != null ? keyHolder.getKey().longValue() : 1L;
        return getStudentById(offset + sourceId);
    }

    public Student updateStudent(Long id, StudentRequest request) {
        String normLeet = normalizeUrl(request.getLeetcodeUrl());

        String targetTable;
        long sourceId;
        if (id >= OFFSET_DS_AB) {
            targetTable = "ds_ab";
            sourceId = id - OFFSET_DS_AB;
        } else if (id >= OFFSET_ECE_EF) {
            targetTable = "ece_ef";
            sourceId = id - OFFSET_ECE_EF;
        } else if (id >= OFFSET_AIML_JK) {
            targetTable = "aiml_jk";
            sourceId = id - OFFSET_AIML_JK;
        } else {
            targetTable = "aiml_ab";
            sourceId = id >= OFFSET_AIML_AB ? id - OFFSET_AIML_AB : id;
        }

        jdbcTemplate.update("UPDATE " + targetTable + " SET name = ?, email = ?, leetcode_url = ? WHERE id = ?",
                request.getName(), request.getEmail(), normLeet, sourceId);

        return getStudentById(id);
    }

    public void deleteStudent(Long id) {
        String targetTable;
        long sourceId;
        if (id >= OFFSET_DS_AB) {
            targetTable = "ds_ab";
            sourceId = id - OFFSET_DS_AB;
        } else if (id >= OFFSET_ECE_EF) {
            targetTable = "ece_ef";
            sourceId = id - OFFSET_ECE_EF;
        } else if (id >= OFFSET_AIML_JK) {
            targetTable = "aiml_jk";
            sourceId = id - OFFSET_AIML_JK;
        } else {
            targetTable = "aiml_ab";
            sourceId = id >= OFFSET_AIML_AB ? id - OFFSET_AIML_AB : id;
        }

        jdbcTemplate.update("DELETE FROM " + targetTable + " WHERE id = ?", sourceId);
    }

    public List<Student> searchStudents(String keyword) {
        return getAllStudents(keyword, null, null, null, null, null, null);
    }

    public List<Student> getStudentsByYear(String year) {
        return getAllStudents(null, year, null, null, null, null, null);
    }

    public StudentStatsDto getStatistics() {
        List<Student> all = fetchAllFromDatabase();
        long total = all.size();

        long withLeetcode = all.stream().filter(s -> s.getLeetcodeUrl() != null && !s.getLeetcodeUrl().isBlank()).count();
        long withoutLeetcode = total - withLeetcode;
        long active = all.stream().filter(s -> "Active".equalsIgnoreCase(s.getPlacementStatus())).count();

        Map<String, Long> yearDist = all.stream()
                .filter(s -> s.getYear() != null && !s.getYear().isBlank())
                .collect(Collectors.groupingBy(Student::getYear, Collectors.counting()));

        Map<String, Long> deptDist = all.stream()
                .filter(s -> s.getDepartment() != null && !s.getDepartment().isBlank())
                .collect(Collectors.groupingBy(Student::getDepartment, Collectors.counting()));

        Map<String, Long> batchDist = all.stream()
                .filter(s -> s.getBatch() != null && !s.getBatch().isBlank())
                .collect(Collectors.groupingBy(Student::getBatch, Collectors.counting()));

        Map<String, Long> statusDist = all.stream()
                .filter(s -> s.getPlacementStatus() != null && !s.getPlacementStatus().isBlank())
                .collect(Collectors.groupingBy(Student::getPlacementStatus, Collectors.counting()));

        Map<String, Double> completionRates = new LinkedHashMap<>();
        if (total > 0) {
            double leetRate = ((double) withLeetcode / total) * 100.0;
            completionRates.put("LeetCode", Math.round(leetRate * 10.0) / 10.0);
            completionRates.put("GitHub", 0.0);
            completionRates.put("LinkedIn", 0.0);
        }

        return StudentStatsDto.builder()
                .totalStudents(total)
                .leetcodeProfiles(withLeetcode)
                .missingProfiles(withoutLeetcode)
                .activeStudents(active)
                .yearDistribution(yearDist)
                .departmentDistribution(deptDist)
                .batchDistribution(batchDist)
                .placementStatusDistribution(statusDist)
                .completionRates(completionRates)
                .build();
    }

    public List<Student> getRecentStudents() {
        List<Student> all = fetchAllFromDatabase();
        if (all.isEmpty()) return Collections.emptyList();
        return all.stream()
                .skip(Math.max(0, all.size() - 5))
                .sorted(Comparator.comparing(Student::getId).reversed())
                .collect(Collectors.toList());
    }

    public Map<String, List<String>> getFilterOptions() {
        List<Student> all = fetchAllFromDatabase();

        List<String> years = all.stream().map(Student::getYear).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
        List<String> depts = all.stream().map(Student::getDepartment).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
        List<String> sections = all.stream().map(Student::getSection).filter(Objects::nonNull).distinct().sorted().collect(Collectors.toList());
        List<String> batches = Arrays.asList("aiml_ab", "aiml_jk", "ece_ef", "ds_ab");
        List<String> statuses = Arrays.asList("Active", "Placed", "Opted Out", "In Training", "Under Review");

        Map<String, List<String>> options = new HashMap<>();
        options.put("years", years);
        options.put("departments", depts);
        options.put("sections", sections);
        options.put("batches", batches);
        options.put("placementStatuses", statuses);
        return options;
    }
}
