// src/pages/brew/newBrew/PickBrewStyle.jsx
import { NavCardGrid } from '../../../pages';

// Espresso / Latte-Cappuccino are shelved pending the mod kit — omitted
// entirely rather than shown-but-broken. Add them back once
// EspressoDetail/MilkDrinkDetail exist and have a real add route.
const brewStyleOptions = [
  { id: 'aeropress', title: 'Aeropress', description: 'Add a new Aeropress brew', path: 'aeropress/add', cardStyle: 'default' },
  { id: 'pourover', title: 'Pourover', description: 'Add a new Pourover brew', path: 'pourover/add', cardStyle: 'default' },
  { id: 'cold_brew', title: 'Cold Brew', description: 'Add a new Cold Brew batch', path: 'cold-brew/add', cardStyle: 'default' },
];

export default function PickBrewStyle() {
  return <NavCardGrid options={brewStyleOptions} isNavRoot />;
}