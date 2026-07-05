from django.core.management.base import BaseCommand
from coffee.models import Roaster, Region, Countries

ROASTER_NAME_MAP = {
    'Daybreak': 'Daybreak Coffee Roasters',
    'Radial': 'Radial Coffee Co.',
    'Perkatory': 'Perkatory Coffee Roasters',
    'Rebel Dog': 'Rebel Dog Coffee Co.',
    'Revelator': 'Revelator Coffee Company',
    'Atomic': 'Atomic Coffee Roasters',
    "Oren's": "Oren's Coffee",
    'Gimme!': 'Gimme! Coffee',
    'City of Saints': 'City of Saints Coffee Roasters',
    'Caffe Vita': 'Caffe Vita Coffee Roasting Co.',
    'Red Rooster': 'Red Rooster Coffee',
    'Sparrows': 'Sparrows Coffee',
    'Alma': 'Alma Coffee',
    'Tandem': 'Tandem Coffee Roasters',
    'Verve': 'Verve Coffee Roasters',
    'Madcap': 'Madcap Coffee Company',
    'Dune': 'Dune Coffee Roasters',
    'Portrait': 'Portrait Coffee',
    'Huckleberry': 'Huckleberry Roasters',
    'Kuma': 'Kuma Coffee',
    'Panther': 'Panther Coffee',
    'Greater Goods': 'Greater Goods Coffee Co.',
    'Equator': 'Equator Coffees',
    'Steady State': 'Steady State Roasting Co.',
    'Perc': 'PERC Coffee',
    'Reanimator': 'Reanimator Coffee',
    "PT's": "PT's Coffee",
    'Blueprint': 'Blueprint Coffee',
    'Pastime Coffee': 'Pastime Coffee',
    'Good Citizen': 'Good Citizen Coffee Co.',
    'Joe Coffee': 'Joe Coffee Company',
    'Koffee Mameya': 'Koffee Mameya',
    'AND Coffee Roasters': 'AND Coffee Roasters',
    'Unlimited': 'UNLIMITED COFFEE ROASTERS',
}

class Command(BaseCommand):
    help = 'Update Roasters from dataset'

    def handle(self, *args, **kwargs):
        self.stdout.write('Updating roasters...')

        for old_name, new_name in ROASTER_NAME_MAP.items():
            self.stdout.write(f'Updating {old_name} -> {new_name}')
            Roaster.objects.filter(name=old_name).update(name=new_name)