// src/constants/config/brew/history/_routes.jsx
//
// Brew History section route assembly. Log is built; By Style is still
// stubbed pending the tabbed per-style detail page.

import StubPage from '../../../../components/StubPage';
import ListBrewLogsPage from '../../../../pages/brewHistory/log/ListBrewLogsPage';

export const historyRouteList = [
  {
    path: 'log',
    element: <ListBrewLogsPage />,
  },
  {
    path: 'by-style',
    element: <StubPage label="By Style" />,
  },
];