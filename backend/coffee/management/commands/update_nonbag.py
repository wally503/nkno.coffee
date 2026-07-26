from datetime import datetime
from django.utils import timezone
from coffee.models import Bean

dates = {
    "j7rA1Hsi": "2024-05-12",   # Kielo Guji Anasora
    "lFS1U17R": "2024-05-02",   # Liliana Burbano Bolanos (Code Black)
    "wvG5CzLM": "2024-05-02",   # La Palma y El Tucan (Leaves)
    "7PNG7Jln": "2024-06-14",   # Iris Estate Geisha
}

for sid, date_str in dates.items():
    Bean.objects.filter(short_id=sid).update(
        date_added=timezone.make_aware(datetime.strptime(date_str, "%Y-%m-%d"))
    )
    print(f"{sid} → {date_str}")