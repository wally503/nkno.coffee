// src/constants/config/brew/_shared.js
//
// Shared brew-config helpers + constants.
// The base-path prefix lives here ONCE; entity configs append their own segment.
// The route/card generators live here so every entity produces its four routes
// and its menu card from a single config object — no hand-written per-entity routes.

import DynamicList from '../../../pages/depricated/DynamicList';
import DynamicForm from '../../../pages/depricated/DynamicForm';

export const CONTROLS_BASE = '/adjustments/controls';

// --- route generation -------------------------------------------------------
// A config maps to four routes. Paths are RELATIVE to the controls mount point
// (App.jsx mounts these under /adjustments/controls), so we use the entity key.
//   grinder -> grinders/list, grinders/add, grinders/edit/:shortid, grinders/view/:shortid
//
// `segment` is the URL chunk for this entity (usually pluralized key).
export const makeControlRoutes = (config) => {
  const seg = config.segment ?? `${config.key}s`;
  return [
    {
      path: `${seg}/list`,
      element: <DynamicList config={config} />,
    },
    {
      path: `${seg}/add`,
      element: <DynamicForm config={config} />,
    },
    {
      path: `${seg}/edit/:shortid`,
      element: <DynamicForm config={config} />,
    },
    {
      path: `${seg}/view/:shortid`,
      element: <DynamicForm config={config} />,
    },
  ];
};

// --- card generation --------------------------------------------------------
// A config maps to one menu card. Navigates to the entity's list.
export const makeControlCard = (config) => {
  const seg = config.segment ?? `${config.key}s`;
  return {
    id: config.key,
    title: config.labelPlural,
    description: `Manage ${config.labelPlural.toLowerCase()}`,
    path: `${seg}/list`,
    cardStyle: config.cardStyle,
  };
};