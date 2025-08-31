import csv
import psycopg2
import traceback

# Database connection config
DB_NAME = "ucl"
DB_USER = "postgres"
DB_PASSWORD = "uefachampionsleague"  # 🔒 Replace this with your actual password
DB_HOST = "localhost"
DB_PORT = "5432"

CSV_FILE = "ucl_player_stats_2024.csv"  # Adjust path if needed

def parse_int(val):
    try:
        return int(val.replace(',', '')) if val else None
    except:
        return None

def import_csv_to_postgres():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD,
            host=DB_HOST, port=DB_PORT
        )
        cur = conn.cursor()
        print("✅ Connected to PostgreSQL")

        with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            print("CSV Headers:", reader.fieldnames)
            count = 0
            for row in reader:
                try:
                    cur.execute(""" 
                        INSERT INTO players2025 (
                            name, nationality, position, team, age,
                            matches_played, starts, minutes, goals,
                            assists, pk_made, xg, xag
                        ) VALUES (
                            %(player)s, %(nationality)s, %(position)s, %(squad)s, %(age)s,
                            %(games)s, %(games_starts)s, %(minutes)s, %(goals)s,
                            %(assists)s, %(pk_made)s, %(xg)s, %(xg_assist)s
                        );
                    """, {
                        'player': row['player'],
                        'nationality': row['nationality'],
                        'position': row['position'],
                        'squad': row['team'],
                        'age': parse_int(row['age']),
                        'games': parse_int(row['games']),
                        'games_starts': parse_int(row['games_starts']),
                        'minutes': parse_int(row['minutes']),
                        'goals': parse_int(row['goals']),
                        'assists': parse_int(row['assists']),
                        'pk_made': parse_int(row['pens_made']),
                        'xg': float(row['xg']) if row['xg'] else None,
                        'xg_assist': float(row['xg_assist']) if row['xg_assist'] else None
                    })
                    count += 1
                except Exception as row_error:
                    print("⚠️ Skipped row due to error:")
                    traceback.print_exc()
                    print("Row contents:", row)

        conn.commit()
        print(f"✅ Successfully imported {count} rows.")
        cur.close()
        conn.close()
    except Exception as db_error:
        print(f"❌ Database connection failed: {db_error}")


if __name__ == '__main__':
    import_csv_to_postgres()