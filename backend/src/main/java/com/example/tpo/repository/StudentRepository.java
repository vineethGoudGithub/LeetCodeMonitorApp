package com.example.tpo.repository;

import com.example.tpo.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT s FROM Student s WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:year IS NULL OR :year = '' OR s.year = :year) AND " +
           "(:department IS NULL OR :department = '' OR s.department = :department) AND " +
           "(:section IS NULL OR :section = '' OR s.section = :section) AND " +
           "(:batch IS NULL OR :batch = '' OR s.batch = :batch) AND " +
           "(:placementStatus IS NULL OR :placementStatus = '' OR s.placementStatus = :placementStatus) AND " +
           "(:hasLeetcode IS NULL OR " +
           " (:hasLeetcode = true AND s.leetcodeUrl IS NOT NULL AND TRIM(s.leetcodeUrl) != '') OR " +
           " (:hasLeetcode = false AND (s.leetcodeUrl IS NULL OR TRIM(s.leetcodeUrl) = '')))")
    Page<Student> findWithFilters(
            @Param("keyword") String keyword,
            @Param("year") String year,
            @Param("department") String department,
            @Param("section") String section,
            @Param("batch") String batch,
            @Param("placementStatus") String placementStatus,
            @Param("hasLeetcode") Boolean hasLeetcode,
            Pageable pageable
    );

    @Query("SELECT s FROM Student s WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:year IS NULL OR :year = '' OR s.year = :year) AND " +
           "(:department IS NULL OR :department = '' OR s.department = :department) AND " +
           "(:section IS NULL OR :section = '' OR s.section = :section) AND " +
           "(:batch IS NULL OR :batch = '' OR s.batch = :batch) AND " +
           "(:placementStatus IS NULL OR :placementStatus = '' OR s.placementStatus = :placementStatus) AND " +
           "(:hasLeetcode IS NULL OR " +
           " (:hasLeetcode = true AND s.leetcodeUrl IS NOT NULL AND TRIM(s.leetcodeUrl) != '') OR " +
           " (:hasLeetcode = false AND (s.leetcodeUrl IS NULL OR TRIM(s.leetcodeUrl) = '')))")
    List<Student> findAllWithFilters(
            @Param("keyword") String keyword,
            @Param("year") String year,
            @Param("department") String department,
            @Param("section") String section,
            @Param("batch") String batch,
            @Param("placementStatus") String placementStatus,
            @Param("hasLeetcode") Boolean hasLeetcode
    );

    List<Student> findByYear(String year);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchByKeyword(@Param("keyword") String keyword);

    long countByPlacementStatus(String placementStatus);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.leetcodeUrl IS NOT NULL AND TRIM(s.leetcodeUrl) != ''")
    long countWithLeetcode();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.leetcodeUrl IS NULL OR TRIM(s.leetcodeUrl) = ''")
    long countWithoutLeetcode();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.githubUrl IS NOT NULL AND TRIM(s.githubUrl) != ''")
    long countWithGithub();

    @Query("SELECT COUNT(s) FROM Student s WHERE s.linkedinUrl IS NOT NULL AND TRIM(s.linkedinUrl) != ''")
    long countWithLinkedin();

    @Query("SELECT DISTINCT s.year FROM Student s WHERE s.year IS NOT NULL AND s.year != '' ORDER BY s.year")
    List<String> findDistinctYears();

    @Query("SELECT DISTINCT s.department FROM Student s WHERE s.department IS NOT NULL AND s.department != '' ORDER BY s.department")
    List<String> findDistinctDepartments();

    @Query("SELECT DISTINCT s.section FROM Student s WHERE s.section IS NOT NULL AND s.section != '' ORDER BY s.section")
    List<String> findDistinctSections();

    @Query("SELECT DISTINCT s.batch FROM Student s WHERE s.batch IS NOT NULL AND s.batch != '' ORDER BY s.batch")
    List<String> findDistinctBatches();

    List<Student> findTop5ByOrderByIdDesc();
}
