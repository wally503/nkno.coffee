from django.core.management.base import BaseCommand
from coffee.models import Countries, MapZone

import csv

MAPZONES_DATA = [
    {'ZoneName': 'Americas', 'Country': 'United States'},
    {'ZoneName': 'Americas', 'Country': 'Colombia'},
    {'ZoneName': 'Americas', 'Country': 'Bolivia'},
    {'ZoneName': 'Americas', 'Country': 'Guatemala'},
    {'ZoneName': 'Americas', 'Country': 'Jamaica'},
    {'ZoneName': 'Americas', 'Country': 'Nicaragua'},
    {'ZoneName': 'Americas', 'Country': 'Peru'},
    {'ZoneName': 'Americas', 'Country': 'Panama'},
    {'ZoneName': 'Americas', 'Country': 'Honduras'},
    {'ZoneName': 'Americas', 'Country': 'Brazil'},
    {'ZoneName': 'Americas', 'Country': 'Costa Rica'},
    {'ZoneName': 'Africa', 'Country': 'Kenya'},
    {'ZoneName': 'Africa', 'Country': 'Ethiopia'},
    {'ZoneName': 'Africa', 'Country': 'Rwanda'},
    {'ZoneName': 'Africa', 'Country': 'Burundi'},
    {'ZoneName': 'Asia Pacific', 'Country': 'Japan'},
    {'ZoneName': 'Asia Pacific', 'Country': 'Thailand'},
    {'ZoneName': 'Asia Pacific', 'Country': 'Papua New Guinea'},
]

class Command(BaseCommand):
    help = 'Import beans from CSV'

    def handle(self, *args, **kwargs):
        self.stdout.write('Importing map zones...')

        for row in MAPZONES_DATA:
            self.stdout.write(f'Importing map zone for {row['Country']}')
            country = Countries.objects.get(name=row['Country'])

            zone, _ = MapZone.objects.get_or_create(zone_name=row['ZoneName'])
            zone.country.add(country)