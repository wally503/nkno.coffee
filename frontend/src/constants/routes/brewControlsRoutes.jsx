// src/constants/routes/brewControlsRoutes.jsx
//
// Brew Controls: the equipment catalog entities. Flat menu (order-agnostic).
// Paths are relative to /brew/controls, so 'grinders/list' -> /brew/controls/grinders/list
// Destinations stubbed until the generic list/add pages are built.

import StubPage from '../../components/StubPage';

export const brewControlOptionsRow1 = [
  {
    id: 'Grinders',
    title: 'Grinders',
    description: 'Manage grinders',
    path: 'grinders/list',
    cardStyle: 'compact',
    element: <StubPage label="Grinders" />,
  },
  {
    id: 'GrinderSettings',
    title: 'Grinder Settings',
    description: 'Manage grinder settings',
    path: 'grindersettings/list',
    cardStyle: 'compact',
    element: <StubPage label="Grinder Settings" />,
  },
  {
    id: 'Vessels',
    title: 'Vessels',
    description: 'Manage brew vessels',
    path: 'vessels/list',
    cardStyle: 'compact',
    element: <StubPage label="Vessels" />,
  },
  {
    id: 'VesselSettings',
    title: 'Vessel Settings',
    description: 'Manage vessel settings (caps, filters)',
    path: 'vesselsettings/list',
    cardStyle: 'compact',
    element: <StubPage label="Vessel Settings" />,
  }
];

export const brewControlOptionsRow2 = [
  {
    id: 'Methods',
    title: 'Methods',
    description: 'Manage brew methods',
    path: 'methods/list',
    cardStyle: 'compact',
    element: <StubPage label="Methods" />,
  },
  {
    id: 'Waters',
    title: 'Waters',
    description: 'Manage waters',
    path: 'waters/list',
    cardStyle: 'compact',
    element: <StubPage label="Waters" />,
  },
  {
    id: 'Cups',
    title: 'Cups',
    description: 'Manage cups',
    path: 'cups/list',
    cardStyle: 'compact',
    element: <StubPage label="Cups" />,
  },
  {
    id: 'Tools',
    title: 'Tools',
    description: 'Manage brew tools',
    path: 'tools/list',
    cardStyle: 'compact',
    element: <StubPage label="Tools" />,
  },
];

// consumed by the router
export const brewControlOptionsMasked = []; // detail/edit routes added when pages exist

export const brewControlsRouteList = [
  ...brewControlOptionsRow1,
  ...brewControlOptionsRow2,
  ...brewControlOptionsMasked,
];

// /brew/controls is a sub-page under the /brew hub -> show back card
export const brewControlsIsNavRoot = false;