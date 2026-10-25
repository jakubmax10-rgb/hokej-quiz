import json
import urllib.request
import re
import os

print("Zahajuji stahování statistik ELH...")

URL_POINTS = "https://www.hokej.cz/api/web/stats/center/players?competition=7562&season=2026&stats-all=1"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Referer': 'https://www.hokej.cz/tipsport-extraliga/stats-center'
}

# Načtení existující databáze, pokud už v repozitáři je
existing_db = {}
if os.path.exists('stats_elh.js'):
    try:
        with open('stats_elh.js', 'r', encoding='utf-8') as f:
            content = f.read()
            json_str = re.search(r'const\s+statsDBData\s*=\s*(\[.*?\]);', content, re.DOTALL)
            if json_str:
                for p in json.loads(json_str.group(1)):
                    existing_db[p['name']] = p
    except Exception as e:
        print(f"Poznámka při čtení staré databáze: {e}")

raw_players = []
try:
    req = urllib.request.Request(URL_POINTS, headers=HEADERS)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        raw_players = data.get('players', [])
except Exception as e:
    print(f"API hokej.cz neodpovědělo přímo, použijeme záložní data: {e}")

all_players = []

if raw_players:
    for p in raw_players:
        name = p.get('name', '').strip()
        if not name:
            continue
        old_info = existing_db.get(name, {})
        player_data = {
            "name": name,
            "team": p.get('team', old_info.get('team', 'ELH')),
            "age": int(p.get('age', old_info.get('age', 25))),
            "height": int(old_info.get('height', 183)),
            "weight": int(old_info.get('weight', 85)),
            "number": int(p.get('jersey_number', old_info.get('number', 10))),
            "points": int(p.get('points', 0)),
            "radegast": int(p.get('radegast', 0))
        }
        all_players.append(player_data)
else:
    # Pokud API selhalo, vezmeme to, co už máme uloženo
    all_players = list(existing_db.values())

# Posistka, kdyby byl soubor úplně prázdný
if not all_players:
    all_players = [
        {
            "name": "Martin Růžička",
            "team": "HC Oceláři Třinec",
            "age": 40,
            "height": 181,
            "weight": 85,
            "number": 27,
            "points": 10,
            "radegast": 15
        }
    ]

# Uložení do stats_elh.js
js_content = f"const statsDBData = {json.dumps(all_players, ensure_ascii=False, indent=2)};\n"
with open('stats_elh.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"HOTOVO! Úspěšně uloženo celkem {len(all_players)} hráčů do stats_elh.js.")