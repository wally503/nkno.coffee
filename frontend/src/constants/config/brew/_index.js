import { brewControlsRouteList } from './controls/_routes';
import { brewSessionsRouteList } from './sessions/_routes';
import { brewTemplatesRouteList } from './templates/_routes';

export const brewRoutes = {
  controls: brewControlsRouteList,
  sessions: brewSessionsRouteList,
  templates: brewTemplatesRouteList,
};

export const adjustmentOptionsRow = [
  {
    id: 'Templates',
    title: 'Templates',
    description: 'Add/Modify templates for sessions',
    path: 'templates',
    cardStyle: 'default',
  },
  {
    id: 'Controls',
    title: 'Controls',
    description: 'Add/Modify controls for templating',
    path: 'controls',
    cardStyle: 'default',
  },
];

export const adjustmentIsNavRoot = true;