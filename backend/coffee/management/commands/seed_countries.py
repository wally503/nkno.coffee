# coffee/management/commands/seed_countries.py
from django.core.management.base import BaseCommand
from coffee.models import Countries

COUNTRIES_LIST = [
    ("Australia", "036"),
    ("Tanzania", "834"),
    ("Uganda", "800"),
    ("Democratic Republic of the Congo", "180"),
    ("Ivory Coast", "384"),
    ("Cameroon", "120"),
    ("Zambia", "894"),
    ("Malawi", "454"),
    ("Zimbabwe", "716"),
    ("Vietnam", "704"),
    ("Indonesia", "360"),
    ("India", "356"),
    ("Philippines", "608"),
    ("Laos", "418"),
    ("Myanmar", "104"),
    ("Timor-Leste", "626"),
    ("Yemen", "887"),
    ("China", "156"),
    ("Mexico", "484"),
    ("Ecuador", "218"),
    ("El Salvador", "222"),
    ("Venezuela", "862"),
    ("Dominican Republic", "214"),
    ("Cuba", "192"),
    ("Haiti", "332"),
]


class Command(BaseCommand):
    help = "Seed coffee-producing countries (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument('--commit', action='store_true',
                            help='Actually write. Without this, just prints the plan.')

    def handle(self, *args, **options):
        commit = options['commit']
        created = existing = 0

        for name, code in COUNTRIES_LIST:
            exists = Countries.objects.filter(iso_code=code).exists()
            if exists:
                self.stdout.write(f"skip   {code}  {name}  (exists)")
                existing += 1
                continue

            self.stdout.write(f"add    {code}  {name}")
            created += 1
            if commit:
                Countries.objects.create(name=name, iso_code=code)

        self.stdout.write(f"\n{created} to add, {existing} already present")
        if not commit:
            self.stdout.write("dry run — pass --commit to write")