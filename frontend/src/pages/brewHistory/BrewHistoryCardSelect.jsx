// src/pages/brewHistory/BrewHistoryCardSelect.jsx
import { NavCardGrid } from '../../pages';

const historyOptions = [
  { id: 'log', title: 'Log', description: 'Every brew, quick glance', path: 'log', cardStyle: 'default' },
  { id: 'by-style', title: 'By Style', description: 'Full detail per brew style', path: 'by-style', cardStyle: 'default' },
];

export default function BrewHistoryCardSelect() {
  return <NavCardGrid options={historyOptions} isNavRoot />;
}