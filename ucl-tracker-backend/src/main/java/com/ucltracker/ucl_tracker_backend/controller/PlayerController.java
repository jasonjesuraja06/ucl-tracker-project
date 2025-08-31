package com.ucltracker.ucl_tracker_backend.controller;

import com.ucltracker.ucl_tracker_backend.entity.Player;
import com.ucltracker.ucl_tracker_backend.service.PlayerService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService service;

    @GetMapping
    public List<Player> getAll() {
        return service.getAllPlayers();
    }

    @GetMapping("/teams")
    public List<String> getUniqueTeams() {
        return service.getUniqueTeams();
    }

    @GetMapping("/teams/{team}")
    public List<Player> byTeam(@PathVariable String team) {
        return service.getByTeam(team);
    }

    @GetMapping("/nationalities")
    public List<String> getUniqueNationalities() {
        return service.getUniqueNationalities();
    }

    @GetMapping("/nationalities/{country}")
    public List<Player> byNationality(@PathVariable String country) {
        return service.getByNationality(country);
    }

    @GetMapping("/positions")
    public List<String> getUniquePositions() {
        return service.getUniquePositions();
    }

    @GetMapping("/positions/{position}")
    public List<Player> byPosition(@PathVariable String position) {
        return service.getByPosition(position);
    }

    @GetMapping("/leaderboard")
    public List<Player> leaderboard(
        @RequestParam String metric,
        @RequestParam(defaultValue = "10") int limit
    ) {
        return service.getTop(metric).stream().limit(limit).toList();
    }

    @GetMapping("/filter")
    public List<Player> advancedFilter(
        @RequestParam(required = false) String nationality,
        @RequestParam(required = false) String position,
        @RequestParam(required = false) String team,
        @RequestParam(required = false, defaultValue = "0") int minGoals,
        @RequestParam(required = false, defaultValue = "goals") String sortBy,
        @RequestParam(required = false, defaultValue = "10") int limit
    ) {
        return service.advancedFilter(nationality, position, team, minGoals, sortBy, limit);
    }

    @GetMapping("/search")
    public List<Player> searchByName(@RequestParam String name) {
        return service.searchByName(name);
    }
}