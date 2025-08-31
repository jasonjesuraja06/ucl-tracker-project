import subprocess
from bs4 import BeautifulSoup, Comment
import re
import csv

# Include 'squad' to capture team name
TARGET_COLUMNS = [
    "player", "nationality", "position", "team", "age",
    "games", "games_starts", "minutes", "goals", "assists",
    "pens_made", "xg", "xg_assist"
]

def scrape_champions_league_stats(url):
    curl_command = [
        'curl', '-s',
        '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
        url
    ]
    try:
        result = subprocess.run(curl_command, capture_output=True, text=False, check=True)
        html = result.stdout.decode('utf-8', errors='replace')
    except subprocess.CalledProcessError as e:
        print(f"Failed to fetch page with curl: {e}")
        return None
    except UnicodeDecodeError as e:
        print(f"Encoding error while decoding curl output: {e}")
        return None

    if not html:
        print("No HTML content received from curl.")
        return None

    soup = BeautifulSoup(html, 'html.parser')
    return extract_table_from_div(soup, 'all_stats_standard', 'stats_standard')

def extract_table_from_div(soup, div_id, target_table_id):
    div = soup.find('div', id=div_id)
    if not div:
        print(f"No div found with id: {div_id}")
        return None

    comments = div.find_all(string=lambda text: isinstance(text, Comment))
    table_soup = None

    for comment in comments:
        if target_table_id in comment:
            table_soup = BeautifulSoup(comment, 'html.parser')
            break

    if not table_soup:
        print(f"No commented table with id: {target_table_id} found.")
        return None

    table = table_soup.find('table', id=target_table_id)
    if not table:
        print(f"Table with id {target_table_id} not found in parsed comment.")
        return None

    # Extract header row
    header_row = table.find('thead').find_all('tr')[-1]
    headers = [th.get('data-stat') for th in header_row.find_all('th')]
    print("Parsed headers from table:", headers)

    # Filter only target columns
    col_indices = [i for i, h in enumerate(headers) if h in TARGET_COLUMNS]
    filtered_headers = [headers[i] for i in col_indices]

    rows = []
    for tr in table.find('tbody').find_all('tr'):
        if tr.get('class') and 'thead' in tr['class']:
            continue
        cells = tr.find_all(['td', 'th'])
        row_data = [cells[i].text.strip() for i in col_indices if i < len(cells)]
        if row_data:
            rows.append(row_data)

    return {'headers': filtered_headers, 'rows': rows}

def save_to_csv(data, filename='ucl_player_stats_2024.csv'):
    if not data:
        print("No data to save.")
        return

    # Normalize header casing to lowercase
    normalized_headers = [h.lower() for h in data['headers']]

    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(normalized_headers)
        for row in data['rows']:
            writer.writerow(row)

    print(f"✅ Data saved to {filename}")

if __name__ == "__main__":
    url = "https://fbref.com/en/comps/8/2024-2025/stats/2024-2025-Champions-League-Stats"
    stats_data = scrape_champions_league_stats(url)

    if stats_data:
        print("Headers:", stats_data['headers'])
        print("Sample Row:", stats_data['rows'][0] if stats_data['rows'] else "No rows")
        save_to_csv(stats_data)