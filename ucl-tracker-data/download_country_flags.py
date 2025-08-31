import os
import pandas as pd
import requests
from time import sleep

# Load CSV
df = pd.read_csv("ucl_player_stats_2024.csv")
nationality_raw = df["nationality"].dropna().unique()

# Extract 3-letter codes from "eng ENG" → "ENG"
three_letter_codes = sorted({nat.split()[-1] for nat in nationality_raw})

# Mapping from 3-letter FIFA/IOC codes to ISO 3166-1 alpha-2 codes (used by flagcdn.com)
fifa_to_iso2 = {
    "ALB": "al", "ALG": "dz", "ANG": "ao", "ARG": "ar", "ARM": "am", "AUT": "at", "BEL": "be",
    "BFA": "bf", "BIH": "ba", "BRA": "br", "CAN": "ca", "CGO": "cg", "CHI": "cl", "CIV": "ci", "CMR": "cm",
    "COD": "cd", "COL": "co", "CRO": "hr", "CRC": "cr", "CZE": "cz", "DEN": "dk", "DOM": "do", "ECU": "ec", 
    "EGY": "eg", "ENG": "gb-eng", "ESP": "es", "FRA": "fr", "FIN": "fi", "GAB": "ga", "GAM": "gm", "GEO": "ge", 
    "GER": "de", "GHA": "gh","GRE": "gr", "GNB": "gw", "GUI": "gn", "HON": "hn", "HUN": "hu", "IRL": "ie", 
    "IRN": "ir", "ISL": "is", "ISR": "il", "ITA": "it", "JAM": "jm", "JPN": "jp", "KOR": "kr", "KVX": "xk", 
    "LUX": "lu", "LBY": "ly", "MAD": "mg", "MAR": "ma", "MEX": "mx", "MKD": "mk", "MLI": "ml", "MNE": "me", 
    "MOZ": "mz", "NED": "nl", "NGA": "ng", "NIR": "gb-nir", "NOR": "no", "PAN": "pa", "POL": "pl", "POR": "pt", 
    "RUS": "ru", "SCO": "gb-sct", "SEN": "sn", "SRB": "rs", "SUI": "ch", "SVK": "sk", "SVN": "si", "SWE": "se", 
    "TUN": "tn", "TUR": "tr", "UKR": "ua", "URU": "uy", "USA": "us", "UZB": "uz", "VEN": "ve", "ZAM": "zm"
}

# Output folder (relative to frontend project root)
output_dir = "ucl-tracker-data/src/public/flags"
os.makedirs(output_dir, exist_ok=True)

# Download flags using ISO alpha-2 codes
for three_letter in three_letter_codes:
    iso2 = fifa_to_iso2.get(three_letter)
    if not iso2:
        print(f"⚠️ No ISO code for: {three_letter}")
        continue

    filename = f"{iso2}.png"
    filepath = os.path.join(output_dir, filename)

    # FlagCDN URL
    url = f"https://flagcdn.com/w80/{iso2.lower()}.png"

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            print(f"✅ Downloaded: {filename}")
        else:
            print(f"❌ Failed for {filename}: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Error for {filename}: {e}")

    sleep(0.2)  # Be respectful to server