from django.core.management.base import BaseCommand
from coffee.models import Bean, Roaster, Countries


import csv

# inside handle:
csv_path = '/home/wally/coding/python/nkno.coffee/backend/scripts/beans.csv'

ROAST_MAP = {
    'light': 'light',
    'light-med': 'light_medium',
    'light-medium': 'light_medium',
    'light or light-med': 'light_medium',
    'med-light': 'light_medium',
    'med': 'medium',
    'medium': 'medium',
    'medium?': 'medium',
    'med-dark': 'medium_dark',
    'dark': 'dark',
}

PROCESS_MAP = {
    'washed': 'washed',
    'natural': 'natural',
    'natural/dry processed': 'natural',
    'honey': 'honey',
    'washed & natural': 'washed_natural',
    'washed, ea decaf': 'washed',
    'anaerobic': 'anaerobic_natural',
    'anaerobic natural': 'anaerobic_natural',
    'ethiopia (washed) - no remarks on kenya': 'washed',
}

def parse_elevation(raw):
    if not raw.strip():
        return None, None
    
    # normalize
    raw = raw.strip().lower().replace(',', '')
    is_feet = 'feet' in raw
    raw = raw.replace('masl', '').replace('feet', '').replace('m', '').strip()
    
    if '-' in raw:
        parts = raw.split('-')
        min_e = int(float(parts[0].strip()))
        max_e = int(float(parts[1].strip()))
    else:
        min_e = int(float(raw.strip()))
        max_e = None
    
    if is_feet:
        min_e = int(min_e * 0.3048)
        if max_e:
            max_e = int(max_e * 0.3048)
    
    return min_e, max_e

class Command(BaseCommand):
    help = 'Import beans from CSV'

    def handle(self, *args, **kwargs):
        self.stdout.write('Importing beans...')



        with open(csv_path, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                roaster = Roaster.objects.get(name=row['Roaster'])
                
                country_name = row['Country'].strip().lower()
                if not country_name or country_name.startswith('blend'):
                    country = None
                else:
                    country = Countries.objects.get(name=row['Country'])

                min_elev, max_elev = parse_elevation(row['Elevation'])
                self.stdout.write(f"{row['Blend Name']} -> min:{min_elev} max:{max_elev}")

                Bean.objects.create(
                    name=row['Blend Name'],
                    roaster_id=roaster.id,
                    origin_country_id=country.id if country else None,
                    min_elevation=min_elev,
                    max_elevation=max_elev,
                    purchase_date=row['Date of Purchase / Roast Date'] or None,
                    roast_level=ROAST_MAP.get(row['Roast'].strip().lower()),
                    washing_style=PROCESS_MAP.get(row['Process'].strip().lower()) or '',
                    caff_or_decaf='decaffeinated' if 'decaf' in row['Blend Name'].lower() else 'caffeinated',
                )
