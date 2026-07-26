// src/constants/routes/brewTemplatesRoutes.jsx
//
// Brew Templates: add/list template management. Paths relative to /brew/templates.
// Stubbed until real template pages exist.

import StubPage from '../../components/StubPage';

export const brewTemplateOptionsRow1 = [
  {
    id: 'AddTemplate',
    title: 'Add Template',
    description: 'Create a new brew template',
    path: 'add',
    cardStyle: 'default',
    element: <StubPage label="Add Template" />,
  },
];

export const brewTemplateOptionsRow2 = [
  {
    id: 'ListTemplates',
    title: 'List Templates',
    description: 'View existing brew templates',
    path: 'list',
    cardStyle: 'default',
    element: <StubPage label="List Templates" />,
  },
];

export const brewTemplateOptionsMasked = []; // detail/edit added when pages exist

export const brewTemplatesRouteList = [
  ...brewTemplateOptionsRow1,
  ...brewTemplateOptionsRow2,
  ...brewTemplateOptionsMasked,
];

// /brew/templates is a sub-page under /brew -> show back
export const brewTemplatesIsNavRoot = false;