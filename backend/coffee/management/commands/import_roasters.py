from django.core.management.base import BaseCommand
from coffee.models import Roaster, Region, Countries

ROASTER_DATA = {
    'Daybreak': {'city': 'Glastonbury', 'region_code': '09', 'country': 'United States'},
    'Radial': {'city': 'Vernon', 'region_code': '09', 'country': 'United States'},
    'Perkatory': {'city': 'Southington', 'region_code': '09', 'country': 'United States'},
    'Rebel Dog': {'city': 'Farmington', 'region_code': '09', 'country': 'United States'},
    'Revelator': {'city': 'Birmingham', 'region_code': '01', 'country': 'United States'},
    'Atomic': {'city': 'New Orleans', 'region_code': '22', 'country': 'United States'},
    "Oren's": {'city': 'New York', 'region_code': '36', 'country': 'United States'},
    'Gimme!': {'city': 'Ithaca', 'region_code': '36', 'country': 'United States'},
    'City of Saints': {'city': 'New York', 'region_code': '36', 'country': 'United States'},
    'Caffe Vita': {'city': 'Seattle', 'region_code': '53', 'country': 'United States'},
    'Red Rooster': {'city': 'Floyd', 'region_code': '51', 'country': 'United States'},
    'Sparrows': {'city': 'Grand Rapids', 'region_code': '26', 'country': 'United States'},
    'Alma': {'city': 'Portland', 'region_code': '23', 'country': 'United States'},
    'Tandem': {'city': 'Portland', 'region_code': '23', 'country': 'United States'},
    'Verve': {'city': 'Santa Cruz', 'region_code': '06', 'country': 'United States'},
    'Madcap': {'city': 'Grand Rapids', 'region_code': '26', 'country': 'United States'},
    'Dune': {'city': 'Santa Barbara', 'region_code': '06', 'country': 'United States'},
    'Portrait': {'city': 'Atlanta', 'region_code': '13', 'country': 'United States'},
    'Huckleberry': {'city': 'Denver', 'region_code': '08', 'country': 'United States'},
    'Kuma': {'city': 'Seattle', 'region_code': '53', 'country': 'United States'},
    'Panther': {'city': 'Miami', 'region_code': '12', 'country': 'United States'},
    'Greater Goods': {'city': 'Austin', 'region_code': '48', 'country': 'United States'},
    'Equator': {'city': 'San Francisco', 'region_code': '06', 'country': 'United States'},
    'Steady State': {'city': 'Charleston', 'region_code': '45', 'country': 'United States'},
    'Perc': {'city': 'Savannah', 'region_code': '13', 'country': 'United States'},
    'Reanimator': {'city': 'Philadelphia', 'region_code': '42', 'country': 'United States'},
    "PT's": {'city': 'Wichita', 'region_code': '20', 'country': 'United States'},
    'Blueprint': {'city': 'St. Louis', 'region_code': '29', 'country': 'United States'},
    'Pastime Coffee': {'city': 'Portland', 'region_code': '41', 'country': 'United States'},
    'Good Citizen': {'city': 'Nashville', 'region_code': '47', 'country': 'United States'},
    'Joe Coffee': {'city': 'New York', 'region_code': '36', 'country': 'United States'},
    'Koffee Mameya': {'city': 'Tokyo', 'region_code': '13', 'country': 'Japan'},
    'AND Coffee Roasters': {'city': 'Kumamoto City', 'region_code': '43', 'country': 'Japan'},
    'Unlimited': {'city': 'Tokyo', 'region_code': '13', 'country': 'Japan'},
}

class Command(BaseCommand):
    help = 'Import roasters from CSV'

    def handle(self, *args, **kwargs):
        self.stdout.write('Importing roasters...')

        for name, data in ROASTER_DATA.items():
            country = Countries.objects.get(name=data['country'])
            region = Region.objects.get(identifier_code=data['region_code'], country_id=country.id)

            Roaster.objects.create(
                name=name,
                city=data['city'],
                country_id=country.id,
                region_id=region.id,
            )