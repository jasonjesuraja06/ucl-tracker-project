package com.ucltracker.ucl_tracker_backend.service;

import com.ucltracker.ucl_tracker_backend.dto.PlayerRequest;
import com.ucltracker.ucl_tracker_backend.entity.Player;
import com.ucltracker.ucl_tracker_backend.repository.PlayerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@Transactional
public class AdminPlayerService {

    private final PlayerRepository repo;

    public AdminPlayerService(PlayerRepository repo) {
        this.repo = repo;
    }

    public Player getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NoSuchElementException("Player not found: " + id));
    }

    public Player create(PlayerRequest r) {
        Player p = new Player();
        copy(r, p);
        return repo.save(p);
    }

    public Player update(Long id, PlayerRequest r) {
        Player p = getById(id);
        copy(r, p); // full replace
        return repo.save(p);
    }

    public Player patch(Long id, PlayerRequest partial) {
        Player p = getById(id);

        if (nonEmpty(partial.getName())) p.setName(partial.getName());
        if (nonEmpty(partial.getNationality())) p.setNationality(partial.getNationality());
        if (nonEmpty(partial.getPosition())) p.setPosition(partial.getPosition());
        if (nonEmpty(partial.getTeam())) p.setTeam(partial.getTeam());

        if (partial.getAge() != null) p.setAge(partial.getAge());
        if (partial.getMatchesPlayed() != null) p.setMatchesPlayed(partial.getMatchesPlayed());
        if (partial.getGamesStarted() != null) p.setStarts(partial.getGamesStarted());
        if (partial.getMinutes() != null) p.setMinutes(partial.getMinutes());
        if (partial.getGoals() != null) p.setGoals(partial.getGoals());
        if (partial.getAssists() != null) p.setAssists(partial.getAssists());
        if (partial.getPenaltyKicksMade() != null) p.setPkMade(partial.getPenaltyKicksMade());
        if (partial.getXg() != null) p.setXg(partial.getXg());
        if (partial.getXag() != null) p.setXag(partial.getXag());

        return repo.save(p);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NoSuchElementException("Player not found: " + id);
        }
        repo.deleteById(id);
    }

    private void copy(PlayerRequest r, Player p) {
        p.setName(r.getName());
        p.setNationality(r.getNationality());
        p.setPosition(r.getPosition());
        p.setTeam(r.getTeam());
        p.setAge(r.getAge());
        p.setMatchesPlayed(r.getMatchesPlayed());
        p.setStarts(r.getGamesStarted());
        p.setMinutes(r.getMinutes());
        p.setGoals(r.getGoals());
        p.setAssists(r.getAssists());
        p.setPkMade(r.getPenaltyKicksMade());
        p.setXg(r.getXg());
        p.setXag(r.getXag());
    }

    private boolean nonEmpty(String s) {
        return s != null && !s.isBlank();
    }
}
