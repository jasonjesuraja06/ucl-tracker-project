package com.ucltracker.ucl_tracker_backend.service;

import com.ucltracker.ucl_tracker_backend.entity.Player;
import com.ucltracker.ucl_tracker_backend.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {
    private final PlayerRepository repo;

    private static final Map<String, String> NAT_MAP = Map.ofEntries(
        Map.entry("al ALB", "Albania"),
        Map.entry("am ARM", "Armenia"),
        Map.entry("ao ANG", "Angola"),
        Map.entry("ar ARG", "Argentina"),
        Map.entry("at AUT", "Austria"),
        Map.entry("au AUS", "Australia"),
        Map.entry("ba BIH", "Bosnia"),
        Map.entry("be BEL", "Belgium"),
        Map.entry("bf BFA", "Burkina Faso"),
        Map.entry("br BRA", "Brazil"),
        Map.entry("ca CAN", "Canada"),
        Map.entry("cg CGO", "Republic of the Congo"),
        Map.entry("ci CIV", "Ivory Coast"),
        Map.entry("cl CHI", "Chile"),
        Map.entry("cm CMR", "Cameroon"),
        Map.entry("cd COD", "DR Congo"),
        Map.entry("co COL", "Colombia"),
        Map.entry("cr CRC", "Costa Rica"),
        Map.entry("cz CZE", "Czech Republic"),
        Map.entry("de GER", "Germany"),
        Map.entry("dk DEN", "Denmark"),
        Map.entry("do DOM", "Dominican Republic"),
        Map.entry("dz ALG", "Algeria"),
        Map.entry("ec ECU", "Ecuador"),
        Map.entry("eg EGY", "Egypt"),
        Map.entry("eng ENG", "England"),
        Map.entry("es ESP", "Spain"),
        Map.entry("fi FIN", "Finland"),
        Map.entry("fr FRA", "France"),
        Map.entry("ga GAB", "Gabon"),
        Map.entry("gm GAM", "Gambia"),
        Map.entry("ge GEO", "Georgia"),
        Map.entry("gh GHA", "Ghana"),
        Map.entry("gr GRE", "Greece"),
        Map.entry("gn GUI", "Guinea"),
        Map.entry("gw GNB", "Guinea-Bissau"),
        Map.entry("hn HON", "Honduras"),
        Map.entry("hr CRO", "Croatia"),
        Map.entry("hu HUN", "Hungary"),
        Map.entry("id IDN", "Indonesia"),
        Map.entry("ie IRL", "Ireland"),
        Map.entry("il ISR", "Israel"),
        Map.entry("ir IRN", "Iran"),
        Map.entry("is ISL", "Iceland"),
        Map.entry("it ITA", "Italy"),
        Map.entry("jm JAM", "Jamaica"),
        Map.entry("jp JPN", "Japan"),
        Map.entry("kr KOR", "South Korea"),
        Map.entry("xk KVX", "Kosovo"),
        Map.entry("lu LUX", "Luxembourg"),
        Map.entry("ly LBY", "Libya"),
        Map.entry("mg MAD", "Madagascar"),
        Map.entry("ma MAR", "Morocco"),
        Map.entry("me MNE", "Montenegro"),
        Map.entry("ml MLI", "Mali"),
        Map.entry("mx MEX", "Mexico"),
        Map.entry("mk MKD", "North Macedonia"),
        Map.entry("mz MOZ", "Mozambique"),
        Map.entry("nl NED", "Netherlands"),
        Map.entry("ng NGA", "Nigeria"),
        Map.entry("nir NIR", "Northern Ireland"),
        Map.entry("no NOR", "Norway"),
        Map.entry("nz NZL", "New Zealand"),
        Map.entry("pa PAN", "Panama"),
        Map.entry("py PAR", "Paraguay"),
        Map.entry("pe PER", "Peru"),
        Map.entry("pl POL", "Poland"),
        Map.entry("pt POR", "Portugal"),
        Map.entry("ru RUS", "Russia"),
        Map.entry("sct SCO", "Scotland"),
        Map.entry("sn SEN", "Senegal"),
        Map.entry("rs SRB", "Serbia"),
        Map.entry("ch SUI", "Switzerland"),
        Map.entry("sk SVK", "Slovakia"),
        Map.entry("si SVN", "Slovenia"),
        Map.entry("se SWE", "Sweden"),
        Map.entry("sr SUR", "Suriname"),
        Map.entry("tn TUN", "Tunisia"),
        Map.entry("tr TUR", "Turkey"),
        Map.entry("tz TAN", "Tanzania"),
        Map.entry("ua UKR", "Ukraine"),
        Map.entry("us USA", "United States"),
        Map.entry("uy URU", "Uruguay"),
        Map.entry("uz UZB", "Uzbekistan"),
        Map.entry("ve VEN", "Venezuela"),
        Map.entry("zm ZAM", "Zambia")
    );

    private static final Map<String, String> POS_MAP = Map.of(
        "GK", "Goalkeeper",
        "DF", "Defender",
        "MF", "Midfielder",
        "FW", "Forward"
    );

    public List<Player> getAllPlayers() {
        return repo.findAll();
    }

    public List<Player> getByTeam(String team) {
        return repo.findByTeam(team);
    }

    public List<Player> getByNationality(String nationality) {
        return repo.findByNationality(nationality);
    }

    public List<Player> getByPosition(String position) {
        return repo.findByPosition(position);
    }

    public List<String> getUniqueTeams() {
        return repo.findDistinctTeams();
    }

    public List<String> getUniqueNationalities() {
        return repo.findDistinctNationalities().stream()
            .filter(code -> code != null && !code.isEmpty()) // Exclude null or empty
            .map(code -> NAT_MAP.getOrDefault(code, code))
            .distinct()
            .sorted()
            .collect(Collectors.toList());
    }

    public List<String> getUniquePositions() {
        return List.of("GK", "DF", "MF", "FW");
    }

    public List<Player> getTop(String metric) {
        return switch (metric.toLowerCase()) {
            case "goals" -> repo.findAllByOrderByGoalsDesc();
            case "assists" -> repo.findAllByOrderByAssistsDesc();
            case "xg" -> repo.findAllByOrderByXgDesc();
            case "xag" -> repo.findAllByOrderByXagDesc();
            default -> throw new IllegalArgumentException("Invalid metric: " + metric);
        };
    }

    public List<Player> advancedFilter(String nationality, String position, String team,
                                       int minGoals, String sortBy, int limit) {
        System.out.println("Filtering with: nationality=" + nationality + ", position=" + position + ", team=" + team + ", minGoals=" + minGoals + ", sortBy=" + sortBy + ", limit=" + limit);
        return repo.findAll().stream()
            .filter(p -> {
                boolean matches = nationality == null || nationality.isEmpty() || NAT_MAP.getOrDefault(p.getNationality(), p.getNationality()).equalsIgnoreCase(nationality);
                System.out.println("Player " + p.getName() + " nationality match: " + matches);
                return matches;
            })
            .filter(p -> {
                boolean matches = position == null || position.isEmpty() || 
                    Arrays.stream(p.getPosition().toUpperCase().split(","))
                        .map(String::trim)
                        .anyMatch(pos -> pos.equals(position.toUpperCase()) || POS_MAP.getOrDefault(pos, "").equalsIgnoreCase(position));
                System.out.println("Player " + p.getName() + " position match: " + matches + " (position=" + p.getPosition() + ")");
                return matches;
            })
            .filter(p -> {
                String parsedTeam = parseTeam(p.getTeam());
                boolean matches = team == null || team.isEmpty() || parsedTeam.equalsIgnoreCase(team);
                System.out.println("Player " + p.getName() + " team match: " + matches + " (parsedTeam=" + parsedTeam + ")");
                return matches;
            })
            .filter(p -> (p.getGoals() == null ? 0 : p.getGoals()) >= minGoals)
            .sorted((p1, p2) -> {
                return switch (sortBy.toLowerCase()) {
                    case "goals" -> Integer.compare(
                        p2.getGoals() == null ? 0 : p2.getGoals(),
                        p1.getGoals() == null ? 0 : p1.getGoals()
                    );
                    case "assists" -> Integer.compare(
                        p2.getAssists() == null ? 0 : p2.getAssists(),
                        p1.getAssists() == null ? 0 : p1.getAssists()
                    );
                    case "xg" -> Double.compare(
                        p2.getXg() == null ? 0.0 : p2.getXg(),
                        p1.getXg() == null ? 0.0 : p1.getXg()
                    );
                    case "xag" -> Double.compare(
                        p2.getXag() == null ? 0.0 : p2.getXag(),
                        p1.getXag() == null ? 0.0 : p1.getXag()
                    );
                    default -> 0;
                };
            })
            .limit(limit)
            .collect(Collectors.toList());
    }

    public List<Player> searchByName(String name) {
        return repo.findAll().stream()
            .filter(p -> p.getName().toLowerCase().contains(name.toLowerCase()))
            .collect(Collectors.toList());
    }

    private String parseTeam(String raw) {
        String[] parts = raw.split(" ");
        return parts.length > 1 ? String.join(" ", Arrays.copyOfRange(parts, 1, parts.length)) : raw;
    }
}