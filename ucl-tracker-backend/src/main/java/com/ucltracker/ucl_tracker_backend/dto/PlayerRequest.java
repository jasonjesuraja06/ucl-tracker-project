package com.ucltracker.ucl_tracker_backend.dto;

import jakarta.validation.constraints.*;

public class PlayerRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String nationality; // keep prefix format from CSV e.g., "eng England" or "gb-eng"

    @NotBlank
    private String position;    // GK / DF / MF / FW

    @NotBlank
    private String team;        // keep prefix format from CSV e.g., "eng Manchester City"

    @Min(0)
    private Integer age;

    @Min(0)
    private Integer matchesPlayed;

    @Min(0)
    private Integer gamesStarted;

    @Min(0)
    private Integer minutes;

    @Min(0)
    private Integer goals;

    @Min(0)
    private Integer assists;

    @Min(0)
    private Integer penaltyKicksMade;

    @DecimalMin(value = "0.0", inclusive = true)
    private Double xg;

    @DecimalMin(value = "0.0", inclusive = true)
    private Double xag;

    // Getters & Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getTeam() { return team; }
    public void setTeam(String team) { this.team = team; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Integer getMatchesPlayed() { return matchesPlayed; }
    public void setMatchesPlayed(Integer matchesPlayed) { this.matchesPlayed = matchesPlayed; }

    public Integer getGamesStarted() { return gamesStarted; }
    public void setGamesStarted(Integer gamesStarted) { this.gamesStarted = gamesStarted; }

    public Integer getMinutes() { return minutes; }
    public void setMinutes(Integer minutes) { this.minutes = minutes; }

    public Integer getGoals() { return goals; }
    public void setGoals(Integer goals) { this.goals = goals; }

    public Integer getAssists() { return assists; }
    public void setAssists(Integer assists) { this.assists = assists; }

    public Integer getPenaltyKicksMade() { return penaltyKicksMade; }
    public void setPenaltyKicksMade(Integer penaltyKicksMade) { this.penaltyKicksMade = penaltyKicksMade; }

    public Double getXg() { return xg; }
    public void setXg(Double xg) { this.xg = xg; }

    public Double getXag() { return xag; }
    public void setXag(Double xag) { this.xag = xag; }
}
