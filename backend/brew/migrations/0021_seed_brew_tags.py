from django.db import migrations

# (slug, name, category, methods, color)
TAGS = [
    # shared
    ("too-coarse", "Too Coarse", "con", [], ""),
    ("too-fine", "Too Fine", "con", [], ""),
    ("lack-of-bloom", "Lack of Bloom", "con", [], ""),
    ("strong-bloom", "Strong Bloom", "other", [], ""),
    ("dead-beans", "Using Dead Beans", "other", [], "#2BB5C7"),
    # espresso
    ("channeling", "Channeling", "con", ["espresso"], ""),
    ("too-fast", "Too Fast", "con", ["espresso"], ""),
    # aeropress
    ("too-thin", "Too Thin", "con", ["aeropress"], ""),
    ("too-much-body", "Too Much Body", "con", ["aeropress"], ""),
    ("fast-hiss", "Fast Hiss", "con", ["aeropress"], ""),
    ("slow-hiss", "Slow Hiss", "con", ["aeropress"], ""),
    # pourover
    ("walling", "Walling", "other", ["pourover"], ""),
    ("slow", "Slow", "con", ["pourover"], ""),
    ("fast", "Fast", "con", ["pourover"], ""),
    # positive
    ("balanced", "Balanced", "pro", [], ""),
    ("clear-notes", "Clear Notes", "pro", [], ""),
    ("loved", "Loved", "great", [], ""),
    # catastrophes (placeholders, replace with yours)
    ("spilled", "Spilled", "catastrophe", [], ""),
    ("wrong-dose", "Wrong Dose", "catastrophe", [], ""),
]

def seed(apps, schema_editor):
    BrewTag = apps.get_model("brew", "BrewTag")
    for i, (slug, name, cat, methods, color) in enumerate(TAGS):
        BrewTag.objects.update_or_create(
            slug=slug,
            defaults=dict(name=name, category=cat, methods=methods,
                          color=color, sort_order=i),
        )

class Migration(migrations.Migration):
    dependencies = [("brew", "0020_brewtag_brewlog_tags")]   # keep the generated value
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]