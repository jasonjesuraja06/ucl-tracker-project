import os
import re
import requests
from bs4 import BeautifulSoup
import io
from urllib.parse import urljoin
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Configuration
BASE_URL = "https://fbref.com"
SEASON = "2024-2025"
COMP_ID = "c8"  # Champions League ID
OUTPUT_DIR = "player-photos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Headers to mimic a browser request
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Session with retry logic
session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    raise_on_redirect=True
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("http://", adapter)
session.mount("https://", adapter)

# Rate limiting configuration
MAX_REQUESTS_PER_MINUTE = 10
request_count = 0
last_minute = time.time()

def reset_request_count():
    global request_count, last_minute
    current_time = time.time()
    if current_time - last_minute >= 60:
        request_count = 0
        last_minute = current_time

def wait_for_rate_limit():
    global request_count
    reset_request_count()
    if request_count >= MAX_REQUESTS_PER_MINUTE:
        wait_time = 60 - (time.time() - last_minute)
        print(f"Rate limit reached. Waiting {wait_time:.1f} seconds...")
        time.sleep(wait_time)
        reset_request_count()
    request_count += 1

def fetch_page(url, timeout=10):
    wait_for_rate_limit()
    print(f"Fetching page: {url} (Request {request_count}/{MAX_REQUESTS_PER_MINUTE})")
    response = session.get(url, headers=HEADERS, timeout=timeout)
    print(f"Received response with status: {response.status_code}")
    response.raise_for_status()
    return BeautifulSoup(response.content, 'html.parser')

def extract_players(soup, team_name):
    print(f"Extracting players for {team_name}...")
    players = []
    table = soup.find("table", id="stats_standard_8")
    if not table:
        print(f"Warning: Standard stats table not found for {team_name}")
        return players
    rows = table.find("tbody").find_all("tr")
    for row in rows:
        cells = row.find_all("th") + row.find_all("td")
        if len(cells) < 9:
            print(f"Skipping row with insufficient cells for {team_name}: {len(cells)}")
            continue
        player_name_cell = cells[0]
        minutes_cell = cells[6]  # Minutes column
        minutes_text = minutes_cell.text.strip().replace(',', '')
        minutes = int(minutes_text) if minutes_text and minutes_text.isdigit() else 0
        if minutes >= 1:
            player_link = player_name_cell.find("a")
            if player_link:
                profile_url = urljoin(BASE_URL, player_link["href"])
                player_name = player_link.text.strip()
                players.append((player_name, profile_url))
            else:
                print(f"Warning: No profile link for {player_name_cell.text.strip()} in {team_name}")
    print(f"Extracted {len(players)} players for {team_name}")
    return players

def extract_photo(profile_soup, player_name, team_name):
    wait_for_rate_limit()
    print(f"Extracting photo for {player_name} ({team_name})...")
    photo_div = profile_soup.find("div", class_="media-item")
    if photo_div:
        img_tag = photo_div.find("img")
        if img_tag and 'src' in img_tag.attrs:
            return img_tag['src']
    print(f"Warning: No photo found for {player_name} ({team_name})")
    return None

def download_photo(url, filename, team_name):
    wait_for_rate_limit()
    print(f"Downloading photo from {url} to {filename} for {team_name} (Request {request_count}/{MAX_REQUESTS_PER_MINUTE})")
    response = session.get(url, headers=HEADERS, timeout=10)
    response.raise_for_status()
    filepath = os.path.join(OUTPUT_DIR, team_name.lower().replace(" ", "-"), filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'wb') as f:
        f.write(response.content)
    print(f"Downloaded: {filepath}")

def main():
    try:
        print("Starting script...")
        # Approximate team IDs and names (expand with full list)
        team_data = [
        ]

        for team_name, team_id in team_data:
            squad_url = f"{BASE_URL}/en/squads/{team_id}/{SEASON}/{COMP_ID}/{slugify(team_name)}-Stats-Champions-League"
            print(f"Processing team: {team_name} ({squad_url})")
            soup = fetch_page(squad_url)
            players = extract_players(soup, team_name)
            print(f"Found {len(players)} players with at least 1 minute played for {team_name}.")
            
            for player_name, profile_url in players:
                print(f"Processing profile for {player_name} ({team_name})...")
                profile_soup = fetch_page(profile_url)
                photo_url = extract_photo(profile_soup, player_name, team_name)
                if photo_url:
                    filename = f"{player_name.replace(' ', '-').lower()}.jpg"  # Assuming jpg; adjust if png
                    download_photo(photo_url, filename, team_name)
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        print("Script completed.")

def slugify(name):
    return re.sub(r'[^a-z0-9-]', '', name.lower().replace(' ', '-'))

if __name__ == "__main__":
    main()