// src/constants/config/brew/sessions/_routes.js
//
// Sessions section route assembly. Stubbed until real session configs exist.
// When built: import config -> add to dynamicConfigs -> card + routes generate.

import StubPage from '../../../../components/StubPage';
// import { makeEntityRoutes, makeEntityCard } from '../_shared';

// const dynamicConfigs = [ /* sessionConfig, ... */ ];

const stubCards = [
  {
    id: 'session-add',
    title: 'New Brew Session',
    description: 'Log a new brew session',
    path: 'sessions/add',
    cardStyle: 'default',
  },
  {
    id: 'session-list',
    title: 'List Brew Sessions',
    description: 'View brew session history',
    path: 'sessions/list',
    cardStyle: 'default',
  },
];

export const brewSessionOptionsRow1 = [stubCards[0]];
export const brewSessionOptionsRow2 = [stubCards[1]];

export const brewSessionsRouteList = stubCards.map((c) => ({
  path: c.path,
  element: <StubPage label={c.title} />,
}));

export const brewSessionsIsNavRoot = true;