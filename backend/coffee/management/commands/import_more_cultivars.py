from django.core.management.base import BaseCommand
from coffee.models import Cultivar

CULTIVARS_FROM_WCR_GRAPH = [
    # Typica group
    "Typica", "Nyasaland", "SL14", "SL34", "Mibirizi", "Harrar Rwanda", "Peche",
    # Bourbon group
    "Bourbon", "Bourbon Mayaguez 139", "Bourbon Mayaguez 71", "Caturra", "Catuai",
    "Villa Sarchi", "Pacamara", "Maragogype", "Mundo Novo", "Jackson",
    "Jackson 2/1257", "K7", "SL28", "Kent", "Tekisic", "Venecia", "KP423",
    "French Mission", "Batian", "Ruiru 11", "RAB C15",
    # Ethiopian landrace
    "Geisha", "Rume Sudan", "Java",
    # F1 hybrids
    "Centroamericano", "Milenio", "Mundo Maya", "Evaluna", "Nayarita",
    "Starmaya", "Esperanza", "H3", "Casiopea",
    # Sarchimor
    "Paraiso", "Cuscatleco", "Marsellesa", "Obata Rojo", "Monte Claro",
    "Limani", "IAPAR 59", "T5296",
    # Catimor
    "IHCAFE 90", "T8667", "Fronton", "Lempira", "Catisic", "Oro Azteca",
    "Costa Rica 95", "Catimor 129", "T5175", "Anacafe 14",
    # Other
    "Timor Hybrid",
]

class Command(BaseCommand):
    help = 'Import cultivars for empty cultivar table'


    def handle(self, *args, **kwargs):
        self.stdout.write('Importing cultivars...')

        existing_names: set[str] = {
            name.casefold()
            for name in Cultivar.objects.values_list("name", flat=True)
        }


        for cultvr in CULTIVARS_FROM_WCR_GRAPH:
            key: str = cultvr.strip().casefold()

            if key not in existing_names:
                self.stdout.write(f'Importing cultivar {cultvr}...')
                Cultivar.objects.create(name=cultvr.strip())
                existing_names.add(key)