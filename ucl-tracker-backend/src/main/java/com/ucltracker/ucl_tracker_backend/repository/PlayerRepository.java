// PlayerRepository.java
package com.ucltracker.ucl_tracker_backend.repository;

import com.ucltracker.ucl_tracker_backend.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    @Query("SELECT p FROM Player p WHERE p.team = :team")
    List<Player> findByTeam(@Param("team") String team);

    @Query("SELECT p FROM Player p WHERE p.nationality = :nationality")
    List<Player> findByNationality(@Param("nationality") String nationality);

    @Query("SELECT p FROM Player p WHERE p.position LIKE CONCAT('%', :position, '%')")
    List<Player> findByPosition(@Param("position") String position);

    @Query("SELECT p FROM Player p ORDER BY COALESCE(p.goals, 0) DESC")
    List<Player> findAllByOrderByGoalsDesc();

    @Query("SELECT p FROM Player p ORDER BY COALESCE(p.assists, 0) DESC")
    List<Player> findAllByOrderByAssistsDesc();

    @Query("SELECT p FROM Player p ORDER BY COALESCE(p.xg, 0.0) DESC")
    List<Player> findAllByOrderByXgDesc();

    @Query("SELECT p FROM Player p ORDER BY COALESCE(p.xag, 0.0) DESC")
    List<Player> findAllByOrderByXagDesc();

    @Query("SELECT DISTINCT p.team FROM Player p ORDER BY p.team ASC")
    List<String> findDistinctTeams();

    @Query("SELECT DISTINCT p.nationality FROM Player p ORDER BY p.nationality ASC")
    List<String> findDistinctNationalities();

    @Query("SELECT DISTINCT p.position FROM Player p ORDER BY p.position ASC")
    List<String> findDistinctPositions();
}