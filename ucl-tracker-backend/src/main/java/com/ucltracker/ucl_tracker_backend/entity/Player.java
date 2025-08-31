package com.ucltracker.ucl_tracker_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "players2025") // Updated table name to reflect the 2024-2025 season
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nationality;
    private String position;
    private String team; // Note: this was previously "squad"

    private Integer age;
    private Integer matchesPlayed;
    private Integer starts;
    private Integer minutes;
    private Integer goals;
    private Integer assists;
    private Integer pkMade;
    private Double xg;
    private Double xag;
}