// src/constants/routes/brewControlsRoutes.jsx
//
// Brew Controls: equipment catalog entities.
// Entities with a real config generate their card + 4 routes automatically.
// Not-yet-built entities are plain stub cards (no dynamic routes yet).
//
// To add a built entity: import its config, drop it in `dynamicConfigs`.
// Its card AND its list/add/edit/view routes appear automatically.

import StubPage from '../../../../components/StubPage';
import { makeControlRoutes, makeControlCard } from '../_shared';

import { grinderConfig } from './grinderConfig';
import { vesselConfig } from './vesselConfig';

// entities that have real dynamic pages
const dynamicConfigs = [
  grinderConfig,
  vesselConfig,
];

// stub cards for entities not yet built (display only, no dynamic routes)
const stubCards = [
  {
    id: 'grindersetting',
    title: 'Grinder Settings',
    description: 'Manage grinder settings',
    path: 'grindersettings/list',
    cardStyle: 'compact',
    stub: true,
  },
  {
    id: 'vesselsetting',
    title: 'Vessel Settings',
    description: 'Manage vessel settings (caps, filters)',
    path: 'vesselsettings/list',
    cardStyle: 'compact',
    stub: true,
  },
  {
    id: 'method',
    title: 'Methods',
    description: 'Manage brew methods',
    path: 'methods/list',
    cardStyle: 'compact',
    stub: true,
  },
  {
    id: 'water',
    title: 'Waters',
    description: 'Manage waters',
    path: 'waters/list',
    cardStyle: 'compact',
    stub: true,
  },
  {
    id: 'cup',
    title: 'Cups',
    description: 'Manage cups',
    path: 'cups/list',
    cardStyle: 'compact',
    stub: true,
  },
  {
    id: 'tool',
    title: 'Tools',
    description: 'Manage brew tools',
    path: 'tools/list',
    cardStyle: 'compact',
    stub: true,
  },
];

// --- cards for the menu -----------------------------------------------------
// generated cards (from real configs) + stub cards, in display order
const generatedCards = dynamicConfigs.map(makeControlCard);

// keep your two-row layout: split however you like; here first 4 / rest
const allCards = [...generatedCards, ...stubCards];
export const brewControlOptionsRow1 = allCards.slice(0, 4);
export const brewControlOptionsRow2 = allCards.slice(4);

// --- routes for the router --------------------------------------------------
// real entities -> 4 routes each; stubs -> a single stub list route
const dynamicRoutes = dynamicConfigs.flatMap(makeControlRoutes);
const stubRoutes = stubCards.map((c) => ({
  path: c.path,
  element: <StubPage label={c.title} />,
}));

export const brewControlsRouteList = [
  ...dynamicRoutes,
  ...stubRoutes,
];

// /adjustments/controls is a sub-page under adjustments -> show back card
export const brewControlsIsNavRoot = false;