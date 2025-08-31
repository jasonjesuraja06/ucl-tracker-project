package com.ucltracker.ucl_tracker_backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component("adminGuard")
public class AdminGuard {

    private final Set<String> allowedEmails;

    public AdminGuard(@Value("${app.admin.emails:}") String emails) {
        // Comma-separated list in properties; case-insensitive matching
        this.allowedEmails = Arrays.stream(emails.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    public boolean isAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String email = extractEmail(authentication);
        return email != null && allowedEmails.contains(email.toLowerCase());
    }

    private String extractEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        // Case 1: OIDC (most common with Google + openid scope)
        if (principal instanceof OidcUser oidc) {
            String email = oidc.getEmail();
            if (email == null) {
                Object attr = oidc.getAttributes().get("email");
                if (attr != null) email = attr.toString();
            }
            return email;
        }

        // Case 2: Default OAuth2 user
        if (principal instanceof DefaultOAuth2User oauth) {
            Object attr = oauth.getAttributes().get("email");
            return attr != null ? attr.toString() : null;
        }

        // Case 3: Resource server with JWT auth (if you later use JWT tokens on API calls)
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            if (jwt.hasClaim("email")) {
                return jwt.getClaim("email");
            }
            // Some providers only expose sub; not ideal, but fallback
            if (jwt.hasClaim("sub")) {
                return jwt.getClaim("sub");
            }
        }

        return null;
    }
}
