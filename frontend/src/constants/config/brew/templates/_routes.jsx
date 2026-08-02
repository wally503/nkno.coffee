// src/constants/config/brew/templates/_routes.js
//
// Templates section route assembly. Stubbed until real template configs exist.
// (Recall: template + recipe are two entities — may become a multi-entity menu.)

import StubPage from '../../../../components/StubPage';
// import { makeEntityRoutes, makeEntityCard } from '../_shared';

// const dynamicConfigs = [ /* templateConfig, recipeConfig, ... */ ];

const stubCards = [
  {
    id: 'template-add',
    title: 'Add Template',
    description: 'Create a new brew template',
    path: 'add',
    cardStyle: 'default',
  },
  {
    id: 'template-list',
    title: 'List Templates',
    description: 'View existing brew templates',
    path: 'list',
    cardStyle: 'default',
  },
];

export const brewTemplateOptionsRow1 = [stubCards[0]];
export const brewTemplateOptionsRow2 = [stubCards[1]];

export const brewTemplatesRouteList = stubCards.map((c) => ({
  path: c.path,
  element: <StubPage label={c.title} />,
}));

export const brewTemplatesIsNavRoot = false;