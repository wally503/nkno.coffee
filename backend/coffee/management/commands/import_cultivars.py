from django.core.management.base import BaseCommand
from coffee.models import Cultivar

CULTIVARS = [

    "Ethiopian Heirloom", "74110", "74112", "74158", "Gesha", "Wush Wush",
    "Sudan Rume",

    "Typica", "Java", "Villa Sarchi", "Kent", "Blue Mountain", "Maragogipe",
    "Pacamara", "Laurina",

    "Bourbon", "Red Bourbon", "Yellow Bourbon", "Orange Bourbon",
    "Pink Bourbon", "Pacas", "Caturra", "Catuai", "Mundo Novo", "Sidra",
    "Tekisic", "SL28", "SL34", "K7",

    "Catimor", "Sarchimor", "Castillo", "Colombia", "Tabi", "Caturra x Timor",
    "Ruiru 11", "Batian", "Icatu", "Catucai", "Parainema", "Lempira",
    "IHCAFE 90", "Anacafe 14", "Marsellesa", "Centroamericano", "Mundo Maya",
    "Starmaya", "Evaluna", "Milenio", "Obata", "Costa Rica 95",
]

class Command(BaseCommand):
    help = 'Import cultivars for empty cultivar table'

    def handle(self, *args, **kwargs):
        self.stdout.write('Importing cultivars...')

        for cultvr in CULTIVARS:
            Cultivar.objects.create(
                name=cultvr
            )