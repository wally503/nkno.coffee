from django.core.management.base import BaseCommand
from coffee.models import Species

SPECIES = [
    "Arabica",       # Coffea arabica
    "Robusta",       # Coffea canephora
    "Liberica",      # Coffea liberica
    "Excelsa",       # Coffea liberica var. dewevrei (often filed under Liberica now)
    "Eugenioides",   # Coffea eugenioides, rare; one of arabica's parents
    "Stenophylla",   # Coffea stenophylla, rare
]

class Command(BaseCommand):
    help = 'Import species for empty species table'

    def handle(self, *args, **kwargs):
        self.stdout.write('Importing species...')

        for spec in SPECIES:
            Species.objects.create(
                name=spec
            )