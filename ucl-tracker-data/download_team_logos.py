import os
import requests

# Directory where team logos will be saved
SAVE_DIR = "ucl-tracker-data/src/public/team-logos"
os.makedirs(SAVE_DIR, exist_ok=True)

# Mapping of display name (as found in your CSV) to ESPN ID
espn_team_ids = {
    "at RB Salzburg": 379,
    "at Sturm Graz": 3746,
    "be Club Brugge": 570,
    "ch Young Boys": 2722,
    "cz Sparta Prague": 433,
    "de Bayern Munich": 132,
    "de Dortmund": 124,
    "de Leverkusen": 131,
    "de RB Leipzig": 2790,
    "de Stuttgart": 134,
    "eng Arsenal": 359,
    "eng Aston Villa": 362,
    "eng Liverpool": 364,
    "eng Manchester City": 382,
    "es Atlético Madrid": 1068,
    "es Barcelona": 83,
    "es Girona": 9812,
    "es Real Madrid": 86,
    "fr Brest": 6997,
    "fr Lille": 166,
    "fr Monaco": 174,
    "fr Paris S-G": 160,
    "hr Dinamo Zagreb": 597,
    "it Atalanta": 105,
    "it Bologna": 107,
    "it Inter": 110,
    "it Juventus": 111,
    "it Milan": 103,
    "nl Feyenoord": 142,
    "nl PSV Eindhoven": 148,
    "pt Benfica": 1929,
    "pt Sporting CP": 2250,
    "rs Red Star": 2290,
    "sct Celtic": 256,
    "sk Slovan Bratislava": 521,
    "ua Shakhtar": 493
}

# Download each logo
for team_name, team_id in espn_team_ids.items():
    url = f"https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/{team_id}.png&h=200&w=200"
    filename = f"{team_name}.png"
    save_path = os.path.join(SAVE_DIR, filename)

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(response.content)
            print(f"✅ Downloaded: {filename}")
        else:
            print(f"❌ Failed for {team_name} (Status {response.status_code})")
    except Exception as e:
        print(f"❌ Error downloading {team_name}: {e}")