import os
import re

# Directories
FLAGS_DIR = 'public/flags'
LOGOS_DIR = 'public/team-logos'

# Lowercase-dash format of country names
country_map = {
    'al': 'albania', 'dz': 'algeria', 'ao': 'angola', 'ar': 'argentina', 'am': 'armenia', 'at': 'austria', 'be': 'belgium',
    'bf': 'burkina-faso', 'ba': 'bosnia-herzegovina', 'br': 'brazil', 'ca': 'canada', 'cg': 'republic-of-the-congo', 'cl': 'chile',
    'ci': 'ivory-coast', 'cm': 'cameroon', 'cd': 'dr-congo', 'co': 'colombia', 'hr': 'croatia', 'cr': 'costa-rica', 'cz': 'czech-republic',
    'dk': 'denmark', 'do': 'dominican-republic', 'ec': 'ecuador', 'eg': 'egypt', 'gb-eng': 'england', 'es': 'spain', 'fr': 'france', 'fi': 'finland',
    'ga': 'gabon', 'gm': 'gambia', 'ge': 'georgia', 'de': 'germany', 'gh': 'ghana', 'gr': 'greece', 'gw': 'guinea-bissau', 'gn': 'guinea',
    'hn': 'honduras', 'hu': 'hungary', 'id': 'indonesia', 'ie': 'ireland', 'ir': 'iran', 'is': 'iceland', 'il': 'israel', 'it': 'italy',
    'jm': 'jamaica', 'jp': 'japan', 'kr': 'south-korea', 'xk': 'kosovo', 'lu': 'luxembourg', 'ly': 'libya', 'mg': 'madagascar', 'ma': 'morocco',
    'mx': 'mexico', 'mk': 'north-macedonia', 'ml': 'mali', 'me': 'montenegro', 'mz': 'mozambique', 'nl': 'netherlands', 'ng': 'nigeria',
    'gb-nir': 'northern-ireland', 'no': 'norway', 'pa': 'panama', 'py': 'paraguay', 'pe': 'peru', 'pl': 'poland', 'pt': 'portugal',
    'ru': 'russia', 'gb-sct': 'scotland', 'sn': 'senegal', 'rs': 'serbia', 'ch': 'switzerland', 'sk': 'slovakia', 'si': 'slovenia',
    'se': 'sweden', 'tn': 'tunisia', 'tr': 'turkey', 'ua': 'ukraine', 'uy': 'uruguay', 'us': 'united-states', 'uz': 'uzbekistan',
    've': 'venezuela', 'zm': 'zambia'
}

def slugify(name):
    return re.sub(r'[^\w-]', '', name.lower().replace(' ', '-'))

# Reverse map: country name → ISO code (for renaming if needed)
value_to_code = {v: k for k, v in country_map.items()}

# Rename country flags
def rename_flags():
    print('🔁 Renaming country flags...')
    for filename in os.listdir(FLAGS_DIR):
        if not filename.endswith('.png'):
            continue
        base = filename[:-4].lower()
        if base not in country_map:
            print(f'⚠️ Unknown flag filename: {filename}')
            continue
        expected_name = slugify(country_map[base]) + '.png'
        src = os.path.join(FLAGS_DIR, filename)
        dst = os.path.join(FLAGS_DIR, expected_name)
        if filename != expected_name:
            os.rename(src, dst)
            print(f'✅ {filename} → {expected_name}')
        else:
            print(f'✅ {filename} already correctly named')

# Team logo renaming stays unchanged
def rename_logos():
    print('🔁 Renaming team logos...')
    for filename in os.listdir(LOGOS_DIR):
        if not filename.endswith('.png'):
            continue
        name = filename[:-4]
        if ' ' in name:
            _, team = name.split(' ', 1)  # Drop prefix
        else:
            team = name
        new_name = slugify(team) + '.png'
        src = os.path.join(LOGOS_DIR, filename)
        dst = os.path.join(LOGOS_DIR, new_name)
        if filename != new_name:
            os.rename(src, dst)
            print(f'✅ {filename} → {new_name}')
        else:
            print(f'✅ {filename} already correctly named')

if __name__ == '__main__':
    rename_flags()
    print()
    rename_logos()
    print('\n🎉 Done! All filenames verified or renamed.')