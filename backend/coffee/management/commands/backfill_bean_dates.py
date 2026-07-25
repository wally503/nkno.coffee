from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from coffee.models import Bean

KNOWN_DATES = {
    "p_PkHNPN": "2020-11-18",
    "fu6WB2DH": "2020-12-11",
    "oD0kzYJ5": "2021-01-23",
    "uPIXSZpc": "2021-02-13",
    "t5I4eQ3h": "2021-03-08",
    "Im1mgb2n": "2021-04-02",
    "doNhb2mV": "2021-04-19",
    "RkFJUX3-": "2021-05-21",
    "qRofErh0": "2021-06-14",
    "28BcrADg": "2021-07-04",
    "ujQth2YQ": "2021-07-31",
    "wgs_YsEU": "2021-08-14",
    "H3LZeAbv": "2021-09-03",
    "unUWoDqm": "2021-10-14",
    "2jVNSr7A": "2021-11-06",
    "bJIJ_yaA": "2021-11-26",
    "Qt1FnVda": "2021-09-24",
    "z3vTVJhJ": "2021-07-02",
    "iY3WCvi9": "2022-02-01",
    "TBqzH4-1": "2022-02-20",
    "KVA9PAQo": "2022-03-20",
    "enx3jFsp": "2024-10-19",
    "ILFif0Ex": "2024-12-22",
    "T9C9XKiH": "2025-03-24",
    "q7XHmMaP": "2025-03-24",
    "w5-IBc0d": "2025-09-03",
    "RvCzw3HP": "2026-05-11",
    "56GRZKu7": "2026-05-11",
    "DT3wk_j8": "2026-04-06",
    "JGpZkZgE": "2026-04-06",
    "m39kDj1Y": "2026-03-21",
    "_A4q55LH": "2025-11-24",
    "d-NGAX1W": "2025-10-19",
    "yWhaEafl": "2021-01-02",
    "7CWr1HsO": "2026-07-06",
    "2ypNZEj9": "2026-06-13",
    "Z9ltXr9T": "2026-06-13",
    "jPxiiqTX": "2021-04-10",
    "mcNn6Tpu": "2022-03-05",
    "bomTe_uX": "2022-05-29",
    "_Am_fFB6": "2024-02-24",
    "PFD_bjKJ": "2024-02-24",
    "rs9qNyG2": "2024-03-18",
    "ZePdRJN8": "2024-03-18",
    "C9Ucpunv": "2024-04-24",
    "z9YITrxX": "2024-05-04",
    "E5VYqZFJ": "2024-06-10",
    "gKwiDZ95": "2024-10-19",
    "b7SRn6vV": "2025-03-01",
    "PVUMCLB-": "2025-12-28",
    "VnjGPEp7": "2026-01-24",
    "_gbdUl_c": "2023-10-25",
    "zGnNQLzb": "2021-12-22",
    "v4LDWf5k": "2022-01-08",

    # spaced 3wk backward from earliest real date — approximate, old Daybreak/Perkatory batch
    "UhB5BQ2z": "2020-05-13",
    "0-n1fsR_": "2020-06-03",
    "dMqaXml9": "2020-06-24",
    "SpBNbmaV": "2020-07-15",
    "iShwZxoD": "2020-08-05",
    "b2sAFfvv": "2020-08-26",
    "KfwYakt_": "2020-09-16",
    "XaGYQ4Sj": "2020-10-07",
    "o1RzlMHV": "2020-10-28",
    "z-HVfNlB": "2025-08-25",
}

class Command(BaseCommand):
    help = "Backfill date_added for beans with known purchase dates."

    def add_arguments(self, parser):
        parser.add_argument('--commit', action='store_true',
                            help='Actually write. Without this, just prints the plan.')

    def handle(self, *args, **options):
        commit = options['commit']
        hits = misses = 0

        for short_id, date_str in KNOWN_DATES.items():
            naive = datetime.strptime(date_str, "%Y-%m-%d")
            target = timezone.make_aware(naive)

            if not Bean.objects.filter(short_id=short_id).exists():
                self.stdout.write(f"MISSING  {short_id}  (no such bean)")
                misses += 1
                continue

            self.stdout.write(f"{short_id}  →  {date_str}")
            hits += 1
            if commit:
                Bean.objects.filter(short_id=short_id).update(date_added=target)

        self.stdout.write(f"\n{hits} matched, {misses} missing")
        if not commit:
            self.stdout.write("dry run — pass --commit to write")