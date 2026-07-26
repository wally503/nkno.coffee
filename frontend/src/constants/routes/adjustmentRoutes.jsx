// src/constants/routes/adjustmentRoutes.jsx
import { BeansFormPage, ListBeansPage } from '../../pages/coffeelog/beans/index';
import { RoasterCafeFormPage ,ListRoasterCafesPage } from '../../pages/coffeelog/roasters/index';
import { ListDrinksPage, DrinksFormPage } from '../../pages/coffeelog/drinks/index';

export const adjustmentOptionsRow1 = [
  {
    id: 'Templates',
    title:'Templates',
    description: 'Add/Modify Templates for Sessions',
    path: 'adjustments/templates',
    element: <BeansFormPage />
  }
];

export const adjustmentOptionsRow2 = [
  {
    id: 'Controls',
    title:'Controls',
    description: 'Add/Modify Controls for Templating',
    path: 'adjustments/controls',
    element: <ListBeansPage />
  }
];

const detailModes = ['view', 'edit'];

const makeDetailRoutes = (entity, Component) =>
  detailModes.map(mode => ({
    id: `${mode}${entity}`,
    path: `${entity}/${mode}/:shortid`,
    element: <Component mode={mode} />,
  }));

export const adjustmentOptionsMasked = [
  ...makeDetailRoutes('beans', BeansFormPage),
  ...makeDetailRoutes('roasters', RoasterCafeFormPage),
  ...makeDetailRoutes('drinks', DrinksFormPage),
];

export const adjustmentOptions = [
  ...adjustmentOptionsRow1,
  ...adjustmentOptionsRow2,
  ...adjustmentOptionsMasked
];