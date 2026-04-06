from django.db import migrations, models
import nanoid
from datetime import date

def generate_short_ids(apps, schema_editor):
    Drink = apps.get_model('coffee', 'Drink')
    for drink in Drink.objects.all():
        drink.short_id = nanoid.generate(size=8)
        if not drink.drink_date:
            drink.drink_date = date.today()
        drink.save()


class Migration(migrations.Migration):

    dependencies = [
        ('coffee', '0004_alter_drink_drink_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='drink',
            name='short_id',
            field=models.CharField(blank=True, max_length=10, default=''),
        ),
        migrations.RunPython(generate_short_ids),
        migrations.AlterField(
            model_name='drink',
            name='short_id',
            field=models.CharField(blank=True, max_length=10, unique=True),
        ),
    ]