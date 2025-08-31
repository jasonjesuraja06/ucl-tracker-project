package com.ucltracker.ucl_tracker_backend.controller;

import com.ucltracker.ucl_tracker_backend.dto.PlayerRequest;
import com.ucltracker.ucl_tracker_backend.entity.Player;
import com.ucltracker.ucl_tracker_backend.service.AdminPlayerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/players")
public class AdminPlayerController {

    private final AdminPlayerService service;

    public AdminPlayerController(AdminPlayerService service) {
        this.service = service;
    }

    // Anyone authenticated can read one (matches your existing protections for /api/**)
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        Player p = service.getById(id);
        return ResponseEntity.ok(p);
    }

    // CREATE — Admin only
    @PreAuthorize("@adminGuard.isAdmin(authentication)")
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody PlayerRequest req) {
        Player created = service.create(req);
        return ResponseEntity.created(URI.create("/api/players/" + created.getId()))
                .body(created);
    }

    // FULL UPDATE — Admin only
    @PreAuthorize("@adminGuard.isAdmin(authentication)")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody PlayerRequest req) {
        Player updated = service.update(id, req);
        return ResponseEntity.ok(updated);
    }

    // PARTIAL UPDATE — Admin only
    @PreAuthorize("@adminGuard.isAdmin(authentication)")
    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody PlayerRequest partial) {
        Player updated = service.patch(id, partial);
        return ResponseEntity.ok(updated);
    }

    // DELETE — Admin only
    @PreAuthorize("@adminGuard.isAdmin(authentication)")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
