# coffee/management/commands/seed_mapzone_countries.py
from django.core.management.base import BaseCommand
from coffee.models import MapZone, Countries

# zone_id -> list of country_ids to add (already-assigned ones excluded)
SEED = {
    1: [42, 43, 44, 45, 46, 47, 48],                 # Americas
    2: [25, 26, 27, 28, 29, 30, 31, 32, 40],         # Africa
    3: [6, 33, 34, 35, 36, 37, 38, 39, 41],          # Asia Pacific (incl. PNG, was missing)
}


class Command(BaseCommand):
    help = "Attach producing countries to MapZones by id (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument('--commit', action='store_true')

    def handle(self, *args, **options):
        commit = options['commit']

        for zone_id, country_ids in SEED.items():
            try:
                zone = MapZone.objects.get(id=zone_id)
            except MapZone.DoesNotExist:
                self.stdout.write(f"MISSING ZONE id={zone_id}")
                continue

            for cid in country_ids:
                try:
                    country = Countries.objects.get(id=cid)
                except Countries.DoesNotExist:
                    self.stdout.write(f"  missing country id={cid}")
                    continue

                already = zone.countries.filter(id=cid).exists()
                mark = "skip" if already else "add "
                self.stdout.write(f"  {mark}  [{zone.zone_name}]  {country.name}")
                if commit and not already:
                    zone.countries.add(country)

        if not commit:
            self.stdout.write("\ndry run — pass --commit to write")