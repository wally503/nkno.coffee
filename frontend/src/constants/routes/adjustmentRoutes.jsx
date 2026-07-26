// src/constants/routes/adjustmentRoutes.jsx
//
// Adjustments section. Top level = Templates | Controls.
// Controls forks to its own card menu of catalog entities (grinder, vessel, ...).
// Real brew pages don't exist yet, so destinations are stubbed with StubPage.

import StubPage from '../../components/StubPage';

// ---------------------------------------------------------------------------
// Top-level adjustment menu: Templates | Controls
// ---------------------------------------------------------------------------

export const adjustmentOptionsRow1 = [
  {
    id: 'Templates',
    title: 'Templates',
    description: 'Add/Modify templates for sessions',
    path: 'templates',
    cardStyle: 'default',
    element: <StubPage label="Templates" />,
  },
];

export const adjustmentOptionsRow2 = [
  {
    id: 'Controls',
    title: 'Controls',
    description: 'Add/Modify controls for templating',
    path: 'controls',
    cardStyle: 'default',
    element: <StubPage label="Controls" />, // replaced by ControlsCardSelect when built
  },
];

// ---------------------------------------------------------------------------
// Controls sub-menu: the catalog entities (flat, order-agnostic)
// Each forks to that entity's list/add surface (stubbed for now).
// ---------------------------------------------------------------------------

export const controlOptions = [
  {
    id: 'Grinders',
    title: 'Grinders',
    description: 'Manage grinders',
    path: 'controls/grinders/list',
    cardStyle: 'compact',
    element: <StubPage label="Grinders" />,
  },
  {
    id: 'GrinderSettings',
    title: 'Grinder Settings',
    description: 'Manage grinder settings',
    path: 'controls/grindersettings/list',
    cardStyle: 'compact',
    element: <StubPage label="Grinder Settings" />,
  },
  {
    id: 'Vessels',
    title: 'Vessels',
    description: 'Manage brew vessels',
    path: 'controls/vessels/list',
    cardStyle: 'compact',
    element: <StubPage label="Vessels" />,
  },
  {
    id: 'VesselSettings',
    title: 'Vessel Settings',
    description: 'Manage vessel settings (caps, filters)',
    path: 'controls/vesselsettings/list',
    cardStyle: 'compact',
    element: <StubPage label="Vessel Settings" />,
  },
  {
    id: 'Methods',
    title: 'Methods',
    description: 'Manage brew methods',
    path: 'controls/methods/list',
    cardStyle: 'compact',
    element: <StubPage label="Methods" />,
  },
  {
    id: 'Waters',
    title: 'Waters',
    description: 'Manage waters',
    path: 'controls/waters/list',
    cardStyle: 'compact',
    element: <StubPage label="Waters" />,
  },
  {
    id: 'Cups',
    title: 'Cups',
    description: 'Manage cups',
    path: 'controls/cups/list',
    cardStyle: 'compact',
    element: <StubPage label="Cups" />,
  },
  {
    id: 'Tools',
    title: 'Tools',
    description: 'Manage brew tools',
    path: 'controls/tools/list',
    cardStyle: 'compact',
    element: <StubPage label="Tools" />,
  },
];

// ---------------------------------------------------------------------------
// Router-consumed flat list
// ---------------------------------------------------------------------------

export const adjustmentOptions = [
  ...adjustmentOptionsRow1,
  ...adjustmentOptionsRow2,
  ...controlOptions,
];

export const adjustmentIsNavRoot = true; // /adjustments index is a nav root
export const controlsIsNavRoot = false; // /adjustments/controls is a sub-page (show back)