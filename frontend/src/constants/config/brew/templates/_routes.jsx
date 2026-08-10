// src/constants/config/brew/templates/_routes.js
//
// Templates section route assembly. Stubbed until real template configs exist.
// (Recall: template + recipe are two entities — may become a multi-entity menu.)

import { makeControlRoutes, makeControlCard } from '../_shared';
import { recipieConfig } from './recipieConfig';
import { recipieTemplateConfig } from './recipieTemplateConfig';

const dynamicConfigs = [ recipieConfig, recipieTemplateConfig ];

export const brewTemplateOptionsRow1 = [recipieConfig].map(makeControlCard);
export const brewTemplateOptionsRow2 = [recipieTemplateConfig].map(makeControlCard);

const dynamicRoutes = dynamicConfigs.flatMap(makeControlRoutes);

export const brewTemplatesRouteList = [
  ...dynamicRoutes,
];

export const brewTemplatesIsNavRoot = false;