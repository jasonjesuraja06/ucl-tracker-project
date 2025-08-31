package com.ucltracker.ucl_tracker_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
    // No body needed. This enables @PreAuthorize/@PostAuthorize.
}
