// src/constants/routes/brewSessionsRoutes.jsx
//
// Brew Sessions: add/list session logging. Paths relative to /brew/sessions.
// Replaces the old top-level /brewSession routes. Stubbed until real pages exist.

import StubPage from '../../components/StubPage';

export const brewSessionOptions = [
  {
    id: 'AddBrewSession',
    title: 'New Brew Session',
    description: 'Log a new brew session',
    path: 'add',
    cardStyle: 'default',
    element: <StubPage label="New Brew Session" />,
  },
  {
    id: 'ListBrewSessions',
    title: 'List Brew Sessions',
    description: 'View brew session history',
    path: 'list',
    cardStyle: 'default',
    element: <StubPage label="List Brew Sessions" />,
  },
];

export const brewSessionOptionsMasked = []; // detail/edit added when pages exist

export const brewSessionsRouteList = [
  ...brewSessionOptions,
  ...brewSessionOptionsMasked,
];

// /brew/sessions is a sub-page under /brew -> show back
export const brewSessionsIsNavRoot = false;